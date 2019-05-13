var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Dokter = require("../models/dokter.model");

const dokterRepositories = {
    getDokterByIdUser: async(params) => {
        let result = await Dokter.findOne({
            idUser:params
        });
        return result;
    }
}
module.exports = dokterRepositories