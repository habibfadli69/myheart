var mongoose = require('mongoose');
var config = require('../config/database');
var dokterRepositories = require('../repositories/dokter.repositories');
var perangkatRepositories = require('../repositories/perangkat.repositories');
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
    },
    createPerangkat: async(req,res)=>{
        let response = new Response()
        try{
            response.setData(await perangkatRepositories.createPasien(req.body.idDokter,req.body.namaPasien,req.body.umurPasien,req.body.alamatPasien,req.body.tinggiPasien,req.body.beratPasien,req.body.nik))

        }catch(e){
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    },
    updateData: async(req,res)=>{
        let response = new Response()
        try{
            response.setData(await perangkatRepositories.updateData(req.params.id,req.body.thermal,req.body.heartrate,req.body.oxygen,req.body.conductivity,req.body.resistance,req.body.conductancevoltage,req.body.ecg,req.body.emg))
        }catch(e){
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    },
    getAllData: async(req,res)=>{
        let response = new Response()
        try{
            response.setData(await perangkatRepositories.getAllData())
        }catch(e){
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    }
}