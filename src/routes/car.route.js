// * Endpoints with JSDoc comments

const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of all cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 1
 *                   cars:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Car'
 *       404:
 *         description: Not Found (no cars were found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error (e.g., database connection issues)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', carController.getCars);

/**
 * @swagger
 * /cars/in-use/low-fuel:
 *   get:
 *     summary: Get cars currently in use with fuel level less than 1/4 of full tank
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of cars in use with low fuel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       404:
 *         description: Not Found (no vehicles match the criteria)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error (e.g., database connection issues)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/in-use/low-fuel', carController.getCarsInUseLowFuel);

/**
 * @swagger
 * /cars/reserved/unauthorized-card:
 *   get:
 *     summary: Get reserved cars whose driver credit/debit card hasn't been authorized
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of reserved vehicles linked to drivers with unauthorized cards, including basic vehicle details and driver credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vin:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [0, 0]
 *                   driverFirstName:
 *                     type: string
 *                   driverLastName:
 *                     type: string
 *                   driverLicenseNumber:
 *                     type: string
 *       404:
 *         description: Not Found (no reserved cars with unauthorized cards match the criteria)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error (e.g., database aggregation failure)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reserved/unauthorized-card', carController.getReservedUnauthorizedCard);

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Add a new car to the car sharing park
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid input
 */
router.post('/', carController.addCar);

/**
 * @swagger
 * /cars/service-old-or-high-mileage:
 *   put:
 *     summary: Set status to In Service for vehicles produced before 01/01/2017 or with mileage > 100000 km
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Operation completed successfully. See the message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully set status to 'In Service'
 *                 matchedCount:
 *                   type: integer
 *                   description: Number of vehicles found that match the criteria
 *                   example: 3
 *                 modifiedCount:
 *                   type: integer
 *                   description: The number of vehicles whose status was actually changed
 *                   example: 3
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.put('/service-old-or-high-mileage', carController.setInServiceOldOrHighMileage);

/**
 * @swagger
 * /cars/relocate-frequent:
 *   put:
 *     summary: Relocate cars booked more than 2 times (not In use or Reserved) to Minsk coordinates
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Operation completed successfully. See the message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully processed 1 vehicle(s).
 *                 matchedCount:
 *                   type: integer
 *                   description: Number of vehicles found that match the criteria
 *                   example: 3
 *                 modifiedCount:
 *                   type: integer
 *                   description: The number of vehicles whose coordinates were actually changed
 *                   example: 1
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.put('/relocate-frequent', carController.relocateFrequentBookers);

/**
 * @swagger
 * /cars/{vin}:
 *   patch:
 *     summary: Update a car by its VIN number (Partial update)
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: vin
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 17
 *           maxLength: 17
 *           example: "6FNYF4900PB901234"
 *         description: The 17-character Vehicle Identification Number (case-insensitive)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *           example:
 *             registrationNumber: ""
 *             status: "Free"
 *             fuelLevel: 100
 *             mileage: 50000
 *             location:
 *               type: "Point"
 *               coordinates: [27.5443, 53.8883]
 *     responses:
 *       200:
 *         description: Car successfully updated. Returns the updated object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car updated"
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Bad Request (e.g. trying to update read-only fields or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.patch('/:vin', carController.updateCarByVin);

/**
 * @swagger
 * /cars/{vin}:
 *   delete:
 *     summary: Remove a car by its VIN number
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: vin
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 17
 *           maxLength: 17
 *           example: "6FNYF4900PB901234"
 *         description: The 17-character Vehicle Identification Number (case-insensitive)
 *     responses:
 *       200:
 *         description: Car successfully deleted. Returns the deleted object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car deleted"
 *                 car:
 *                   type: object
 *                   description: The full document of the deleted car
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:vin', carController.deleteCarByVin);

module.exports = router;
