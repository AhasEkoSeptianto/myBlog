import mongoose from 'mongoose';
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema;

var anggota = new Schema({
  nama: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  noTelp: {
    type: String,
    require: true
  },
  alamat: {
    type: String,
    require: true
  },
  tanggal_lahir: {
    type: String,
    require: true
  },
  toko: {
    type: String,
    require: true
  },
  status: {
    type: String,
    required: true
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  berhenti_pada: {
    type: Date,
  }
});

anggota.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
mongoose.models = {};

var Anggota = mongoose.model('anggota', anggota);

export default Anggota;