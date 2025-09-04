import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { auth, permit } from '../middlewares/auth.js';
import * as leadV from '../validations/lead.validation.js';
import * as leadC from '../controllers/lead.controller.js';
import { ROLES } from '../config/roles.js';

const router = Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeadResponse'
 *   get:
 *     summary: List leads (paginated)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/LeadStatus'
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, default: 20 }
 *     responses:
 *       200:
 *         description: List of leads
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeadListResponse'
 */
router
    .route('/')
    .post(auth, permit(ROLES.ADMIN, ROLES.MANAGER, ROLES.MARKETING_EXEC), validate(leadV.createLead), leadC.createLead)
    .get(auth, permit(ROLES.ADMIN, ROLES.MANAGER), leadC.listLeads);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get a lead by id
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Lead
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeadResponse'
 *       404:
 *         description: Lead not found
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignLeadRequest'
 *     responses:
 *       200:
 *         description: Lead assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeadResponse'
 *       404:
 *         description: Lead not found
 */
router
    .route('/:id/assign')
    .post(auth, permit(ROLES.ADMIN, ROLES.MANAGER), validate(leadV.assignLead), leadC.assignLead);

export default router;
