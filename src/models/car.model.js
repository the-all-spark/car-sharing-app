// * Car model

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productionInfoSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  date: { type: Date, required: true },
});

const carSchema = new Schema(
  {
    vin: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 17,
      maxlength: 17,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    productionInfo: { type: productionInfoSchema, required: true },
    status: {
      type: String,
      enum: ['Free', 'Reserved', 'In use', 'Unavailable', 'In Service'],
      default: 'Free',
    },
    fuelLevel: { type: Number, default: 100, min: 0,},
    mileage: { type: Number, default: 0, min: 0 },
    currentBookingId: { type: Schema.Types.ObjectId, ref: 'Booking', default: null },
    location: { 
      type: { type: String, enum: ['Point']},
      coordinates: {
        type: [Number],
        validate: {
          validator: function(v) { return v && v.length === 2; },
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
  },
);

carSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Car', carSchema);