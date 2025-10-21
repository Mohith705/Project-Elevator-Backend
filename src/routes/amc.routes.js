import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { auth, permit } from '../middlewares/auth.js';
import * as amcV from '../validations/amc.validation.js';
import * as amcC from '../controllers/amc.controller.js';
import { ROLES } from '../config/roles.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /amc/{leadId}:
 *   post:
 *     summary: Create/activate AMC for a lead
 *     tags: [AMC]
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
 *             $ref: '#/components/schemas/CreateAmcRequest'
 *     responses:
 *       201:
 *         description: AMC created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AMCResponse'
 *       404:
 *         description: Lead not found
 */
router.post('/:leadId', auth, permit(ROLES.ADMIN, ROLES.MANAGER), validate(amcV.createAmc), amcC.createAmc);

/**
 * @swagger
 * /amc/{leadId}:
 *   get:
 *     summary: Get AMC for a lead
 *     tags: [AMC]
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
 *         description: AMC
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AMCResponse'
 *       404:
 *         description: AMC not found
 */
router.get('/:leadId', auth, permit(ROLES.ADMIN, ROLES.MANAGER), amcC.getAmc);

/**
 * @swagger
 * /amc/{leadId}:
 *   patch:
 *     summary: Update AMC for a lead
 *     tags: [AMC]
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
 *             $ref: '#/components/schemas/CreateAmcRequest'
 *     responses:
 *       200:
 *         description: AMC updated successfully
 *       404:
 *         description: AMC not found
 */
router.patch(
    '/:leadId',
    auth,
    permit(ROLES.ADMIN, ROLES.MANAGER),
    validate(amcV.createAmc),
    amcC.updateAmc
);

/**
 * @swagger
 * /amc/{leadId}:
 *   delete:
 *     summary: Delete AMC for a lead
 *     tags: [AMC]
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
 *         description: AMC deleted successfully
 *       404:
 *         description: AMC not found
 */
router.delete(
    '/:leadId',
    auth,
    permit(ROLES.ADMIN, ROLES.MANAGER),
    amcC.deleteAmc
);


export default router;