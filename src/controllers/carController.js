// * API logic (Route Handlers)

const Car = require('../models/Car');

// * GET /api/cars/in-use/low-fuel
// Cars currently in use with fuel level less than 1/4 of full tank
exports.getCarsInUseLowFuel = async (req, res) => {
  try {
    const cars = await Car.find({
      docType: 'Vehicle',
      status: 'In use',
      fuelLevel: { $lt: 25 },
    });

    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: 'No cars in use with low fuel level were found' });
    }

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * GET /api/cars/reserved/unauthorized-card
// Reserved cars whose driver card hasn't been authorized
// Returns VIN, location, driver first/last name, license number
exports.getReservedUnauthorizedCard = async (req, res) => {
  try {
    const results = await Car.aggregate([
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

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No reserved cars with unauthorized driver cards found' });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * POST /api/cars
// Add a new car to the car sharing park
exports.addCar = async (req, res) => {
  try {
    const carData = { ...req.body, docType: 'Vehicle' };
    
    const car = new Car(carData);
    const saved = await car.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// * PUT /api/cars/service-old-or-high-mileage
// Set status to "In Service" for cars produced before 01/01/2017 OR mileage > 100000 km
exports.setInServiceOldOrHighMileage = async (req, res) => {
  try {
    const result = await Car.updateMany(
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

    const isSuccess = result.matchedCount > 0;

    res.status(200).json({
      success: isSuccess,
      message: isSuccess 
        ? `Successfully set status to 'In Service'.` 
        : "No vehicles matched the criteria.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * PUT /api/cars/relocate-frequent
// Relocate cars booked more than 2 times that are not In use or Reserved to Minsk coordinates
exports.relocateFrequentBookers = async (req, res) => {
  try {
    const result = await Car.updateMany(
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

    const isSuccess = result.matchedCount > 0;

    res.status(200).json({
      success: isSuccess,
      message: isSuccess 
        ? `Successfully processed ${result.matchedCount} vehicle(s).` 
        : "No vehicles matched the criteria.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cars/:vin
// Remove a car by VIN
exports.deleteCarByVin = async (req, res) => {
  try {
    const deleted = await Car.findOneAndDelete({ 
      vin: req.params.vin.toUpperCase(),
      docType: 'Vehicle'
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json({ message: 'Car deleted', car: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
