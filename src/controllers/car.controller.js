// *Route Handlers

const { 
  getCars,
  getCarsInUseLowFuel,
  getReservedUnauthorizedCard,
  addCar,
  updateCarByVin,
  setInServiceOldOrHighMileage,
  relocateFrequentBookers,
  deleteCarByVin
} = require('../services/car.service')

// * GET /cars
// Get all cars
exports.getCars = async (req, res) => {
  try {
    const cars = await getCars();

    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: 'No cars were found' });
    }

    res.status(200).json({
      amount: cars.length,
      cars: cars,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * GET /cars/in-use/low-fuel
// Cars currently in use with fuel level less than 1/4 of full tank
exports.getCarsInUseLowFuel = async (req, res) => {
  try {
    const cars = await getCarsInUseLowFuel(); 

    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: 'No cars in use with low fuel level were found' });
    }

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * GET /cars/reserved/unauthorized-card
// Reserved cars whose driver card hasn't been authorized
// Returns VIN, location, driver first/last name, license number
exports.getReservedUnauthorizedCard = async (req, res) => {
  try {
    const cars = await getReservedUnauthorizedCard();

    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: 'No reserved cars with unauthorized driver cards found' });
    }

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * POST /cars/add
// Add a new car to the car sharing park
exports.addCar = async (req, res) => {
  try {
    const carData = { ...req.body };
    const saved = await addCar(carData);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// * PATCH /cars/update/:vin
// Update a car by VIN
exports.updateCarByVin = async (req, res) => {
  try {
    const carVin = req.params.vin.toUpperCase();
    const { vin, currentBookingId, ...incomingData } = req.body; 

    const carData = Object.fromEntries(
      Object.entries(incomingData).filter(([_, value]) => {
        return value !== "" && value !== null && value !== undefined;
      })
    );

    if (Object.keys(carData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updated = await updateCarByVin(carVin, carData);
    if (!updated) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json({ message: 'Car updated', car: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * PUT /cars/service-old-or-high-mileage
// Set status to "In Service" for cars produced before 01/01/2017 OR mileage > 100000 km
exports.setInServiceOldOrHighMileage = async (req, res) => {
  try {
    const result = await setInServiceOldOrHighMileage();
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

// * PUT /cars/relocate-frequent
// Relocate cars booked more than 2 times that are not In use or Reserved to Minsk coordinates
exports.relocateFrequentBookers = async (req, res) => {
  try {
    const result = await relocateFrequentBookers();
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

// * DELETE /cars/delete/:vin
// Remove a car by VIN
exports.deleteCarByVin = async (req, res) => {
  try {
    const carVin = req.params.vin.toUpperCase();
    const deleted = await deleteCarByVin(carVin);

    if (!deleted) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json({ message: 'Car deleted', car: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
