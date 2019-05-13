var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PerangkatSchema = new Schema({
  status: Number,
  data: [{
    tanggal:{ type: Date, default: Date.now },
    thermal:Number,
    heartrate:Number,
    oxygen:Number,
    conductivity:Number,
    resistance:Number,
    conductancevoltage:Number,
    emg:Number,
    ecg:Number,
    kondisi:Number
  }]
});
var PasienSchema = new Schema({
  idDokter: {
    type: Schema.Types.ObjectId,
  },
  namaPasien: {
    type: String,
    required: true
  },
  umurPasien: {
    type: Number,
    required: true
  },
  alamatPasien: {
    type: String,
    required: true
  },
  tinggiPasien: {
    type: Number,
    required: true
  },
  beratPasien: {
    type: Number,
    required: true
  },
  perangkat:{
    type: PerangkatSchema,
    required: true
  }
});

module.exports = mongoose.model('Pasien', PasienSchema);