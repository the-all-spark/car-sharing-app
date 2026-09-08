const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const Car = require('./models/Car');
const seedDatabase = require('./seed/seed');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function start() {
  try {
    await connectDB();

    const vehicleCount = await Car.countDocuments({ docType: 'Vehicle' });

    if (vehicleCount === 0) {
      console.log('No vehicles found in database. Running seeder...');
      await Car.deleteMany({}); 
      await seedDatabase();
      console.log('Database successfully seeded!');
    } else {
      console.log(`Database already contains ${vehicleCount} vehicles. Skipping seeder.`);
    }

    server.listen(PORT, () => {
      console.log(`Car Sharing API server running on port ${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error('Initialization error:', error.message);
    
    server.listen(PORT, () => {
      console.log(`Server started in SAFE MODE on port ${PORT} (DB error occurred)`);
    });
  }
}

start();
