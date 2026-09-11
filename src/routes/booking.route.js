// * Endpoints with JSDoc comments

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 1
 *                   bookings:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Not Found (no bookings were found)
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
router.get('/', bookingController.getBookings);

/**
 * @swagger
 * /bookings/book/{vin}:
 *   post:
 *     summary: Book a car by its VIN
 *     tags: [Bookings]
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
 *             type: object
 *             required:
 *               - licenseNumber
 *               - startFuel
 *               - startMileage
 *             properties:
 *               licenseNumber:
 *                 type: string
 *                 example: "DL-700001"
 *               startFuel:
 *                 type: number
 *                 example: 100
 *               startMileage:
 *                 type: number
 *                 example: 10500
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error' 
 *       404:
 *         description: Not Found (no car/driver was found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/book/:vin', bookingController.bookCar);

/**
 * @swagger
 * /bookings/unbook/{vin}:
 *   post:
 *     summary: Unbook the car by its VIN (Finish the trip)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: vin
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 17
 *           maxLength: 17
 *           example: "6FNYF4900PB901234"
 *         description: The 17-character Vehicle Identification Number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseNumber
 *               - finishFuel
 *               - finishMileage
 *             properties:
 *               licenseNumber:
 *                 type: string
 *                 example: "DL-300001"
 *               finishFuel:
 *                 type: number
 *                 example: 40
 *               finishMileage:
 *                 type: number
 *                 example: 123750
 *     responses:
 *       200:
 *         description: Booking finished successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input or data mismatch (e.g., fuel/mileage lower than start)
 *       404:
 *         description: Active booking, car, or driver not found
 */
router.post('/unbook/:vin', bookingController.unbookCar);

module.exports = router;
