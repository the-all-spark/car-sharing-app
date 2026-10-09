// * Filling database with initial data

const Car = require('../models/car.model');
const Driver = require('../models/driver.model');
const Booking = require('../models/booking.model');

async function seedDatabase() {
  try {
    await Promise.all([
      Car.cleanIndexes(),
      Driver.cleanIndexes(),
      Booking.cleanIndexes()
    ]);

    await Promise.all([
      Car.deleteMany({}),
      Driver.deleteMany({}),
      Booking.deleteMany({})
    ]);

    const driversData = [
      {
        licenseNumber: 'DL-100001',
        firstName: 'John',
        lastName: 'Smith',
        card: { number: '4111111111111111', owner: 'John Smith', validThrough: new Date('2027-06-01'), authorized: true },
      },
      {
        licenseNumber: 'DL-200001',
        firstName: 'Alice',
        lastName: 'Brown',
        card: { number: '5500000000000004', owner: 'Alice Brown', validThrough: new Date('2026-12-01'), authorized: true },
      },
      {
        licenseNumber: 'DL-200002',
        firstName: 'Bob',
        lastName: 'Jones',
        card: { number: '4111111111112222', owner: 'Bob Jones', validThrough: new Date('2028-01-01'), authorized: true },
      },
      {
        licenseNumber: 'DL-100002',
        firstName: 'Emma',
        lastName: 'Davis',
        card: { number: '4111111111113333', owner: 'Emma Davis', validThrough: new Date('2026-09-01'), authorized: false },
      },
      {
        licenseNumber: 'DL-300001',
        firstName: 'David',
        lastName: 'Miller',
        card: { number: '5500000000000022', owner: 'David Miller', validThrough: new Date('2027-05-01'), authorized: true },
      },
      {
        licenseNumber: 'DL-500001',
        firstName: 'Ivy',
        lastName: 'Clark',
        card: { number: '5500000000000044', owner: 'Ivy Clark', validThrough: new Date('2027-03-01'), authorized: true },
      },
       {
        licenseNumber: 'DL-500002',
        firstName: 'Jack',
        lastName: 'Wilson',
        card: { number: '4111111111116666', owner: 'Jack Wilson', validThrough: new Date('2028-01-01'), authorized: true },
      },
      {
        licenseNumber: 'DL-600001',
        firstName: 'Karen',
        lastName: 'Taylor',
        card: { number: '5500000000000055', owner: 'Karen Taylor', validThrough: new Date('2027-02-01'), authorized: true },
      }
    ];

    const vehiclesData = [
      {
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
        currentBookingId: null, // a current run will be here
        location: { type: 'Point', coordinates: [27.5611, 53.9023] }, 
      },
      {
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
        currentBookingId: null,
        location: { type: 'Point', coordinates: [27.5700, 53.9100] },
      },
      {
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
        currentBookingId: null,
        location: { type: 'Point', coordinates: [27.5500, 53.8900] },
      },
      {
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
        currentBookingId: null,
        location: { type: 'Point', coordinates: [27.5200, 53.8800] },
      },
      {
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
        currentBookingId: null,
        location: { type: 'Point', coordinates: [27.5300, 53.8950] },
      },
      {
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
        currentBookingId: null,
        location: { type: 'Point', coordinates: [27.5600, 53.9050] },
      },
    ];

    const savedCars = await Car.insertMany(vehiclesData);
    const savedDrivers = await Driver.insertMany(driversData);

    const getDriverId = (license) => {
      const driver = savedDrivers.find(d => d.licenseNumber === license);
      return driver ? driver._id : null;
    };

    const getVehicleId = (vin) => {
      const car = savedCars.find(c => c.vin === vin.toUpperCase());
      return car ? car._id : null;
    };

    const bookingsData = [
      {
        vehicleId: getVehicleId('1HGCM82633A123456'),
        driverId: getDriverId('DL-100001'),
        startDate: new Date('2026-08-20'),
        startFuelLevel: 55,
        startMileage: 123500,
        finishDate:  null, 
        finishFuelLevel: null,  
        finishMileage: null,
      },
      {
        vehicleId: getVehicleId('1HGCM82633A123456'),
        driverId: getDriverId('DL-200001'),
        startDate: new Date('2026-06-01'),
        startFuelLevel: 55,
        startMileage: 120000,
        finishDate:  new Date('2026-06-03'),
        finishFuelLevel: 45,
        finishMileage: 121000,
      }, 
      {
        vehicleId: getVehicleId('1HGCM82633A123456'),
        driverId: getDriverId('DL-200002'),
        startDate: new Date('2026-07-01'),
        startFuelLevel: 45,
        startMileage: 121000,
        finishDate: new Date('2026-07-04'), 
        finishFuelLevel: 25,
        finishMileage: 123500,
      }, 
      {
        vehicleId: getVehicleId('2T1BURHE0JC012345'),
        driverId: getDriverId('DL-100002'),
        startDate: new Date('2026-08-25'),
        startFuelLevel: 47,
        startMileage: 44900,
        finishDate:  null, 
        finishFuelLevel: null,  
        finishMileage: null,
      }, 
      {
        vehicleId: getVehicleId('2T1BURHE0JC012345'),
        driverId: getDriverId('DL-300001'),
        startDate: new Date('2026-05-01'),
        startFuelLevel: 47,
        startMileage: 40000,
        finishDate:  new Date('2026-05-03'), 
        finishFuelLevel: 30,  
        finishMileage: 41000,
      },
      {
        vehicleId: getVehicleId('3VWLL7AJ0AM034567'),
        driverId: getDriverId('DL-100001'),
        startDate: new Date('2026-07-15'),
        startFuelLevel: 50,
        startMileage: 61000,
        finishDate:  new Date('2026-07-18'), 
        finishFuelLevel: 20,  
        finishMileage: 62000,
      },
      {
        vehicleId: getVehicleId('4T3ZK3BB0NU056789'),
        driverId: getDriverId('DL-500001'),
        startDate: new Date('2026-03-01'),
        startFuelLevel: 60,
        startMileage: 25000,
        finishDate:  new Date('2026-03-05'), 
        finishFuelLevel: 40,  
        finishMileage: 26000,
      }, 
      {
        vehicleId: getVehicleId('4T3ZK3BB0NU056789'),
        driverId: getDriverId('DL-500002'),
        startDate: new Date('2026-04-10'),
        startFuelLevel: 40,
        startMileage: 26000,
        finishDate:  new Date('2026-04-12'), 
        finishFuelLevel: 10,  
        finishMileage: 27500,
      },
      {
        vehicleId: getVehicleId('4T3ZK3BB0NU056789'),
        driverId: getDriverId('DL-500002'),
        startDate: new Date('2026-05-12'),
        startFuelLevel: 60,
        startMileage: 27500,
        finishDate:  new Date('2026-05-15'), 
        finishFuelLevel: 10,  
        finishMileage: 33000,
      },
      {
        vehicleId: getVehicleId('5YJSA1E26HF078901'),
        driverId: getDriverId('DL-600001'),
        startDate: new Date('2026-02-01'),
        startFuelLevel: 100,
        startMileage: 55000,
        finishDate:  new Date('2026-02-03'), 
        finishFuelLevel: 60,  
        finishMileage: 56000,
      },
      {
        vehicleId: getVehicleId('6FNYF4900PB901234'),
        driverId: getDriverId('DL-300001'),
        startDate: new Date('2026-08-31'),
        startFuelLevel: 52,
        startMileage: 147000,
        finishDate:  null, 
        finishFuelLevel: null,  
        finishMileage: null,
      },
      {
        vehicleId: getVehicleId('6FNYF4900PB901234'),
        driverId: getDriverId('DL-600001'),
        startDate: new Date('2026-01-15'),
        startFuelLevel: 52,
        startMileage: 145000,
        finishDate:  new Date('2026-01-18'), 
        finishFuelLevel: 35,  
        finishMileage: 146000,
      },
      {
        vehicleId: getVehicleId('6FNYF4900PB901234'),
        driverId: getDriverId('DL-500002'),
        startDate: new Date('2026-02-20'),
        startFuelLevel: 35,
        startMileage: 146000,
        finishDate:  new Date('2026-02-22'), 
        finishFuelLevel: 25,  
        finishMileage: 146500,
      },
      {
        vehicleId: getVehicleId('6FNYF4900PB901234'),
        driverId: getDriverId('DL-100001'),
        startDate: new Date('2026-04-05'),
        startFuelLevel: 25,
        startMileage: 146500,
        finishDate:  new Date('2026-04-08'), 
        finishFuelLevel: 10,  
        finishMileage: 147000,
      }
    ];

    const savedBookings = await Booking.insertMany(bookingsData);
    const activeBookings = savedBookings.filter(b => b.finishDate === null);

    for (const booking of activeBookings) {
      await Car.updateOne(
        { _id: booking.vehicleId },
        {  $set: { currentBookingId: booking._id,} }
      );
    }

    console.log(`Seeded into car-sharing database:`);
    console.log(`- ${savedDrivers.length} drivers`);
    console.log(`- ${savedCars.length} vehicles`);
    console.log(`- ${savedBookings.length} bookings`);
  } catch (err) {
    console.error('Seed error:', err.message);
    throw err;
  }
}

module.exports = seedDatabase;