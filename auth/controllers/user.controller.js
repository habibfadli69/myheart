var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../models/user");
var Book = require("../models/book");
var Peternak = require("../models/peternak.model");
var userRepositories = require('../repositories/user.repositories');
var Token = require('../services/TokenAuthentication');
var Response = require('../services/Response');

//Simple version, without validation or sanitation
module.exports = {
  peternak_signup: async(req,res)=>{
    let response = new Response()
    if (!req.body.username || !req.body.password || !req.body.nama || !req.body.alamat || !req.body.telp) {
      response.setStatus(false)
      response.setMessage('Please pass the require form')
    }else{
      try{
        response.setData(await userRepositories.peternakSignup(req.body.username,req.body.password,req.body.nama,req.body.alamat,req.body.telp, req.body.role))
      }catch (e) {
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }
  },
  user_signup: async(req,res)=>{
    let response = new Response()
    try{
      let result = await userRepositories.userSignup(req.body.username,req.body.password,req.body.role)
      if(result){
        response.setData(result)
      }else{
        response.setStatus(false)
        response.setMessage("Gagal")
      }
    }catch (e){
      response.setStatus(false)
      response.setMessage(e)
    }
    res.json(response)
  },
  signin: async(req,res)=>{
    let response = new Response()
    try{
      let result = await userRepositories.signin(req.body.username,req.body.password)
      if(result){
        response.setData(result)
      }else{
        response.setStatus(false)
        response.setMessage("Invalid username or password")
      }
    }catch (e){
      response.setStatus(false)
      response.setMessage(e)
    }
    res.json(response)
  },
  user_delete:async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.userDelete(req.params.id))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  user_update:async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.userUpdate(req.params.id))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  me: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      let result_decode = jwt.verify(token, config.secret)
      try{
        response.setData(await userRepositories.profile(result_decode._doc._id))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  all_peternak: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.getAllPeternak())
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  }
}
// exports.peternak_signup = function (req, res) {
//   if (!req.body.username || !req.body.password || !req.body.nama || !req.body.alamat || !req.body.telp) {
//     res.json({
//       success: false,
//       msg: 'Please pass the require form'
//     });
//   } else {
//     var newUser = new User({
//       username: req.body.username,
//       password: req.body.password,
//       role: req.body.role
//     });
//     // save the user
//     newUser.save(function (err, user) {
//       if (err) {
//         return res.json({
//           success: false,
//           msg: 'Username already exists.'
//         });
//       }
//       var createPeternak = getPeternak(req, user);
//       if (createPeternak == false) {
//         return res.json({
//           success: false,
//           msg: 'failed creating peternak'
//         });
//       }
//       res.json({
//         success: true,
//         msg: 'success'
//       });
//     });
//   }
// };
// exports.signin = function (req, res) {
//   User.findOne({
//     username: req.body.username
//   }, function (err, user) {
//     if (err) throw err;
//     if (!user) {
//       res.json({
//         success: false,
//         msg: 'Authentication failed. User not found.'
//       });
//     } else {
//       // check if password matches
//       user.comparePassword(req.body.password, function (err, isMatch) {
//         if (isMatch && !err) {
//           // if user is found and password is right create a token
//           var token = jwt.sign(user, config.secret);
//           /**
//            * JWT TOKEN, to access route /me, header x-access-token: token (without JWT)
//            */
//           res.json({
//             success: true,
//             user: user,
//             token: 'JWT ' + token
//           });
//         } else {
//           res.json({
//             success: false,
//             msg: 'Authentication failed. Wrong password.'
//           });
//         }
//       });
//     }
//   });
// };
// exports.user_delete = function (req, res) {
//   User.findByIdAndRemove(req.params.id, function (err) {
//     if (err) res.json({
//       success: false,
//       msg: 'Deleted failed'
//     });
//     res.json({
//       success: true,
//       msg: 'Deleted successfully!'
//     });
//   })
// };
// exports.user_update = function (req, res) {
//   User.findByIdAndUpdate(req.params.id, {
//     $set: req.body
//   }, function (err, user) {
//     if (err) return res.json({
//       success: false,
//       msg: 'Updated failed'
//     });
//     res.json({
//       success: true,
//       msg: 'Updated successfully!'
//     });
//   });
// };
// exports.me = function (req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     jwt.verify(token, config.secret, function (err, decoded) {
//       if (err) return res.json({
//         success: false,
//         msg: 'Failed to authenticate token.'
//       });
//       Peternak.findOne({
//         idUser: decoded._doc._id
//       }, function (err, peternak) {
//         if (err) return res.json({
//           success: false,
//           msg: 'There was a problem finding the peternak.'
//         });
//         if (!peternak) return res.json({
//           success: false,
//           msg: 'No peternak found.'
//         });
//         res.json({
//           success: true,
//           peternak: peternak
//         });
//       });
//     });

//   } else {
//     return res.status(401).json({
//       success: false,
//       msg: 'Unauthorized.'
//     });
//   }
// };

// exports.logout = function (req, res) {
//   res.status(200).send({
//     auth: false,
//     token: null
//   });
// };

// getToken = function (headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(' ');
//     if (parted.length === 2) {
//       return parted[1];
//     } else {
//       return null;
//     }
//   } else {
//     return null;
//   }
// };
// getPeternak = function (req, user) {
//   var newPeternak = new Peternak({
//     idUser: user._id,
//     nama: req.body.nama,
//     alamat: req.body.alamat,
//     noTelp: req.body.telp
//   });
//   newPeternak.save(function (err) {
//     if (err) {
//       return false;
//     }
//     return true;
//   });
// }