const Driver = require('../models/driver.model');

const getDrivers = async () => {
  return await Driver.find({});
};

const getDriverByLicense = async (driverLicenseNumber) => {
  return await Driver.findOne({ licenseNumber: driverLicenseNumber });
};

const addDriver = async (driverData) => {
  const driver = new Driver(driverData);
  return await driver.save();
}

const updateDriverByLicense = async (driverLicense, driverData) => {
  return await Driver.findOneAndUpdate(
    { licenseNumber: driverLicense },
    { $set: driverData },
    { new: true }
  );
}

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