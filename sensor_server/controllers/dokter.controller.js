var mongoose = require('mongoose');
var config = require('../config/database');
var dokterRepositories = require('../repositories/dokter.repositories');
var Response = require('../services/Response');

module.exports = {
    createDokter: async(req,res)=>{
        let response = new Response()
        try{
            response.setData(await dokterRepositories.createDokter(req.body.nama,req.body.alamat,req.body.noTelp))

        }catch(e){
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    }
}