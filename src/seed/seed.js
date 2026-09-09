// * Filling database with initial data

const Car = require('../models/car.model');

async function seedDatabase() {
  try {
    await Car.cleanIndexes();
    await Car.deleteMany({});

    const driversData = [
      {
        docType: 'Driver',
        licenseNumber: 'DL-100001',
        firstName: 'John',
        lastName: 'Smith',
        card: { number: '4111111111111111', owner: 'John Smith', validThrough: new Date('2027-06-01'), authorized: true },
      },
      {
        docType: 'Driver',
        licenseNumber: 'DL-200001',
        firstName: 'Alice',
        lastName: 'Brown',
        card: { number: '5500000000000004', owner: 'Alice Brown', validThrough: new Date('2026-12-01'), authorized: true },
      },
      {
        docType: 'Driver',
        licenseNumber: 'DL-200002',
        firstName: 'Bob',
        lastName: 'Jones',
        card: { number: '4111111111112222', owner: 'Bob Jones', validThrough: new Date('2028-01-01'), authorized: true },
      },
      {
        docType: 'Driver',
        licenseNumber: 'DL-100002',
        firstName: 'Emma',
        lastName: 'Davis',
        card: { number: '4111111111113333', owner: 'Emma Davis', validThrough: new Date('2026-09-01'), authorized: false },
      },
      {
        docType: 'Driver',
        licenseNumber: 'DL-300001',
        firstName: 'David',
        lastName: 'Miller',
        card: { number: '5500000000000022', owner: 'David Miller', validThrough: new Date('2027-05-01'), authorized: true },
      },
      {
        docType: 'Driver',
        licenseNumber: 'DL-500001',
        firstName: 'Ivy',
        lastName: 'Clark',
        card: { number: '5500000000000044', owner: 'Ivy Clark', validThrough: new Date('2027-03-01'), authorized: true },
      },
       {
        docType: 'Driver',
        licenseNumber: 'DL-500002',
        firstName: 'Jack',
        lastName: 'Wilson',
        card: { number: '4111111111116666', owner: 'Jack Wilson', validThrough: new Date('2028-01-01'), authorized: true },
      },
      {
        docType: 'Driver',
        licenseNumber: 'DL-600001',
        firstName: 'Karen',
        lastName: 'Taylor',
        card: { number: '5500000000000055', owner: 'Karen Taylor', validThrough: new Date('2027-02-01'), authorized: true },
      }
    ];

    const savedDrivers = await Car.insertMany(driversData);

    // Helper function to get driverID by license
    const getDriverId = (license) => {
      const driver = savedDrivers.find(d => d.licenseNumber === license);
      return driver ? driver._id : null;
    };

    const vehiclesData = [
      {
        docType: 'Vehicle',
        vin: '1HGCM82633A123456',
        registrationNumber: 'MNS-1001',
        productionInfo: {
          brand: 'Toyota',
          model: 'Corolla',
          date: new Date('2015-03-10'),
        },
        status: 'In use',
        fuelLevel: 25,
        mileage: 124000,
        currentRun: {
          startDate: new Date('2026-08-20'),
          driverId: getDriverId('DL-100001'),
          startFuelLevel: 55,
          startMileage: 123500,
        },
        location: { type: 'Point', coordinates: [27.5611, 53.9023] }, 
        bookingsHistory: [
          {
            startDate: new Date('2026-06-01'),
            driverId: getDriverId('DL-200001'),
            startFuelLevel: 55,
            startMileage: 120000,
            finishFuelLevel: 45,
            finishMileage: 121000,
          },
          {
            startDate: new Date('2026-07-01'),
            driverId: getDriverId('DL-200002'),
            startFuelLevel: 45,
            startMileage: 121000,
            finishFuelLevel: 25,
            finishMileage: 123500,
          },
        ],
      },
      {
        docType: 'Vehicle',
        vin: '2T1BURHE0JC012345',
        registrationNumber: 'MNS-1002',
        productionInfo: {
          brand: 'Honda',
          model: 'Civic',
          date: new Date('2018-06-15'),
        },
        status: 'Reserved',
        fuelLevel: 30,
        mileage: 41000,
        currentRun: {
          startDate: new Date('2026-08-25'),
          driverId: getDriverId('DL-100002'),
          startFuelLevel: 47,
          startMileage: 44900,
        },
        location: { type: 'Point', coordinates: [27.5700, 53.9100] },
        bookingsHistory: [
          {
            startDate: new Date('2026-05-01'),
            driverId: getDriverId('DL-300001'),
            startFuelLevel: 47,
            startMileage: 40000,
            finishFuelLevel: 30,
            finishMileage: 41000,
          },
        ],
      },
      {
        docType: 'Vehicle',
        vin: '3VWLL7AJ0AM034567',
        registrationNumber: 'MNS-1003', 
        productionInfo: {
          brand: 'Volkswagen', 
          model: 'Jetta',
          date: new Date('2020-11-20'),
        },
        status: 'Unavailable', 
        fuelLevel: 20,
        mileage: 62000,
        currentRun: null,
        location: { type: 'Point', coordinates: [27.5500, 53.8900] },
        bookingsHistory: [
          {
            startDate: new Date('2026-07-15'),
            driverId: getDriverId('DL-100001'),
            startFuelLevel: 50,
            startMileage: 61000,
            finishFuelLevel: 20,
            finishMileage: 62000,
          },
        ],
      },
      {
        docType: 'Vehicle',
        vin: '4T3ZK3BB0NU056789',
        registrationNumber: 'MNS-1004', 
        productionInfo: {
          brand: 'BMW', 
          model: 'X3',
          date: new Date('2022-01-05'),
        },
        status: 'Free',
        fuelLevel: 10,
        mileage: 33000,
        currentRun: null, 
        location: { type: 'Point', coordinates: [27.5200, 53.8800] },
        bookingsHistory: [
          {
            startDate: new Date('2026-03-01'),
            driverId: getDriverId('DL-500001'), 
            startFuelLevel: 60,
            startMileage: 25000,
            finishFuelLevel: 40,
            finishMileage: 26000,
          },
          {
            startDate: new Date('2026-04-10'),
            driverId: getDriverId('DL-500002'), 
            startFuelLevel: 40,
            startMileage: 26000,
            finishFuelLevel: 10,
            finishMileage: 27500,
          },
          {
            startDate: new Date('2026-05-12'),
            driverId: getDriverId('DL-500002'), 
            startFuelLevel: 60,
            startMileage: 27500,
            finishFuelLevel: 10,
            finishMileage: 33000,
          },
        ],
      },
      {
        docType: 'Vehicle',
        vin: '5YJSA1E26HF078901',
        registrationNumber: 'MNS-1005', 
        productionInfo: {
          brand: 'Tesla', 
          model: 'Model S',
          date: new Date('2020-09-15'),
        },
        status: 'In Service',
        fuelLevel: 60,
        mileage: 56000,
        currentRun: null, 
        location: { type: 'Point', coordinates: [27.5300, 53.8950] },
        bookingsHistory: [
          {
            startDate: new Date('2026-02-01'),
            driverId: getDriverId('DL-600001'), 
            startFuelLevel: 100,
            startMileage: 55000,
            finishFuelLevel: 60,
            finishMileage: 56000,
          }
        ],
      },
      {
        docType: 'Vehicle',
        vin: '6FNYF4900PB901234',
        registrationNumber: 'MNS-1006', 
        productionInfo: {
          brand: 'Ford', 
          model: 'Focus',
          date: new Date('2014-05-22'),
        },
        status: 'In use',
        fuelLevel: 10,
        mileage: 148000,
        currentRun: {
          startDate: new Date('2026-08-31'),
          driverId: getDriverId('DL-300001'),
          startFuelLevel: 52,
          startMileage: 147000,
        }, 
        location: { type: 'Point', coordinates: [27.5600, 53.9050] },
        bookingsHistory: [
          {
            startDate: new Date('2026-01-15'),
            driverId: getDriverId('DL-600001'), 
            startFuelLevel: 52,
            startMileage: 145000,
            finishFuelLevel: 35,
            finishMileage: 146000,
          },
          {
            startDate: new Date('2026-02-20'),
            driverId: getDriverId('DL-500002'), 
            startFuelLevel: 35,
            startMileage: 146000,
            finishFuelLevel: 25,
            finishMileage: 146500,
          },
          {
            startDate: new Date('2026-04-05'),
            driverId: getDriverId('DL-100001'), 
            startFuelLevel: 25,
            startMileage: 146500,
            finishFuelLevel: 10,
            finishMileage: 147000,
          }
        ],
      },
    ];

    await Car.insertMany(vehiclesData);

    console.log(`Seeded into car-sharing database:`);
    console.log(`- ${savedDrivers.length} drivers`);
    console.log(`- ${vehiclesData.length} vehicles`);
  } catch (err) {
    console.error('Seed error:', err.message);
    throw err;
  }
}

module.exports = seedDatabase;