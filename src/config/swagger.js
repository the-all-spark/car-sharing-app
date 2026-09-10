// * Swagger configuration

const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Sharing API',
      version: '1.0.0',
      description: 'REST API for a car sharing service vehicle park',
    },
    servers: [
      { url: `http://localhost:${PORT}/api`, description: 'Local server' },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { 
              type: 'string', 
              description: 'Human-readable error message detailing what went wrong' 
            },
          },
        },
        Card: {
          type: 'object',
          required: ['number', 'owner', 'validThrough'],
          properties: {
            number: { type: 'string' },
            owner: { type: 'string' },
            validThrough: { type: 'string', format: 'date-time' },
            authorized: { type: 'boolean', default: false },
          },
        },
        Driver: {
          type: 'object',
          required: ['licenseNumber', 'firstName', 'lastName', 'card'],
          properties: {
            licenseNumber: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            card: { $ref: '#/components/schemas/Card' },
          },
        },
        ProductionInfo: {
          type: 'object',
          required: ['brand', 'model', 'date'],
          properties: {
            brand: { type: 'string' },
            model: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        Car: {
          type: 'object',
          required: ['vin', 'registrationNumber', 'productionInfo'],
          properties: {
            vin: { 
              type: 'string', 
              minLength: 17, 
              maxLength: 17, 
              writeOnly: false,
              example: '1HGCR2F8XHA000000', 
              pattern: '^[A-HJ-NPR-Z0-9]{17}$',
              description: 'VIN-code, consisted from 17 numbers'
            },
            registrationNumber: { type: 'string', example: 'A123AA77' },
            productionInfo: { $ref: '#/components/schemas/ProductionInfo' },
            status: {
              type: 'string',
              enum: ['Free', 'Reserved', 'In use', 'Unavailable', 'In Service'],
              default: 'Free',
            },
            fuelLevel: { type: 'number', minimum: 0, maximum: 100, default: 100 },
            mileage: { type: 'number', minimum: 0, default: 0 },
            currentBookingId: { 
              type: 'string', 
              description: 'ObjectId references to Booking id (Booking model)',
              nullable: true,
              example: null
            },
            location: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['Point'] },
                coordinates: {
                  type: 'array',
                  items: { type: 'number' },
                  minItems: 2,
                  maxItems: 2,
                  description: '[longitude, latitude]',
                },
              },
            },
          },
        },
        Booking: {
          type: 'object',
          required: ['vehicleId', 'driverId', 'startDate', 'startFuelLevel', 'startMileage'],
          properties: {
            vehicleId: { type: 'string', description: 'ObjectId references to Car id (Car model)' },
            driverId: { type: 'string', description: 'ObjectId references to Driver id (Driver model)' },
            startDate: { type: 'string', format: 'date-time' },
            startFuelLevel: { type: 'number', minimum: 0 },
            startMileage: { type: 'number', minimum: 0 },
            finishDate: { type: 'string', format: 'date-time', nullable: true, example: null },
            finishFuelLevel: { type: 'number', nullable: true, example: null},
            finishMileage: { type: 'number', nullable: true, example: null },
          }
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
