import express from "express";
import validate from "../middlewares/validate.js";
import { auth, permit } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
import {
  submitFeedback,
  getAllFeedback,
  getApprovedFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";
import { submitFeedback as submitFeedbackValidation, updateFeedback as updateFeedbackValidation } from "../validations/feedback.validation.js";

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
 *         - companyOrProject
 *         - phone
 *         - productType
 *         - location
 *         - feedback
 *         - allowShowcase
 *       properties:
 *         name:
 *           type: string
 *         companyOrProject:
 *           type: string
 *         phone:
 *           type: string
 *         productType:
 *           type: string
 *           enum: [Passenger Elevator, Home Elevator, Freight, Escalator, Travelator, Other]
 *         otherProduct:
 *           type: string
 *         location:
 *           type: string
 *         feedback:
 *           type: string
 *         allowShowcase:
 *           type: boolean
 *         approved:
 *           type: boolean
 *           description: "Indicates if admin approved the testimonial"
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
 *       201:
 *         description: Feedback submitted successfully
 */
router.post("/", validate(submitFeedbackValidation), submitFeedback);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedback (admin view)
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of all feedback
 */
router.get("/", auth, permit(ROLES.ADMIN, ROLES.MANAGER), getAllFeedback);

/**
 * @swagger
 * /feedback/approved:
 *   get:
 *     summary: Get only approved and showcase-allowed feedback
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of approved feedback for public view
 */
router.get("/approved", getApprovedFeedback);

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Update feedback (admin only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 */
router.put("/:id", auth, permit(ROLES.ADMIN, ROLES.MANAGER), validate(updateFeedbackValidation), updateFeedback);

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Delete feedback (admin only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 */
router.delete("/:id", auth, permit(ROLES.ADMIN, ROLES.MANAGER), deleteFeedback);

export default router;
