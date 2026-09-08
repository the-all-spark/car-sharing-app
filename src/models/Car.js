// * Car model

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productionInfoSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  date: { type: Date, required: true },
});

const cardSchema = new Schema({
  number: { type: String, required: true },
  owner: { type: String, required: true },
  validThrough: { type: Date, required: true },
  authorized: { type: Boolean, default: false },
});

const currentRunSchema = new Schema({
  startDate: { type: Date, required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  startFuelLevel: { type: Number, required: true, min: 0 },
  startMileage: { type: Number, required: true, min: 0 },
});

const bookingHistorySchema = new Schema({
  startDate: { type: Date, required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  startFuelLevel: { type: Number, required: true, min: 0 },
  startMileage: { type: Number, required: true, min: 0 },
  finishFuelLevel: { type: Number, default: null },
  finishMileage: { type: Number, default: null },
});

const carSchema = new Schema(
  {
    // Discriminator: distinguish vehicles and drivers
    docType: {
      type: String,
      enum: ['Vehicle', 'Driver'],
      required: true,
    },

    // Fields for cars (docType: 'Vehicle')
    vin: {
      type: String,
      required: function() { return this.docType === 'Vehicle'; },
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      minlength: 17,
      maxlength: 17,
    },
    registrationNumber: {
      type: String,
      required: function() { return this.docType === 'Vehicle'; },
      unique: true,
      sparse: true,
      trim: true,
    },
    productionInfo: { 
      type: productionInfoSchema, 
      required: function() { return this.docType === 'Vehicle'; } 
    },
    status: {
      type: String,
      enum: ['Free', 'Reserved', 'In use', 'Unavailable', 'In Service'],
      default: function() { return this.docType === 'Vehicle' ? 'Free' : undefined; },
    },
    fuelLevel: { 
      type: Number, 
      default: function() { return this.docType === 'Vehicle' ? 100 : undefined; }, 
      min: 0,
    },
    mileage: { type: Number, default: 0, min: 0 },
    currentRun: { type: currentRunSchema, default: null },
    location: { 
      type: { type: String, enum: ['Point']},
      coordinates: {
        type: [Number],
        validate: {
          validator: function(v) { return this.docType !== 'Vehicle' || (v && v.length === 2); },
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
    bookingsHistory: { type: [bookingHistorySchema], default: [] },
  
    // Fields for drivers (docType: 'Driver')
    licenseNumber: { 
      type: String, 
      required: function() { return this.docType === 'Driver'; },
      sparse: true,
      unique: true 
    },
    firstName: { type: String, required: function() { return this.docType === 'Driver'; } },
    lastName: { type: String, required: function() { return this.docType === 'Driver'; } },
    card: { type: cardSchema, required: function() { return this.docType === 'Driver'; } },
  },
);

carSchema.index({ location: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Car', carSchema);