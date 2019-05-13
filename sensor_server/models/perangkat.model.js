var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerangkatSchema = new Schema({
  idSapi: {
    type: Schema.Types.ObjectId,
  },
  status: Number,
  data: [{
    tanggal:{ type: Date, default: Date.now },
    suhu:Number,
    jantung:Number
  }]
});

module.exports = mongoose.model('Perangkat', PerangkatSchema);
