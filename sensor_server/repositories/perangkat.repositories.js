var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var Perangkat = require("../models/perangkat.model");
const socketApp = require('../socket/socket-app');

const perangkatRepositories = {
    createPasien : async(idDokter,namaPasien,umurPasien,alamatPasien,tinggiPasien,beratPasien,nik)=>{
      var subData = {
        tanggal : new Date(),
        temperature : 0,
        heartrate: 0,
        oxygen : 0,
        conductance : 0,
        resistance : 0,
        conductancevoltage : 0,
        ecg : 0,
        emg : 0,
        kondisi : 0
      }
      let subPasien = {
          nik : nik,
          namaPasien : namaPasien,
          umurPasien : umurPasien,
          alamatPasien : alamatPasien,
          tinggiPasien : tinggiPasien,
          beratPasien : beratPasien,
          statusPasien : 0,
          data: [subData]
      }
      var newPerangkat = new Perangkat({
            idDokter: idDokter,
            pasien:[subPasien]
        })
        var savePerangkat = await newPerangkat.save()
        if(savePerangkat){
            return savePerangkat
        }
    },
    updateData : async(id,temperature,heartrate,oxygen,conductance,resistance,conductancevoltage,ecg,emg)=>{
        var tmpKondisi = 1
        var today = new Date()
        if(Number(heartrate) <= 60 || Number(heartrate) >= 100 || Number(oxygen) <= 95 || Number(oxygen) >=100){
            tmpKondisi = 0
        }
        let perangkatUpdate = await Perangkat.update({
            _id:id,
            "pasien.statusPasien" : 1
        },
        {
        $push:{
            "pasien.$.data":{
                tanggal : today,
                temperature : Number(temperature),
                heartrate: Number(heartrate),
                oxygen : Number(oxygen),
                conductance : Number(conductance),
                resistance : Number(resistance),
                conductancevoltage : Number(conductancevoltage),
                ecg : Number(ecg),
                emg : Number(emg),
                kondisi : tmpKondisi
            }
        }
        
    })
    if(perangkatUpdate){
        let perangkatAfterUpdt = await Perangkat.findById(id)
        socketApp.notifyPasienData(id, perangkatAfterUpdt)
        return perangkatAfterUpdt
    }
    },
    getAllData: async()=>{
    let result = await Perangkat.find()
     return result
   }
}
module.exports = perangkatRepositories
// var mongoose = require('mongoose');
// var passport = require('passport');
// var config = require('../config/database');
// require('../config/passport')(passport);
// var jwt = require('jsonwebtoken');
// var Pasien = require("../models/pasien.model");
// const socketApp = require('../socket/socket-app');
// var ObjectId = require('mongoose').Types.ObjectId;
// var dokterRepositories = require('../repositories/dokter.repositories');
// var Constants = require('../services/Constants');


// const pasienRepositories = {
//   createPasien: async(idDokter,namaPasien,umurPasien,alamatPasien,tinggiPasien,beratPasien)=>{
//     var status_initial = 0  
//     let subData = {
//          tanggal : new Date(),
//          thermal : 0,
//          heartrate : 0,
//          oxygen : 0,
//          conductivity : 0,
//          resistance : 0,
//          conductancevoltage : 0,
//          emg : 0,
//          ecg :0,
//          kondisi:0
//     }
//     let perangkat = {
//         status:status_initial,
//         data:[subData]
//     }
//     var newPasien = new Pasien({
//         idDokter:idDokter,
//         namaPasien:namaPasien,
//         umurPasien:umurPasien,
//         alamatPasien:alamatPasien,
//         tinggiPasien:tinggiPasien,
//         beratPasien:beratPasien,
//         perangkat:perangkat
//     })
//     let savePasien = newPasien.save()
//     if(savePasien){
//         return savePasien
//     }
//   },
//   getPasienOnSpecificTime: async(id,start,end)=>{
//     let result = await Pasien.aggregate(

//         // Pipeline
//         [
//           // Stage 1
//           {
//             $match: {
//                 _id: new ObjectId(id)
            
//             }
//           },
      
//           // Stage 2
//           {
//             $unwind: {
//                 path : "$perangkat.data",
//                 includeArrayIndex : "arrayIndex", // optional
//                 preserveNullAndEmptyArrays : false // optional
//             }
//           },
      
//           // Stage 3
//           {
//             $match: {
//                 "perangkat.data.tanggal": {
//                     $gte: new Date(start),
//                     $lte : new Date(end)
//                     }
//             }
//           },
      
//           // Stage 4
//           {
//             $group: {
//                 _id:{_id : "$_id",idDokter: "$idDokter",namaPasien: "$namaPasien",status: "$perangkat.status",idPerangkat:"$perangkat.idPerangkat"},
//                 listResult : {$push: "$perangkat.data"}
                
//             }
//           },
      
//           // Stage 5
//           {
//             $project: {
//                 // specifications
//                 _id : "$_id._id",
//                 idDokter: "$_id.idDokter",
//                 namaPasien: "$_id.namaPasien",
//                 perangkat:{
//                   status : "$_id.status",
//                   data: "$listResult",
//                   idPerangkat: "$_id.idPerangkat"
                  
