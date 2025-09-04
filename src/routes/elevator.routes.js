import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import ElevatorType from '../models/ElevatorType.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ElevatorType:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *         - weight
 *         - price
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the elevator type
 *         name:
 *           type: string
 *           description: Name of the elevator type (Passenger, Freight, etc.)
 *         capacity:
 *           type: integer
 *           description: Capacity in number of persons
 *         weight:
 *           type: integer
 *           description: Maximum weight supported (in kg)
 *         price:
 *           type: number
 *           description: Price of the elevator
 *         image:
 *           type: string
 *           description: Image URL of the elevator type
 *       example:
 *         id: 64a1bcd23fa091
 *         name: Passenger Elevator
 *         capacity: 6
 *         weight: 600
 *         price: 500000
 *         image: "https://example.com/passenger.png"
 */
router.post("/types", async (req, res) => {
    try {
        const { name, capacityPersons, capacityWeight, price, image } = req.body;

        if (!name || !capacityPersons || !capacityWeight || !price) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const newElevator = new ElevatorType({
            name,
            capacityPersons,
            capacityWeight,
            price,
            image,
        });

        const savedElevator = await newElevator.save();
        res.status(201).json(savedElevator);
    } catch (error) {
        res.status(500).json({ message: "Error creating elevator type", error: error.message });
    }
});


/**
 * @swagger
 * tags:
 *   name: Elevators
 *   description: Elevator catalog management
 */
router.get("/types", async (req, res) => {
    try {
        const elevators = await ElevatorType.find();
        res.status(200).json(elevators);
    } catch (error) {
        res.status(500).json({ message: "Error fetching elevator types", error: error.message });
    }
});

/**
 * @swagger
 * /api/elevators/types:
 *   post:
 *     summary: Create a new elevator type
 *     tags: [Elevators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ElevatorType'
 *     responses:
 *       201:
 *         description: Elevator type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElevatorType'
 *       400:
 *         description: Invalid input
 *
 *   get:
 *     summary: Get list of elevator types
 *     tags: [Elevators]
 *     responses:
 *       200:
 *         description: List of elevator types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElevatorType'
 *
 * /api/elevators/types/{id}:
 *   get:
 *     summary: Get details of a specific elevator type
 *     tags: [Elevators]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Elevator type ID
 *     responses:
 *       200:
 *         description: Elevator type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElevatorType'
 *       404:
 *         description: Elevator type not found
 */
router.get("/types/:id", async (req, res) => {
    try {
        const elevator = await ElevatorType.findById(req.params.id);
        if (!elevator) {
            return res.status(404).json({ message: "Elevator type not found" });
        }
        res.status(200).json(elevator);
    } catch (error) {
        res.status(500).json({ message: "Error fetching elevator type", error: error.message });
    }
});

export default router;
