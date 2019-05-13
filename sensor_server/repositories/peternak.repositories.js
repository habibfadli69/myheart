var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Peternak = require("../models/peternak.model");

const peternakRepositories = {
    getPeternakByIdUser: async(params) => {
        let result = await Peternak.findOne({
            idUser:params
        });
        return result;
    }
}
module.exports = peternakRepositories