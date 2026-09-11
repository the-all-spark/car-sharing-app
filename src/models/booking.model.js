// * Booking history model

const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
  
  startDate: { type: Date, required: true, default: Date.now },
  startFuelLevel: { type: Number, required: true, min: 0 },
  startMileage: { type: Number, required: true, min: 0 },
  
  finishDate: { type: Date, default: null },
  finishFuelLevel: { type: Number, default: null, min: 0 }, 
  finishMileage: { type: Number, default: null, min: 0 }, 
});

module.exports = mongoose.model('Booking', bookingSchema);