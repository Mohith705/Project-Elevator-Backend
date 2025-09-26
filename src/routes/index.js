import { Router } from 'express';
import authRoutes from './auth.routes.js';
import leadRoutes from './lead.routes.js';
import quotationRoutes from './quotation.routes.js';
import installationRoutes from './installation.routes.js';
import amcRoutes from './amc.routes.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { auth, permit } from '../middlewares/auth.js';
import * as uploadC from '../controllers/upload.controller.js';
import { ROLES } from '../config/roles.js';

import elevatorRoutes from './elevator.routes.js';
import serviceRoutes from './service.routes.js';
import customerRoutes from './customer.routes.js';
import feedbackRoutes from "./feedback.routes.js";
import customerRequirement from "./customerRequirement.routes.js";

dotenv.config();

const router = Router();

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Yatra Backend API
 *   version: 1.0.0
 * servers:
 *   - url: /api
 * tags:
 *   - name: Auth
 *   - name: Leads
 *   - name: Quotes
 *   - name: Installations
 *   - name: AMC
 *   - name: Upload
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Role:
 *       type: string
 *       enum: [ADMIN, MANAGER, MARKETING_EXEC, SERVICE_EXEC]
 *
 *     LeadStatus:
 *       type: string
 *       enum: [NEW, ASSIGNED, INSPECTION, QUOTED, APPROVED, REJECTED, INSTALLING, COMPLETED]
 *
 *     QuoteStatus:
 *       type: string
 *       enum: [DRAFT, SENT, APPROVED, REJECTED, REVISION_REQUESTED]
 *
 *     InstallStatus:
 *       type: string
 *       enum: [PENDING, IN_PROGRESS, COMPLETED]
 *
 *     AmcStatus:
 *       type: string
 *       enum: [OFFERED, ACTIVE, EXPIRED, DECLINED]
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code: { type: integer, example: 400 }
 *         message: { type: string }
 *         stack: { type: string }
 *
 *     User:
 *       type: object
 *       properties:
 *         id: { type: string, example: "665ff0b8e3a4b0c2d3e4f567" }
 *         name: { type: string }
 *         email: { type: string, format: email }
 *         phone: { type: string, nullable: true }
 *         role: { $ref: '#/components/schemas/Role' }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token: { type: string }
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     SignupRequest:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name: { type: string, minLength: 2 }
 *         email: { type: string, format: email }
 *         phone: { type: string }
 *         role: { $ref: '#/components/schemas/Role' }
 *         password: { type: string, minLength: 6 }
 *
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, format: email }
 *         password: { type: string }
 *
 *     RequestOtpRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email: { type: string, format: email }
 *
 *     VerifyOtpRequest:
 *       type: object
 *       required: [email, code]
 *       properties:
 *         email: { type: string, format: email }
 *         code: { type: string, minLength: 6, maxLength: 6 }
 *
 *     LeadLocation:
 *       type: object
 *       properties:
 *         lat: { type: number }
 *         lng: { type: number }
 *
 *     Lead:
 *       type: object
 *       properties:
 *         id: { type: string, example: "665ff0b8e3a4b0c2d3e4f567" }
 *         title: { type: string }
 *         clientName: { type: string }
 *         clientEmail: { type: string, format: email, nullable: true }
 *         clientPhone: { type: string, nullable: true }
 *         address: { type: string, nullable: true }
 *         location: { $ref: '#/components/schemas/LeadLocation' }
 *         requirements: { type: string, nullable: true }
 *         status: { $ref: '#/components/schemas/LeadStatus' }
 *         createdBy:
 *           type: object
 *           description: Populated user (name, email, role) in list/get responses
 *         assignedTo:
 *           type: object
 *           nullable: true
 *           description: Populated user (name, email, role) if assigned
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     CreateLeadRequest:
 *       type: object
 *       required: [title, clientName]
 *       properties:
 *         title: { type: string }
 *         clientName: { type: string }
 *         clientEmail: { type: string, format: email }
 *         clientPhone: { type: string }
 *         address: { type: string }
 *         location: { $ref: '#/components/schemas/LeadLocation' }
 *         requirements: { type: string }
 *
 *     AssignLeadRequest:
 *       type: object
 *       required: [serviceExecId]
 *       properties:
 *         serviceExecId:
 *           type: string
 *           description: Mongo ObjectId of Service Executive
 *           pattern: '^[0-9a-fA-F]{24}$'
 *
 *     LeadResponse:
 *       type: object
 *       properties:
 *         lead: { $ref: '#/components/schemas/Lead' }
 *
 *     LeadListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items: { $ref: '#/components/schemas/Lead' }
 *         total: { type: integer }
 *         page: { type: integer }
 *         pages: { type: integer }
 *
 *     QuoteItem:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         description: { type: string }
 *         qty: { type: number, minimum: 1 }
 *         unitPrice: { type: number, minimum: 0 }
 *
 *     Quotation:
 *       type: object
 *       properties:
 *         id: { type: string, example: "665ff0b8e3a4b0c2d3e4f567" }
 *         lead: { type: string }
 *         preparedBy: { type: string }
 *         items:
 *           type: array
 *           items: { $ref: '#/components/schemas/QuoteItem' }
 *         discount: { type: number }
 *         taxPct: { type: number }
 *         notes: { type: string }
 *         status: { $ref: '#/components/schemas/QuoteStatus' }
 *         approvedAt: { type: string, format: date-time, nullable: true }
 *         subtotal: { type: number }
 *         total: { type: number }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     QuoteUpsertRequest:
 *       type: object
 *       required: [items]
 *       properties:
 *         items:
 *           type: array
 *           minItems: 1
 *           items: { $ref: '#/components/schemas/QuoteItem' }
 *         discount: { type: number, minimum: 0, default: 0 }
 *         taxPct: { type: number, minimum: 0, maximum: 50, default: 18 }
 *         notes: { type: string }
 *
 *     QuoteResponse:
 *       type: object
 *       properties:
 *         quote: { $ref: '#/components/schemas/Quotation' }
 *         message: { type: string }
 *
 *     InstallStep:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         completed: { type: boolean }
 *         completedAt: { type: string, format: date-time, nullable: true }
 *
 *     Installation:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         lead: { type: string }
 *         assignedTo: { type: string }
 *         status: { $ref: '#/components/schemas/InstallStatus' }
 *         steps:
 *           type: array
 *           items: { $ref: '#/components/schemas/InstallStep' }
 *         photos:
 *           type: array
 *           items: { type: string, description: Media id }
 *         completedAt: { type: string, format: date-time, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     CreateInstallRequest:
 *       type: object
 *       required: [assignedTo]
 *       properties:
 *         assignedTo:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         steps:
 *           type: array
 *           items:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *
 *     UpdateInstallStepRequest:
 *       type: object
 *       required: [index, completed]
 *       properties:
 *         index: { type: integer, minimum: 0 }
 *         completed: { type: boolean }
 *
 *     InstallationResponse:
 *       type: object
 *       properties:
 *         installation: { $ref: '#/components/schemas/Installation' }
 *
 *     AMC:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         lead: { type: string }
 *         planMonths: { type: number }
 *         price: { type: number }
 *         status: { $ref: '#/components/schemas/AmcStatus' }
 *         startsAt: { type: string, format: date-time }
 *         endsAt: { type: string, format: date-time }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     CreateAmcRequest:
 *       type: object
 *       required: [price]
 *       properties:
 *         planMonths: { type: number, minimum: 1, default: 12 }
 *         price: { type: number, minimum: 0 }
 *         startsAt: { type: string, format: date-time }
 *
 *     AMCResponse:
 *       type: object
 *       properties:
 *         amc: { $ref: '#/components/schemas/AMC' }
 *
 *     Media:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         url: { type: string }
 *         originalName: { type: string }
 *         mimeType: { type: string }
 *         uploadedBy: { type: string }
 *         lead: { type: string }
 *         context: { type: string, enum: [INSPECTION, COMPLETION] }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     MediaResponse:
 *       type: object
 *       properties:
 *         media: { $ref: '#/components/schemas/Media' }
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file (photo evidence)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, leadId, context]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               leadId:
 *                 type: string
 *                 description: Lead ObjectId
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *               context:
 *                 type: string
 *                 enum: [INSPECTION, COMPLETION]
 *     responses:
 *       201:
 *         description: Uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.use('/auth', authRoutes);
router.use('/leads', auth, leadRoutes);
router.use('/quotes', auth, quotationRoutes);
router.use('/installations', auth, installationRoutes);
router.use('/amc', auth, amcRoutes);

router.use('/elevators', auth, elevatorRoutes);
router.use('/service', auth, serviceRoutes);
router.use('/customers', auth, customerRoutes);

// Uploads (photo evidence)
const uploadDir = process.env.UPLOAD_DIR || 'src/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});
const upload = multer({ storage });

router.post('/upload', auth, permit(ROLES.SERVICE_EXEC, ROLES.ADMIN, ROLES.MANAGER), upload.single('file'), uploadC.saveUpload);

router.use('/feedback', auth, feedbackRoutes);
router.use('/requirements', auth, customerRequirement);

export default router;