var mongoose = require('mongoose');
var config = require('../config/database');
var dokterRepositories = require('../repositories/dokter.repositories');
var Response = require('../services/Response');

module.exports = {
    createDokter : async(req,res) => {
        let response = new Response()
        try {
            response.setData(await dokterRepositories.createDokter(req.body.namaDokter, req.body.emailDokter, req.body.passwordDokter, req.body.birthdayDokter, req.body.umurDokter, req.body.alamatDokter, req.body.tinggiDokter, req.body.beratDokter, req.body.notelpDokter))
        } catch(e) {
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    },

    addDokter : async(req,res) => {
        let response = new Response()
        try {
            response.setData(await dokterRepositories.addDokter(req.params.id, req.body.namaDokter, req.body.emailDokter, req.body.passwordDokter, req.body.birthdayDokter, req.body.umurDokter, req.body.alamatDokter, req.body.tinggiDokter, req.body.beratDokter, req.body.notelpDokter))
        } catch (e) {
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    },

    addPasien : async(req,res) => {
        let response = new Response()
        try {
            response.setData(await dokterRepositories.addPasien(req.params.id, req.body.namaPasien, req.body.emailPasien, req.body.passwordPasien, req.body.birthdayPasien, req.body.umurPasien, req.body.alamatPasien, req.body.tinggiPasien, req.body.beratPasien, req.body.notelpPasien, req.body.kondisi))
        } catch (e) {
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    },

    updateData: async(req,res) => {
        let response = new Response()
        try{
            response.setData(await dokterRepositories.updateData(req.params.id, req.body.temperature, req.body.heartrate, req.body.oxygen, req.body.conductance, req.body.resistance, req.body.conductancevoltage, req.body.ecg, req.body.emg))
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
    },
    createPerangkat: async(req,res)=>{
        let response = new Response()
        try{
            response.setData(await perangkatRepositories.createPasien(req.body.idDokter, req.body.namaPasien,req.body.umurPasien,req.body.alamatPasien,req.body.tinggiPasien,req.body.beratPasien,req.body.nik))

        }catch(e){
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    }
}