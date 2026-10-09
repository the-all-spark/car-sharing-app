// * Endpoints with JSDoc comments

const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: List of all drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 1
 *                   drivers:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Not Found (no drivers were found)
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
router.get('/', driverController.getDrivers);

/**
 * @swagger
 * /drivers:
 *   post:
 *     summary: Add a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Invalid input
 */
router.post('/', driverController.addDriver);

/**
 * @swagger
 * /drivers/{licenseNumber}:
 *   patch:
 *     summary: Update a driver by licenseNumber (Partial update)
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: licenseNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: "DL-300001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *           example:
 *              firstName: ''
 *              lastName: ''
 *              card: 
 *                number: ''  
 *                owner: ''
 *                validThrough: '' 
 *                authorized: false
 *     responses:
 *       200:
 *         description: Driver successfully updated. Returns the updated object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Driver updated"
 *                 driver:
 *                   $ref: '#/components/schemas/Driver'
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
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Driver not found"
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
router.patch('/:licenseNumber', driverController.updateDriverByLicense);

/**
 * @swagger
 * /drivers/{licenseNumber}:
 *   delete:
 *     summary: Remove a driver by license number
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: licenseNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: "DL-300001"
 *     responses:
 *       200:
 *         description: Driver successfully deleted. Returns the deleted object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Driver deleted"
 *                 driver:
 *                   type: object
 *                   description: The full document of the deleted driver
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Driver not found"
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
router.delete('/:licenseNumber', driverController.deleteDriverByLicense);

module.exports = router;
