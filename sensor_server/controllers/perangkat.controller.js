var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Sapi = require("../models/sapi.model");
var Perangkat = require("../models/perangkat.model");
//Simple version, without validation or sanitation
exports.data_update = function (req, res) {
  var today = new Date();
  Perangkat.update({
      _id: req.params.id
    }, {
      $set:{
        status: req.body.status
      },
      $push: {
        'data': {
          tanggal: today,
          suhu: req.body.suhu,
          jantung: req.body.jantung
        }
      }
    },
    function (err, docs) {
      if (err) return res.json({
        success: false,
        msg: 'updated failed'
      });
      res.json({
        success: true,
        msg: 'updated successfully!',
        perangkat: docs
      });
    }
  );

};
exports.perangkat_detail = function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Perangkat.findById(req.params.id, function (err, perangkat) {
      if (err) res.json({
        success: false,
        msg: 'failed'
      });
      res.json({
        success: true,
        perangkat: perangkat
      });
    });
  } else {
    return res.status(401).json({
      success: false,
      msg: 'Unauthorized.'
    });
  }
};
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};