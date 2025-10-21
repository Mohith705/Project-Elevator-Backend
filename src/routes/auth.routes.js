import { Router } from 'express';
import validate from '../middlewares/validate.js';
import * as authV from '../validations/auth.validation.js';
import * as authC from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user with phone number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bayya Mohith
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, MARKETING_EXEC, SERVICE_EXEC]
 *                 example: MARKETING_EXEC
 *               password:
 *                 type: string
 *                 example: "secret123"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 */
router.post('/signup', validate(authV.signup), authC.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with phone + password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *               password:
 *                 type: string
 *                 example: "secret123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(authV.login), authC.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, authC.me);

/**
 * @swagger
 * /auth/otp/request:
 *   post:
 *     summary: Request OTP via SMS
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP sent via SMS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/otp/request', validate(authV.requestOtp), authC.requestOtp);

/**
 * @swagger
 * /auth/otp/verify:
 *   post:
 *     summary: Verify OTP via SMS
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       400:
 *         description: OTP not requested
 *       401:
 *         description: Invalid or expired OTP
 */
router.post('/otp/verify', validate(authV.verifyOtp), authC.verifyOtp);

/**
 * @swagger
 * /auth/getserviceexecs:
 *   get:
 *     summary: Get list of all service executives
 *     description: Returns all users with the role `SERVICE_EXEC`.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of service executives
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serviceExecutives:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *       401:
 *         description: Unauthorized access
 */
router.get('/getserviceexecs', auth, authC.service_executive_list);


/**
 * @swagger
 * /auth/getusers:
 *   get:
 *     summary: Get list of all users
 *     description: Returns all registered users with basic details.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: string
 *       401:
 *         description: Unauthorized access
 */
router.get('/getusers', auth, authC.users_list);


/**
 * @swagger
 * /auth/getcustomers:
 *   get:
 *     summary: Get list of all customers
 *     description: Returns all users with the role `CUSTOMER`.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *       401:
 *         description: Unauthorized access
 */
router.get('/getcustomers', auth, authC.customer_list);


export default router;
