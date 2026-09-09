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
        ProductionInfo: {
          type: 'object',
          required: ['brand', 'model', 'date'],
          properties: {
            brand: { type: 'string' },
            model: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        CurrentRun: {
          type: 'object',
          required: ['startDate', 'driverId', 'startFuelLevel', 'startMileage'],
          properties: {
            startDate: { type: 'string', format: 'date-time' },
            driverId: { type: 'string', description: 'ObjectId references to Driver (Car model)' },
            startFuelLevel: { type: 'number', minimum: 0 },
            startMileage: { type: 'number', minimum: 0 },
          },
        },
        BookingHistory: {
          type: 'object',
          required: ['startDate', 'driverId', 'startFuelLevel', 'startMileage'],
          properties: {
            startDate: { type: 'string', format: 'date-time' },
            driverId: { type: 'string', description: 'ObjectId references to Driver (Car model)' },
            startFuelLevel: { type: 'number', minimum: 0 },
            startMileage: { type: 'number', minimum: 0 },
            finishFuelLevel: { type: 'number', nullable: true },
            finishMileage: { type: 'number', nullable: true },
          },
        },
        // Basic scheme for discriminator
        CarCollectionItem: {
          type: 'object',
          required: ['docType'],
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectId', readOnly: true },
            docType: {
              type: 'string',
              enum: ['Vehicle', 'Driver'],
              description: 'Discriminator key to distinguish between Vehicle and Driver documents',
            },
          },
          discriminator: {
            propertyName: 'docType',
            mapping: {
              Vehicle: '#/components/schemas/Vehicle',
              Driver: '#/components/schemas/Driver',
            },
          },
        },
        // discriminator: Vehicle
        Vehicle: {
          allOf: [
            { $ref: '#/components/schemas/CarCollectionItem' },
            {
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
                currentRun: { 
                  allOf: [
                    { $ref: '#/components/schemas/CurrentRun' }
                  ],
                  nullable: true,
                  readOnly: true 
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
                bookingsHistory: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/BookingHistory' },
                  default: [],
                  readOnly: true
                },
              },
            },
          ],
        },
        // discriminator: Driver
        Driver: {
          allOf: [
            { $ref: '#/components/schemas/CarCollectionItem' },
            {
              type: 'object',
              required: ['licenseNumber', 'firstName', 'lastName', 'card'],
              properties: {
                licenseNumber: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                card: { $ref: '#/components/schemas/Card' },
              },
            },
          ],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
