import express from "express";
import { submitRequirement, getAllRequirements } from "../controllers/customerRequirement.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerRequirement:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Ravi Kumar"
 *         occupation:
 *           type: string
 *           example: "Architect"
 *         location:
 *           type: string
 *           example: "Hyderabad"
 *         mobile:
 *           type: string
 *           example: "+919876543210"
 *         verticalTransport:
 *           type: string
 *           example: "Passenger Lift"
 *         purpose:
 *           type: string
 *           example: "Residential Building"
 *         outputStyle:
 *           type: string
 *           example: "Glass Cabin"
 *         doorType:
 *           type: string
 *           example: "Automatic Sliding"
 *         capacity:
 *           type: string
 *           example: "8 Persons"
 *         cabinSize:
 *           type: string
 *           example: "1500 x 1500 mm"
 *         interiorColor:
 *           type: string
 *           example: "Beige"
 *         interiorTheme:
 *           type: string
 *           example: "Modern"
 *         lighting:
 *           type: string
 *           example: "Warm"
 *         floorMaterial:
 *           type: string
 *           example: "Granite"
 *         floors:
 *           type: number
 *           example: 5
 *         travelHeight:
 *           type: string
 *           example: "15m"
 *         pitDepth:
 *           type: string
 *           example: "1500mm"
 *         overheadSpace:
 *           type: string
 *           example: "3000mm"
 *         powerSupply:
 *           type: string
 *           example: "Three Phase"
 *         preferredSpeed:
 *           type: string
 *           example: "1.0 m/s"
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           example: ["ARD", "CCTV Surveillance", "Energy Efficient Operation"]
 *         amcRequired:
 *           type: string
 *           example: "Yes"
 *         budget:
 *           type: string
 *           example: "₹10–20 Lakhs"
 *         timeline:
 *           type: string
 *           example: "3–6 Months"
 *         additionalNotes:
 *           type: string
 *           example: "Prefer glass doors with luxury interiors."
 */

/**
 * @swagger
 * /requirements:
 *   post:
 *     summary: Submit a new customer requirement form
 *     tags: [Customer Requirements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerRequirement'
 *     responses:
 *       201:
 *         description: Requirement submitted successfully
 *   get:
 *     summary: Get all submitted requirements
 *     tags: [Customer Requirements]
 *     responses:
 *       200:
 *         description: List of requirements
 */
router.post("/", submitRequirement);
router.get("/", getAllRequirements);

export default router;
