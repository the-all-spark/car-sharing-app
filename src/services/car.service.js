const Car = require('../models/car.model');
const Booking = require('../models/booking.model');

// * Get all cars
const getCars = async () => {
  return await Car.find({});
};

// * Cars currently in use with fuel level less than 1/4 of full tank
const getCarsInUseLowFuel = async () => {
  return await Car.find({
    status: 'In use',
    fuelLevel: { $lt: 25 },
  });
}

// * Reserved cars whose driver card hasn't been authorized
const getReservedUnauthorizedCard = async () => {
  return await Car.aggregate([
      {
        $match: {
          status: 'Reserved',
          currentBookingId: { $exists: true, $ne: null }
        }
      },
      // Car.currentBookingId --> Booking._id --> Booking.driverId --> Driver._id
      // Ищем документ поездки в коллекции 'bookings'
      {
      $lookup: {
        from: 'bookings',
        localField: 'currentBookingId',
        foreignField: '_id',
        as: 'bookingDetails'
      }
      },
      {
        $unwind: '$bookingDetails'
      },
      // Ищем документ водителя в коллекции 'drivers', используя driverId из поездки
      {
        $lookup: {
          from: 'drivers',                      
          localField: 'bookingDetails.driverId',
          foreignField: '_id',
          as: 'driverDetails'
        }
      },
      {
        $unwind: '$driverDetails'
      },
      {
        $match: {
          'driverDetails.card.authorized': { $ne: true }
        }
      },
      {
        $project: {
          _id: 0,
          vin: '$vin',
          location: { coordinates: '$location.coordinates'},
          driverFirstName: '$driverDetails.firstName',
          driverLastName: '$driverDetails.lastName',
          driverLicenseNumber: '$driverDetails.licenseNumber'
        }
      }
    ]);
}

// * Add a new car
const addCar = async (carData) => {
  const car = new Car(carData);
  return await car.save();
}

// * Update a car by VIN
const updateCarByVin = async (carVin, carData) => {
  return await Car.findOneAndUpdate(
    { vin: carVin },
    { $set: carData },
    { new: true }
  );
}

// * Set status to "In Service" for cars produced before 01/01/2017 OR mileage > 100000 km
const setInServiceOldOrHighMileage = async () => {
  return await Car.updateMany(
      {
        $or: [
          { 'productionInfo.date': { $lt: new Date('2017-01-01T00:00:00.000Z') } },
          { mileage: { $gt: 100000 } }
        ]
      },
      { 
        $set: { status: 'In Service' } 
      },
    );
}

// * Relocate cars booked more than 2 times that are not In use or Reserved to Minsk coordinates
const relocateFrequentBookers = async () => {
  // 1. Находим ID машин, которые подходят под условия
  const carsToRelocate = await Booking.aggregate([
    // Группируем все поездки по машинам и считаем их количество
    {
      $group: {
        _id: '$vehicleId',
        bookingCount: { $sum: 1 }
      }
    },
    // Фильтруем: оставляем только те машины, у которых больше 2 поездок
    {
      $match: {
        bookingCount: { $gt: 2 } // Строго больше 2 (то есть 3 и более, аналог индекса [2] в массиве)
      }
    },
    // Связываем с коллекцией машин, чтобы проверить их текущий статус
    {
      $lookup: {
        from: 'cars',
        localField: '_id',
        foreignField: '_id',
        as: 'carDetails'
      }
    },
    { $unwind: '$carDetails' },
    // Фильтруем по статусу машины
    {
      $match: {
        'carDetails.status': { $nin: ['In use', 'Reserved'] }
      }
    },
    // Оставляем только массив ID машин
    {
      $project: {
        _id: 1
      }
    }
  ]);

  // Преобразуем результат в плоский массив ID [objectId1, objectId2, ...]
  const carIds = carsToRelocate.map(item => item._id);

  // 2. Если такие машины найдены, обновляем их координаты одним запросом
  if (carIds.length > 0) {
    return await Car.updateMany(
      { _id: { $in: carIds } },
      {
        $set: {
          'location.coordinates': [27.5442615, 53.8882836],
        },
      }
    );
  } else {
    return { matchedCount: 0, modifiedCount: 0 };
  }
};


// * Remove a car by VIN
const deleteCarByVin = async (carVin) => {
  return await Car.findOneAndDelete({ 
    vin: carVin
  });
}

module.exports = {
  getCars,
  getCarsInUseLowFuel,
  getReservedUnauthorizedCard,
  addCar,
  updateCarByVin,
  setInServiceOldOrHighMileage,
  relocateFrequentBookers,
  deleteCarByVin,
}