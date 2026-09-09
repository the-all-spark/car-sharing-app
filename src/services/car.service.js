const Car = require('../models/car.model');

// ! getCars

const getCarsInUseLowFuel = async () => {
  return await Car.find({
    docType: 'Vehicle',
    status: 'In use',
    fuelLevel: { $lt: 25 },
  });
}


module.exports = {
  getCarsInUseLowFuel
}