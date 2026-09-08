// * Endpoints with JSDoc comments

const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

/**
 * @swagger
 * /api/cars/in-use/low-fuel:
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
 *                 $ref: '#/components/schemas/Vehicle'
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
 * /api/cars/reserved/unauthorized-card:
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
 * /api/cars:
 *   post:
 *     summary: Add a new car to the car sharing park
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 */
router.post('/', carController.addCar);

/**
 * @swagger
 * /api/cars/service-old-or-high-mileage:
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
 * /api/cars/relocate-frequent:
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
 * /api/cars/{vin}:
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
 *         description: Car not found or the document is not a Vehicle
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
