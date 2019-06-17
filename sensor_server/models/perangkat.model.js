var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerangkatSchema = new Schema({
  idDokter: {
    type: Schema.Types.ObjectId,
  },
  pasien:[{
    nik : String,
    namaPasien: String,
    umurPasien : String,
    alamatPasien : String,
    tinggiPasien : String,
    beratPasien : String,
    statusPasien : Number,
    data:[{
      tanggal:{ type: Date, default: Date.now },
      thermal:Number,
      heartrate:Number,
      oxygen:Number,
      conductivity:Number,
      resistance:Number,
      conductancevoltage:Number,
      ecg:Number,
      emg:Number,
      kondisi:Number
    }]
  }]
});

module.exports = mongoose.model('Perangkat', PerangkatSchema);