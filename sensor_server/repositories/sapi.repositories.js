var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Sapi = require("../models/sapi.model");
const socketApp = require('../socket/socket-app');
var ObjectId = require('mongoose').Types.ObjectId;
var peternakRepositories = require('../repositories/peternak.repositories');
var ConnectRaspi = require('../services/ConnectRaspi');
var Constants = require('../services/Constants');
var admin = require("firebase-admin");
var serviceAccount = require("../seecowapp-firebase-adminsdk-3hlhu-22888ee3ed.json");
/**
 * initial FCM app
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seecowapp.firebaseio.com"
});
const sapiRepositories = {
  getSapiOnSpecificTime: async(id,start,end)=>{
    let result = await Sapi.aggregate(

        // Pipeline
        [
          // Stage 1
          {
            $match: {
                _id: new ObjectId(id)
            
            }
          },
      
          // Stage 2
          {
            $unwind: {
                path : "$perangkat.data",
                includeArrayIndex : "arrayIndex", // optional
                preserveNullAndEmptyArrays : false // optional
            }
          },
      
          // Stage 3
          {
            $match: {
                "perangkat.data.tanggal": {
                    $gte: new Date(start),
                    $lte : new Date(end)
                    }
            }
          },
      
          // Stage 4
          {
            $group: {
                _id:{_id : "$_id",idPeternak: "$idPeternak",namaSapi: "$namaSapi",status: "$perangkat.status",idOnRaspi:"$perangkat.idOnRaspi"},
                listResult : {$push: "$perangkat.data"}
                
            }
          },
      
          // Stage 5
          {
            $project: {
                // specifications
                _id : "$_id._id",
                idPeternak: "$_id.idPeternak",
                namaSapi: "$_id.namaSapi",
                perangkat:{
                  status : "$_id.status",
                  data: "$listResult",
                  idOnRaspi: "$_id.idOnRaspi"
                  
                }
                
            }
          }
      
        ])
        return result;
  },
  getSapiByFarmers: async(id)=>{
    let checkPeternak = await peternakRepositories.getPeternakByIdUser(id)
      if(checkPeternak){
        let result = await Sapi.find({
          idPeternak:checkPeternak._id
        })
        return result;
      }
  },
  getAllSapi: async()=>{
    let result = await Sapi.find()
    return result
  },
  
  streamUpdateData : async(suhu, jantung, status,id) => {
    var today = new Date();
    /**
     * condition dairy cows healty status
     */
    var tmpSuhu = Number(suhu)
    var tmpJantung = Number(jantung)
    var tmpKondisi = Constants.NORMAL_CONDITION
    if (tmpJantung < Constants.HEARTRATE_LOWER_LIMIT || tmpJantung > Constants.HEARTRATE_UPPER_LIMIT || tmpSuhu < Constants.TEMPERATURE_LOWER_LIMIT || tmpSuhu > Constants.TEMPERATURE_UPPER_LIMIT) {
      /**
       * Abnormal
       */
      tmpKondisi = Constants.ABNORMAL_CONDITION
      
      /**
       * Push notif to FCM
       */
      let sapiInform = await Sapi.findById(id)
           
      var registrationToken = "dApGNjvtYws:APA91bF-kHVAHVXQ6EZLMtPU1LgesKtIOuWBOlXhvzjf1uo-NF5U6IVsfFK03FtHshUaN0_41ohu9oJwHjBSCa207zmcxeBRvTpBNBkljj1OpgOWHNrDh9Bb6yoCOY26a-PvgKysAQas";
      var payload = {
        notification: {
          title: sapiInform.namaSapi + " is abnormal !!",
          body: "Please open yours Seecow App and let's check your cows.."
        }
      };
      
       var options = {
        priority: "high",
        timeToLive: 60 * 60 *24
      };
      // admin.messaging().sendToDevice(registrationToken, payload, options)
      //   .then(function(response) {
      //     console.log("Successfully sent message:", response);
      //   })
      //   .catch(function(error) {
      //     console.log("Error sending message:", error);
      //   });
    }
    let sapiOnUpdate =  await 
    Sapi.update({
      _id:id
    },
    {
      $set: {
        "perangkat.status": status
      },
      $push: {
        "perangkat.data": {
          tanggal: today,
          suhu: suhu,
          jantung: jantung,
          kondisi: tmpKondisi
          }
        }
      }
    )
    if(sapiOnUpdate){
      let sapiAfterUpdated = await Sapi.findById(id)
      if(sapiAfterUpdated){
        /**
         * create topic each cows, and emmit when update data..
         */
        socketApp.notifyDetailCows(id, sapiAfterUpdated)
        /**
         * get cows by farmers and emit
         */
        let emitToSocket = await Sapi.find({
          idPeternak: sapiAfterUpdated.idPeternak
        })
        if(emitToSocket){
          /**
           * emit data
           */
          socketApp.notifyCowsData(sapiAfterUpdated.idPeternak, emitToSocket)
          return sapiAfterUpdated
        }

      }
    }
  },
  updateSapi : async(id, body)=>{
    let result = await Sapi.findByIdAndUpdate(id, {
      $set: body
    })
    return result
  },
  deleteSapi: async(id)=>{
    let result = await Sapi.findByIdAndRemove(id)
    return result
  },
  detailSapi: async(id)=>{
    let result = await Sapi.findById(id)
    return result
  },
  createSapi: async(id, namaSapi)=>{
    let checkPeternak = await peternakRepositories.getPeternakByIdUser(id)
    if(checkPeternak){
      /**
         * initial first data,
         * perangkat status
         * 1 -> active
         * 0 -> non-active
         * 2 -> pending
         * kondisi
         * 1 -> normal
         * 0 -> tidak normal
         */
        var today = new Date();
        var initial_suhu = 38;
        var initial_jantung = 49;
        var initial_status = Constants.DEVICE_PENDING;
        var initial_kondisi = Constants.NORMAL_CONDITION;
        let sub_data = {
          tanggal: today,
          suhu: initial_suhu,
          jantung: initial_jantung,
          kondisi: initial_kondisi
        }

        let sub_perangkat = {
          status: initial_status,
          data: [sub_data]
        }
        var newSapi = new Sapi({
          idPeternak: checkPeternak._id,
          namaSapi: namaSapi,
          perangkat: sub_perangkat

        });
        let saveSapi = await newSapi.save()
        if(saveSapi){
          let createOnRaspi = await ConnectRaspi.createInitial(saveSapi._id)
          if(createOnRaspi){
            let updateSapi = await 
            Sapi.update({
              _id: saveSapi._id
            },{
              $set: {
                "perangkat.idOnRaspi": createOnRaspi.data.perangkat._id
              }
            }
          )
          if(updateSapi){
            return createOnRaspi.data
          }
          }
        }
     
    }
  },
  getRequestSapi: async()=>{
    let result = await Sapi.aggregate(
      // Pipeline
      [
        // Stage 1
        {
          $match: {
              "perangkat.status":Constants.DEVICE_PENDING
          
          }
        },

        // Stage 2
        {
          $lookup: // Equality Match
          {
              from: "peternaks",
              localField: "idPeternak",
              foreignField: "_id",
              as: "peternak_docs"
          }
          
          // Uncorrelated Subqueries
          // (supported as of MongoDB 3.6)
          // {
          //    from: "<collection to join>",
          //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
          //    pipeline: [ <pipeline to execute on the collection to join> ],
          //    as: "<output array field>"
          // }
        },

      ]

      // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
    )
    return result
  }

}

module.exports = sapiRepositories