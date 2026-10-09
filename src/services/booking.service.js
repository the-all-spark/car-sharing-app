const Booking = require('../models/booking.model');
const Car = require('../models/car.model');

const getBookings = async () => {
  return await Booking.find({});
};

const bookCar = async ({ vehicleId, driverId, startFuel, startMileage }) => {
  let newBooking = null;
  try {
    newBooking = await Booking.create({
      vehicleId,
      driverId,
      startDate: new Date(),
      startFuelLevel: startFuel,
      startMileage,
      finishDate: null,
      finishFuelLevel: null,
      finishMileage: null,
    });

    const car = await Car.findOneAndUpdate(
      { _id: vehicleId, currentBookingId: null },
      { 
        $set: { 
          currentBookingId: newBooking._id,
          fuelLevel: startFuel,
          mileage: startMileage
        } 
      },
      { new: true }
    );

    if (!car) {
      await Booking.deleteOne({ _id: newBooking._id });
      throw new Error('No car was found or the car is already taken by another driver');
    }

    return newBooking;
  } catch (error) {
    console.error('Booking error:', error.message);
    throw error;
  }
}

const unbookCar = async ({ vehicleId, driverId, bookingId, finishFuel, finishMileage }) => {
  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      vehicleId: vehicleId,
      driverId: driverId,
      finishDate: null
    });

    if (!booking) {
      throw new Error('Active booking not found or already closed');
    }

    if (finishMileage < booking.startMileage) {
      throw new Error(`The final mileage (${finishMileage}) cannot be less than the starting mileage (${booking.startMileage})`);
    }

    booking.finishDate = new Date();
    booking.finishFuelLevel = finishFuel;
    booking.finishMileage = finishMileage;
    await booking.save();

    const car = await Car.findByIdAndUpdate(
      { _id: vehicleId, currentBookingId: bookingId },
      {
        $set: {
          currentBookingId: null,
          fuelLevel: finishFuel,
          mileage: finishMileage,
          status: "Free"
        }
      },
      { new: true }
    );

    if (!car) {
      await Booking.updateOne(
        { _id: bookingId },
        {
          $set: {
            finishDate: null,
            finishFuelLevel: null,
            finishMileage: null
          }
        }
      );
      throw new Error('Failed to update car status. Booking cancellation rolled back.');
    }

    return booking;
  } catch (error) {
    console.error('Unbook error:', error.message);
    throw error;
  }
};

module.exports = {
  getBookings,
  bookCar,
  unbookCar,
}