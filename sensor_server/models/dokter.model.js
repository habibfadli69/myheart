var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DokterSchema = new Schema({
  idDokter : {
    type : Schema.Types.ObjectId,
  },
  dokter : [{
    namaDokter : String,
    emailDokter : String,
    passwordDokter : String,
    birthdayDokter : String,
    umurDokter : Number,
    alamatDokter : String,
    tinggiDokter : Number,
    beratDokter : Number,
    notelpDokter : String,
    pasien : [{
      namaPasien : String,
      emailPasien : String,
      passwordPasien : String,
      birthdayPasien : String,
      umurPasien : Number,
      alamatPasien : String,
      tinggiPasien : Number,
      beratPasien : Number,
      notelpPasien : String,
      kondisi : Number,
      data : [{
        tanggal : { type:Date, default:Date.now },
        temperature : Number,
        heartrate : Number,
        oxygen : Number,
        conductance : Number,
        resistance : Number,
        conductancevoltage : Number,
        ecg : Number,
        emg : Number
      }]
    }] 
  }]
});

module.exports = mongoose.model('Dokter', DokterSchema);