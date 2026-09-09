const http = require('http');
const connectDB = require('./config/db');

const Car = require('./models/car.model');
// ! другие модели

const carRoutes = require('./routes/car.route');
// ! другие маршруты

const seedDatabase = require('./seed/seed');

const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const dotenv = require('dotenv');
dotenv.config();

// API configuration: routes, data parsing, automatic Swagger documentation
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/cars', carRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Entry point
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

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
