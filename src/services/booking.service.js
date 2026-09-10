const mongoose = require('mongoose');

const Booking = require('../models/booking.model');
const Car = require('../models/car.model');

// * Get all bookings
const getBookings = async () => {
  return await Booking.find({});
};

// * Book the car 
const bookCar = async (vehicleId, driverId, startFuel, startMileage) => {
  try {
    // 1. Пытаемся занять машину: проверяем, чтобы она была свободна (currentBookingId === null)
    const car = await Car.findOneAndUpdate(
      { _id: vehicleId, currentBookingId: null },
      { 
        // Временно блокируем машину
        $set: { currentBookingId: new mongoose.Types.ObjectId() } 
      },
      { new: true }
    );

    if (!car) {
      // Если машина не нашлась по этому условию, значит она уже занята
      throw new Error('Автомобиль уже занят другим водителем');
    }

    // 2. Создаем запись о поездке
    const newBooking = await Booking.create({
      vehicleId,
      driverId,
      startDate: new Date(),
      startFuelLevel: startFuel,
      startMileage: startMileage,
      finishDate: null,
      finishFuelLevel: null,
      finishMileage: null,
    });

    // 3. Записываем реальный ID поездки, а также обновляем топливо и пробег машины
    car.currentBookingId = newBooking._id;
    car.fuelLevel = startFuel;
    car.mileage = startMileage;
    await car.save();

    // console.log(`Поездка ${newBooking._id} успешно начата!`);
    return newBooking;

  } catch (error) {
    console.error('Ошибка при букинге поездки:', error.message);
    throw error;
  }
}

// * Unbook car (Finish the trip)
const unbookCar = async (vehicleId, driverId, bookingId, finishFuel, finishMileage) => {
  try {
    // 1. Ищем активную поездку, чтобы сверить данные и не дать закрыть чужую бронь
    const booking = await Booking.findOne({
      _id: bookingId,
      vehicleId: vehicleId,
      driverId: driverId,
      finishDate: null // Поездка еще не должна быть завершена
    });

    if (!booking) {
      throw new Error('Активная поездка для данного водителя и автомобиля не найдена');
    }

    // Валидация: пробег при возврате не может быть меньше, чем при старте
    if (finishMileage < booking.startMileage) {
      throw new Error(`Конечный пробег (${finishMileage}) не может быть меньше стартового (${booking.startMileage})`);
    }

    // 2. Обновляем и закрываем запись о поездке
    booking.finishDate = new Date();
    booking.finishFuelLevel = finishFuel;
    booking.finishMileage = finishMileage;
    await booking.save();

    // 3. Освобождаем машину и обновляем её актуальное состояние
    const car = await Car.findByIdAndUpdate(
      vehicleId,
      {
        $set: {
          currentBookingId: null, // Машина снова свободна
          fuelLevel: finishFuel,  // Обновляем остаток топлива
          mileage: finishMileage  // Обновляем пробег в карточке машины
        }
      },
      { new: true }
    );

    if (!car) {
      throw new Error('Критическая ошибка: автомобиль не найден при попытке освобождения');
    }

    return booking;
  } catch (error) {
    console.error('Ошибка при завершении поездки:', error.message);
    throw error;
  }
};

module.exports = {
  getBookings,
  bookCar,
  unbookCar,
}