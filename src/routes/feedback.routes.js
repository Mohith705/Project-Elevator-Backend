import express from "express";
import validate from "../middlewares/validate.js";
import { submitFeedback as submitFeedbackValidation } from "../validations/feedback.validation.js";
import { submitFeedback, getAllFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API for managing feedback and testimonials
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - name
 *         - company
 *         - email
 *         - feedback
 *       properties:
 *         name:
 *           type: string
 *           example: Bayya Mohith
 *         companyOrProject:
 *           type: string
 *           example: Yatra Constructions
 *         phone:
 *           type: string
 *           example: +919876543210
 *         productType:
 *           type: string
 *           enum: [Passenger Elevator, Home Elevator, Freight, Escalator, Travelator, Other]
 *           example: Passenger Elevator
 *         location:
 *           type: string
 *           example: Hyderabad
 *         feedback:
 *           type: string
 *           example: "Great service, professional team!"
 *         allowShowcase:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Submit feedback/testimonial
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Validation error
 */
router.post("/", validate(submitFeedbackValidation), submitFeedback);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedback/testimonials
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 */
router.get("/", getAllFeedback);

export default router;
