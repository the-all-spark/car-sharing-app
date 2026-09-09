// API configuration: routes, data parsing, automatic Swagger documentation

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const carRoutes = require('./routes/carRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/cars', carRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Car Sharing API',
    docs: '/api-docs',
    endpoints: {
      getCarsInUseLowFuel: 'GET /api/cars/in-use/low-fuel',
      getReservedUnauthorizedCard: 'GET /api/cars/reserved/unauthorized-card',
      addCar: 'POST /api/cars',
      setInServiceOldOrHighMileage: 'PUT /api/cars/service-old-or-high-mileage',
      relocateFrequentBookers: 'PUT /api/cars/relocate-frequent',
      deleteCarByVin: 'DELETE /api/cars/:vin',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
