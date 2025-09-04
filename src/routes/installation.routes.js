import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { auth, permit } from '../middlewares/auth.js';
import * as instV from '../validations/installation.validation.js';
import * as instC from '../controllers/installation.controller.js';
import { ROLES } from '../config/roles.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /installations/{leadId}:
 *   post:
 *     summary: Create an installation for a lead
 *     tags: [Installations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstallRequest'
 *     responses:
 *       201:
 *         description: Installation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstallationResponse'
 *       404:
 *         description: Lead not found
 */
router.post('/:leadId', auth, permit(ROLES.ADMIN, ROLES.MANAGER), validate(instV.createInstall), instC.createInstall);

/**
 * @swagger
 * /installations/{leadId}:
 *   get:
 *     summary: Get installation by leadId
 *     tags: [Installations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Installation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstallationResponse'
 *       404:
 *         description: Installation not found
 */
router.get('/:leadId', auth, permit(ROLES.ADMIN, ROLES.MANAGER, ROLES.SERVICE_EXEC), instC.getInstall);

/**
 * @swagger
 * /installations/{leadId}/step:
 *   patch:
 *     summary: Update a single installation step
 *     tags: [Installations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInstallStepRequest'
 *     responses:
 *       200:
 *         description: Step updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstallationResponse'
 *       400:
 *         description: Invalid step index
 *       404:
 *         description: Installation not found
 */
router.patch('/:leadId/step', auth, permit(ROLES.SERVICE_EXEC, ROLES.ADMIN, ROLES.MANAGER), validate(instV.updateStep), instC.updateStep);

export default router;
