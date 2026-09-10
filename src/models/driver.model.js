// * Driver model

const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
  number: { type: String, required: true },
  owner: { type: String, required: true },
  validThrough: { type: Date, required: true },
  authorized: { type: Boolean, default: false },
});

const driverSchema = new Schema({
  licenseNumber: { 
    type: String, 
    required: true,
    unique: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  card: { type: cardSchema, required: true },
})

module.exports = mongoose.model('Driver', driverSchema);