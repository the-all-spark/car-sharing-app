const Car = require('../models/car.model');

// ! getCars

// Cars currently in use with fuel level less than 1/4 of full tank
const getCarsInUseLowFuel = async () => {
  return await Car.find({
    docType: 'Vehicle',
    status: 'In use',
    fuelLevel: { $lt: 25 },
  });
}

// Reserved cars whose driver card hasn't been authorized
const getReservedUnauthorizedCard = async () => {
  return await Car.aggregate([
      {
        $match: {
          docType: 'Vehicle',
          status: 'Reserved',
          'currentRun.driverId': { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'cars',                      
          localField: 'currentRun.driverId',
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

// Add a new car
const addCar = async (carData) => {
  const car = new Car(carData);
  return await car.save();
}

// ! updateCarByVin

// Set status to "In Service" for cars produced before 01/01/2017 OR mileage > 100000 km
const setInServiceOldOrHighMileage = async () => {
  return await Car.updateMany(
      {
        docType: 'Vehicle' , 
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

// Relocate cars booked more than 2 times that are not In use or Reserved to Minsk coordinates
const relocateFrequentBookers = async () => {
  return await Car.updateMany(
      {
        docType: 'Vehicle', 
        'bookingsHistory.2': { $exists: true },
        status: { $nin: ['In use', 'Reserved'] },
      },
      {
        $set: {
          'location.coordinates': [27.5442615, 53.8882836],
        },
      },
    );
}

// Remove a car by VIN
const deleteCarByVin = async (carVin) => {
  return await Car.findOneAndDelete({ 
      vin: carVin,
      docType: 'Vehicle'
    });
}

module.exports = {
  getCarsInUseLowFuel,
  getReservedUnauthorizedCard,
  addCar,
  setInServiceOldOrHighMileage,
  relocateFrequentBookers,
  deleteCarByVin
}