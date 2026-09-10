// * Route Handlers

const Car = require('../models/car.model');
const Driver = require('../models/driver.model');

const { 
  getBookings,
  bookCar,
  unbookCar,
} = require('../services/booking.service')

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
// Book a car
exports.bookCar = async (req, res) => {
  try {
    const carVin = req.params.vin.toUpperCase();
    const driverLicenseNumber = req.body.licenseNumber.toUpperCase();
    const startFuel = req.body.startFuel;
    const startMileage = req.body.startMileage;

    // 1. Ищем машину по VIN
    const car = await Car.findOne({ vin: carVin });
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль с таким VIN не найден' });
    }

    // 2. Ищем водителя по номеру удостоверения
    const driver = await Driver.findOne({ licenseNumber: driverLicenseNumber });
    if (!driver) {
      return res.status(404).json({ message: 'Водитель с таким номером лицензии не найден' });
    }

    // 3. Передаем полученные ID в сервис
    const booking = await bookCar(car._id, driver._id, startFuel, startMileage);
    
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// * POST /bookings/unbook/:vin
// Unbook a car
exports.unbookCar = async (req, res) => {
  try {
    const carVin = req.params.vin.toUpperCase();
    const driverLicenseNumber = req.body.licenseNumber.toUpperCase();
    const finishFuel = req.body.finishFuel;
    const finishMileage = req.body.finishMileage;

    // 1. Ищем машину
    const car = await Car.findOne({ vin: carVin });
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль с таким VIN не найден' });
    }

    // Проверяем, занята ли вообще машина
    if (!car.currentBookingId) {
      return res.status(400).json({ message: 'Этот автомобиль в данный момент не находится в поездке' });
    }

    // 2. Ищем водителя
    const driver = await Driver.findOne({ licenseNumber: driverLicenseNumber });
    if (!driver) {
      return res.status(404).json({ message: 'Водитель с таким номером лицензии не найден' });
    }

    // 3. Вызываем сервис для завершения поездки
    const updatedBooking = await unbookCar(car._id, driver._id, car.currentBookingId, finishFuel, finishMileage);
    
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};