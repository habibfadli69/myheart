// var mongoose = require('mongoose');
// var passport = require('passport');
// var config = require('../config/database');
// require('../config/passport')(passport);
// var jwt = require('jsonwebtoken');
// var sapiRepositories = require('../repositories/sapi.repositories');
// var Token = require('../services/TokenAuthentication');
// var Response = require('../services/Response');

// module.exports = {
  
    createPerangkat: async(req,res)=>{
        let response = new Response()
        try{
            response.setData(await perangkatRepositories.createPasien(req.body.idDokter,req.body.namaPasien,req.body.umurPasien,req.body.alamatPasien,req.body.tinggiPasien,req.body.beratPasien,req.body.nik))

        }catch(e){
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    }
//   getDataToday : async(req,res)=>{
//     let token = Token.authorizationToken(req.headers);
//     var today = new Date();
//     var yesterday = new Date();
//     yesterday.setDate(today.getDate()-1);
//       if(token){
//         let response = new Response()
//         try {
//           response.setData(await pasienRepositories.getPasienOnSpecificTime(req.body.idPasien,yesterday.toISOString(),today.toISOString()))
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response)  
//       }else{
//         res.json(response.unAuthorized());
//       }
//   },

//   getDataInTime : async(req,res)=>{
//     let token = Token.authorizationToken(req.headers);
//     var start_temp = new Date(req.body.start) 
//     var end_temp = new Date(req.body.end)
//     var start = start_temp.toISOString()
//     var end = end_temp.toISOString()
//     // var start = req.body.start;
//     // var yesterday = req.body.end;
//       if(token){
//         let response = new Response()
//         try {
//           response.setData(await pasienRepositories.getPasienOnSpecificTime(req.body.idPasien,start,end))
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response)  
//       }else{
//         res.json(response.unAuthorized());
//       }
//   },

//   pasien_show_by_doctor: async(req, res)=>{
//     let token = Token.authorizationToken(req.headers);
    
//     if(token){
//       let result_decode = jwt.verify(token, config.secret)
//       let response = new Response()
//         try {
//           response.setData(await pasienRepositories.getPasienByDoctors(result_decode._doc._id))
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response) 
//     }else{
//       res.json(response.unAuthorized());
//     }
//   },
  
//   get_requested_pasien: async(req,res)=>{
//     let token = Token.authorizationToken(req.headers)
//     if(token){
//       let response = new Response()
//         try {
//           response.setData(await pasienRepositories.getRequestPasien())
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response)
//     }else{
//       res.json(response.unAuthorized());
//     }
//   },

//   pasien_show_all: async(req, res)=>{
//     let token = Token.authorizationToken(req.headers); 
//     if(token){
//       let response = new Response()
//         try {
//           response.setData(await pasienRepositories.getAllPasien())
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response) 
//     }else{
//       res.json(response.unAuthorized());
//     }
//   },

//   data_update: async(req, res)=>{
//     let response = new Response()
//     try{
//       response.setData(await pasienRepositories.streamUpdateData(req.body.thermal,req.body.heartrate,req.body.oxygen,req.body.conductivity,req.body.resistance,req.body.conductancevoltage,req.body.emg,req.body.ecg,status,req.params.id))
//     }catch(e){
//       response.setStatus(false)
//       response.setMessage(e)
//     }
//     res.json(response) 
//   },

//   update_pasien: async(req,res)=>{
//     let response = new Response()
//     try{
//       response.setData(await pasienRepositories.updatePasien(req.params.id, req.body))
//     }catch(e){
//       response.setStatus(false)
//       response.setMessage(e)
//     }
//     res.json(response)
//   },

//   delete_pasien: async(req, res)=>{
//     let response = new Response();
//     try{
//       response.setData(await pasienRepositories.deletePasien(req.params.id))
//     }catch(e){
//       response.setStatus(false)
//       response.setMessage(e)
//     }
//     res.json(response)
//   },

//   detail_pasien: async(req,res)=>{
//     let token = Token.authorizationToken(req.headers);
//       if(token){
//         let response = new Response()
//         try {
//           response.setData(await pasienRepositories.detailPasien(req.params.id))
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response)  
//       }else{
//         res.json(response.unAuthorized());
//       }
//   },
  
//   create_pasien: async(req,res)=>{
//     let token = Token.authorizationToken(req.headers);
    
//     if(token){
//       let result_decode = jwt.verify(token, config.secret)
//       let response = new Response()
//         try {
//           response.setData(await pasienRepositories.createPasien(result_decode._doc._id,req.body.namaPasien,req.body.umurPasien,req.body.alamatPasien,req.body.tinggiPasien,req.body.beratPasien))
//         } catch (e) {
//           response.setStatus(false)
//           response.setMessage(e)
//         }
//         res.json(response) 
//     }else{
//       res.json(response.unAuthorized());
//     }
//   }
// }
