import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { auth, permit } from '../middlewares/auth.js';
import * as quoteV from '../validations/quotation.validation.js';
import * as quoteC from '../controllers/quotation.controller.js';
import { ROLES } from '../config/roles.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /quotes/{leadId}:
 *   put:
 *     summary: Create or update quotation for a lead
 *     tags: [Quotes]
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
 *             $ref: '#/components/schemas/QuoteUpsertRequest'
 *     responses:
 *       200:
 *         description: Quotation upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuoteResponse'
 *       404:
 *         description: Lead not found
 */
router.put('/:leadId', auth, permit(ROLES.ADMIN, ROLES.MANAGER), validate(quoteV.createOrUpdateQuote), quoteC.upsertQuote);

/**
 * @swagger
 * /quotes/{leadId}/send:
 *   post:
 *     summary: Mark quotation as SENT (demo send)
 *     tags: [Quotes]
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
 *         description: Quote sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuoteResponse'
 *       404:
 *         description: Quote not found
 */
router.post('/:leadId/send', auth, permit(ROLES.ADMIN, ROLES.MANAGER), quoteC.sendQuote);

/**
 * @swagger
 * /quotes/{leadId}/approve:
 *   post:
 *     summary: Approve quotation
 *     tags: [Quotes]
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
 *         description: Quotation approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuoteResponse'
 *       404:
 *         description: Quote not found
 */
router.post('/:leadId/approve', auth, permit(ROLES.ADMIN, ROLES.MANAGER), quoteC.approveQuote);

/**
 * @swagger
 * /quotes/{leadId}/reject:
 *   post:
 *     summary: Reject quotation
 *     tags: [Quotes]
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
 *         description: Quotation rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuoteResponse'
 *       404:
 *         description: Quote not found
 */
router.post('/:leadId/reject', auth, permit(ROLES.ADMIN, ROLES.MANAGER), quoteC.rejectQuote);

export default router;
