var mongoose = require('mongoose');
var config = require('../config/database');
var dokterRepositories = require('../repositories/dokter.repositories');
var Response = require('../services/Response');

module.exports = {
    createDokter : async(req,res) => {
        let response = new Response()
        try {
            response.setData(await dokterRepositories.createDokter(req.body.idDokter, req.body.namaDokter, req.body.nicknameDokter, req.body.birthdayDokter, req.body.umurDokter, req.body.alamatDokter, req.body.tinggiDokter, req.body.beratDokter, req.body.notelpDokter))
        } catch(e) {
            response.setStatus(false)
            response.setMessage(e)
        }
        res.json(response) 
    },
    updateDokter : async(req,res) => {
        let response = new Response()
        res.json(req)
        let data=await dokterRepositories.updatePasien(req.params.id, req.body.namaPasien, req.body.nicknamePasien, req.body.birthdayPasien, req.body.umurPasien, req.body.alamatPasien, req.body.tinggiPasien, req.body.beratPasien, req.body.notelpPasien)
        res.json(data)
        // try {
        //     response.setData(await dokterRepositories.updateDokter(req.params.id, req.body.namaDokter, req.body.nicknameDokter, req.body.birthdayDokter, req.body.umurDokter, req.body.alamatDokter, req.body.tinggiDokter, req.body.beratDokter, req.body.notelpDokter))
        // } catch (e) {
        //     response.setStatus(false)
        //     response.setMessage(e)
        // }
        // res.json(response) 
    },
    updatePasien : async(req,res) => {
        if(err) {
            return res.status(500).json(err)
        } else {
            return res.status(200).json(req.body)
        }
        // let response = new Response()
        // res.json(req)
        // let data=await dokterRepositories.updatePasien(req.params.id, req.body.namaPasien, req.body.nicknamePasien, req.body.birthdayPasien, req.body.umurPasien, req.body.alamatPasien, req.body.tinggiPasien, req.body.beratPasien, req.body.notelpPasien, req.body.kondisi)
        // res.json(data)
        // try {
        //     response.setData(await dokterRepositories.updatePasien(req.params.id, req.body.namaPasien, req.body.nicknamePasien, req.body.birthdayPasien, req.body.umurPasien, req.body.alamatPasien, req.body.tinggiPasien, req.body.beratPasien, req.body.notelpPasien, req.body.kondisi))
        // } catch (e) {
        //     response.setStatus(false)
        //     response.setMessage(e)
        // }
        // res.json(response) 
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
            response.setData(await perangkatRepositories.updateData(req.params.id,req.body.temperature,req.body.heartrate,req.body.oxygen,req.body.conductance,req.body.resistance,req.body.conductancevoltage,req.body.ecg,req.body.emg))
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