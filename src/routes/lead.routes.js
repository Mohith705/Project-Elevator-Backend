import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { auth, permit } from '../middlewares/auth.js';
import * as leadV from '../validations/lead.validation.js';
import * as leadC from '../controllers/lead.controller.js';
import { ROLES } from '../config/roles.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         elevatorId:
 *           type: string
 *           description: ID of the elevator
 *         name:
 *           type: string
 *           description: Elevator name
 *
 *     CreateLeadRequest:
 *       type: object
 *       required:
 *         - title
 *         - clientName
 *       properties:
 *         title:
 *           type: string
 *         clientName:
 *           type: string
 *         clientEmail:
 *           type: string
 *         clientPhone:
 *           type: string
 *         address:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
 *         requirements:
 *           type: string
 *         referralId:
 *           type: string
 *           description: Phone number of the referrer (optional)
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *
 *     LeadResponse:
 *       type: object
 *       properties:
 *         lead:
 *           $ref: '#/components/schemas/CreateLeadRequest'
 */

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeadRequest'
 *     responses:
 *       201:
 *         description: Lead created
 *   get:
 *     summary: List leads (paginated)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 */
router
    .route('/')
    .post(auth, permit(ROLES.ADMIN, ROLES.MANAGER, ROLES.MARKETING_EXEC), validate(leadV.createLead), leadC.createLead)
    .get(auth, permit(ROLES.ADMIN, ROLES.MANAGER), leadC.listLeads);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get a lead by ID
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 */
router
    .route('/:id')
    .get(auth, permit(ROLES.ADMIN, ROLES.MANAGER, ROLES.MARKETING_EXEC, ROLES.SERVICE_EXEC), leadC.getLead);

/**
 * @swagger
 * /leads/{id}/assign:
 *   post:
 *     summary: Assign a lead to a Service Executive
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 */
router
    .route('/:id/assign')
    .post(auth, permit(ROLES.ADMIN, ROLES.MANAGER), validate(leadV.assignLead), leadC.assignLead);

/**
 * @swagger
 * /leads/referral/{phoneNumber}:
 *   get:
 *     summary: Get all leads referred by a specific phone number
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of referred leads
 */
router
    .route('/referral/:phoneNumber')
    .get(auth, permit(ROLES.ADMIN, ROLES.MANAGER, ROLES.MARKETING_EXEC), validate(leadV.getReferralLeads), leadC.getLeadsByReferral);


/**
 * @swagger
 * /leads/phone/{phoneNumber}:
 *   get:
 *     summary: Get all leads by client phone number
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of leads for the given phone number
 */
router
    .route('/phone/:phoneNumber')
    .get(
        auth,
        permit(ROLES.ADMIN, ROLES.MANAGER, ROLES.MARKETING_EXEC),
        validate(leadV.getReferralLeads), // reuse same validation (phoneNumber param)
        leadC.getLeadsByPhone
    );

export default router;