var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var Dokter = require("../models/dokter.model");

const dokterRepositories = {
    createDokter: async(nama,alamat,noTelp)=>{
        var newDokters =new Dokter({
            nama: nama,
            alamat: alamat,
            noTelp : noTelp
        })
        var saveDokter = await newDokters.save()
        if(saveDokter){
            return saveDokter
        }
    }
}
module.exports = dokterRepositories