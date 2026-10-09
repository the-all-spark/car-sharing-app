// *Route Handlers

const { 
  getDrivers,
  addDriver,
  updateDriverByLicense,
  deleteDriverByLicense
} = require('../services/driver.service')

// * GET /drivers
// Get all drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await getDrivers();

    if (!drivers || drivers.length === 0) {
      return res.status(404).json({ message: 'No drivers were found' });
    }

    res.status(200).json({
      amount: drivers.length,
      drivers: drivers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * POST /drivers
// Add a new driver
exports.addDriver = async (req, res) => {
  try {
    const driverData = { ...req.body };
    const saved = await addDriver(driverData);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// * PATCH /drivers/:licenseNumber
// Update a driver by licenseNumber
exports.updateDriverByLicense = async (req, res) => {
  try {
    const driverLicense = req.params.licenseNumber.toUpperCase(); 
    const { licenseNumber, ...incomingData } = req.body; 

    const driverData = Object.fromEntries(
      Object.entries(incomingData).filter(([_, value]) => {
        return value !== "" && value !== null && value !== undefined;
      })
    );

    if (Object.keys(driverData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updated = await updateDriverByLicense(driverLicense, driverData);
    if (!updated) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.status(200).json({ message: 'Driver updated', driver: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// * DELETE /drivers/:licenseNumber
// Remove a driver by license number
exports.deleteDriverByLicense = async (req, res) => {
  try {
    const driverLicense = req.params.licenseNumber.toUpperCase();
    const deleted = await deleteDriverByLicense(driverLicense);

    if (!deleted) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.status(200).json({ message: 'Driver deleted', driver: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
