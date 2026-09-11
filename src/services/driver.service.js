const Driver = require('../models/driver.model');

// * Get all drivers
const getDrivers = async () => {
  return await Driver.find({});
};

// Get driver by license number
const getDriverByLicense = async (driverLicenseNumber) => {
  return await Driver.findOne({ licenseNumber: driverLicenseNumber });
};

// * Add a new driver
const addDriver = async (driverData) => {
  const driver = new Driver(driverData);
  return await driver.save();
}

// * Update a driver by license number
const updateDriverByLicense = async (driverLicense, driverData) => {
  return await Driver.findOneAndUpdate(
    { licenseNumber: driverLicense },
    { $set: driverData },
    { new: true }
  );
}

// * Remove a driver by license number
const deleteDriverByLicense = async (driverLicense) => {
  return await Driver.findOneAndDelete({ 
    licenseNumber: driverLicense
  });
}

module.exports = {
  getDrivers,
  getDriverByLicense,
  addDriver,
  updateDriverByLicense,
  deleteDriverByLicense,
}