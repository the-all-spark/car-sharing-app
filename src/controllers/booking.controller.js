// * Route Handlers

const Car = require('../models/car.model');
const Driver = require('../models/driver.model');

const { 
  getBookings,
  bookCar,
  unbookCar,
} = require('../services/booking.service');
const { getCarByVin } = require ('../services/car.service');
const { getDriverByLicense } = require ('../services/driver.service');


// * GET /bookings
// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await getBookings();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings were found' });
    }

    res.status(200).json({
      amount: bookings.length,
      bookings: bookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * POST /bookings/book/:vin
// Book the car by its VIN (create booking) 
exports.bookCar = async (req, res) => {
  try {
    const carVin = req.params.vin.toUpperCase();
    const driverLicenseNumber = req.body.licenseNumber.toUpperCase();
    const startFuel = req.body.startFuel;
    const startMileage = req.body.startMileage;

    const car = await getCarByVin(carVin);
    if (!car) {
      return res.status(404).json({ message: 'No car with such VIN was found' });
    }

    const driver = await getDriverByLicense(driverLicenseNumber);
    if (!driver) {
      return res.status(404).json({ message: 'No driver with such license number was found' });
    }

    const booking = await bookCar({
      vehicleId: car._id,
      driverId: driver._id,
      startFuel,
      startMileage
    });
    
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// * POST /bookings/unbook/:vin
// Unbook a car by its VIN (finish the trip) 
exports.unbookCar = async (req, res) => {
  try {
    const carVin = req.params.vin.toUpperCase();
    const driverLicenseNumber = req.body.licenseNumber.toUpperCase();
    const finishFuel = req.body.finishFuel;
    const finishMileage = req.body.finishMileage;

    const car = await getCarByVin(carVin);
    if (!car) {
      return res.status(404).json({ message: 'No car with such VIN was found' });
    }

    if (!car.currentBookingId) {
      return res.status(400).json({ message: 'This vehicle is not currently on a trip' });
    }

    const driver = await getDriverByLicense(driverLicenseNumber);
    if (!driver) {
      return res.status(404).json({ message: 'No driver with such license number was found' });
    }

    const updatedBooking = await unbookCar({
      vehicleId: car._id,
      driverId: driver._id,
      bookingId: car.currentBookingId,
      finishFuel,
      finishMileage
    });

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};