//                 }
                
//             }
//           }
      
//         ])
//         return result;
//   },
 
//   getPasienByDoctors: async(id)=>{
//     let checkDokter = await doctorRepositories.getDoctorByIdUser(id)
//       if(checkDoctor){
//         let result = await Pasien.find({
//           idDokter:checkDoctor._id
//         })
//         return result;
//       }
//   },

//   getAllPasien: async()=>{
//     let result = await pasien.find()
//     return result
//   },
  
//   streamUpdateData : async(thermal, heartrate, oxygen, conductance, resistance, conductancevoltage, emg, ecg, status, id) => {
//     var today = new Date();
//     /**
//      * condition dairy cows healty status
//      */
//     var tmpSuhu = Number(suhu)
//     var tmpJantung = Number(jantung)
//     var tmpKondisi = Constants.NORMAL_CONDITION
//     if (tmpJantung < Constants.HEARTRATE_LOWER_LIMIT || tmpJantung > Constants.HEARTRATE_UPPER_LIMIT || tmpSuhu < Constants.TEMPERATURE_LOWER_LIMIT || tmpSuhu > Constants.TEMPERATURE_UPPER_LIMIT) {
//       /**
//        * Abnormal
//        */
//       tmpKondisi = Constants.ABNORMAL_CONDITION
      

//     let pasienOnUpdate =  await 
//     Pasien.update({
//       _id:id
//     },
//     {
//       $set: {
//         "perangkat.status": status
//       },
//       $push: {
//         "perangkat.data": {
//           tanggal: today,
//           suhu: suhu,
//           jantung: jantung,
//           kondisi: tmpKondisi
//           }
//         }
//       }
//     )
//     if(pasienOnUpdate){
//       let pasienAfterUpdated = await Pasien.findById(id)
//       if(pasienAfterUpdated){
//         /**
//          * create topic each cows, and emmit when update data..
//          */
//         socketApp.notifyDetailPatients(id, pasienAfterUpdated)
//         /**
//          * get cows by farmers and emit
//          */
//         let emitToSocket = await Pasien.find({
//           idDokter: pasienAfterUpdated.idDokter
//         })
//         if(emitToSocket){
//           /**
//            * emit data
//            */
//           socketApp.notifyPatientsData(pasienAfterUpdated.idDokter, emitToSocket)
//           return pasienAfterUpdated
//         }

//       }
//     }
//   },

//   updatePasien : async(id, body)=>{
//     let result = await Pasien.findByIdAndUpdate(id, {
//       $set: body
//     })
//     return result
//   },

//   deletePasien: async(id)=>{
//     let result = await Pasien.findByIdAndRemove(id)
//     return result
//   },

//   detailPasien: async(id)=>{
//     let result = await Pasien.findById(id)
//     return result
//   },

//   createPasien: async(id, namaPasien)=>{
//     let checkDokter = await dokterRepositories.getDokterByIdUser(id)
//     if(checkDokter){
//       /**
//          * initial first data,
//          * perangkat status
//          * 1 -> active
//          * 0 -> non-active
//          * 2 -> pending
//          * kondisi
//          * 1 -> normal
//          * 0 -> tidak normal
//          */
//         var today = new Date();
//         var initial_suhu = 38;
//         var initial_jantung = 49;
//         var initial_status = Constants.DEVICE_PENDING;
//         var initial_kondisi = Constants.NORMAL_CONDITION;

//         let sub_data = {
//           tanggal: today,
//           suhu: initial_suhu,
//           jantung: initial_jantung,
//           kondisi: initial_kondisi
//         }

//         let sub_perangkat = {
//           status: initial_status,
//           data: [sub_data]
//         }
//         var newPasien = new Pasien({
//           idDokter: checkDokter._id,
//           namaPasien: namaPasien,
//           perangkat: sub_perangkat

//         });
//         let savePasien = await newPasien.save()
//         if(savePasien){
//           let createOnRaspi = await ConnectRaspi.createInitial(savePasien._id)
//           if(createOnRaspi){
//             let updatePasien = await 
//             Pasien.update({
//               _id: savePasien._id
//             },{
//               $set: {
//                 "perangkat.idOnRaspi": createOnRaspi.data.perangkat._id
//               }
//             }
//           )
//           if(updatePasien){
//             return createOnRaspi.data
//           }
//           }
//         }
     
//     }
//   },

//   getRequestPasien: async()=>{
//     let result = await Pasien.aggregate(
//       // Pipeline
//       [
//         // Stage 1
//         {
//           $match: {
//               "perangkat.status":Constants.DEVICE_PENDING
          
//           }
//         },

//         // Stage 2
//         {
//           $lookup: // Equality Match
//           {
//               from: "dokters",
//               localField: "idDokter",
//               foreignField: "_id",
//               as: "dokter_docs"
//           }
          
//           // Uncorrelated Subqueries
//           // (supported as of MongoDB 3.6)
//           // {
//           //    from: "<collection to join>",
//           //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
//           //    pipeline: [ <pipeline to execute on the collection to join> ],
//           //    as: "<output array field>"
//           // }
//         },

//       ]

//       // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
//     )
//     return result
//   }

// }

// module.exports = pasienRepositories