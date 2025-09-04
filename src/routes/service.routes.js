import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import ServiceRequest from '../models/Service.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Elevator service & emergency APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceRequest:
 *       type: object
 *       required:
 *         - userId
 *         - issue
 *       properties:
 *         userId:
 *           type: string
 *         elevatorId:
 *           type: string
 *         issue:
 *           type: string
 *         status:
 *           type: string
 *           default: 'Pending'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     EmergencyRequest:
 *       type: object
 *       required:
 *         - userId
 *         - elevatorId
 *       properties:
 *         userId:
 *           type: string
 *         elevatorId:
 *           type: string
 *         status:
 *           type: string
 *           default: 'HELP ON THE WAY'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /service/request:
 *   post:
 *     summary: Create a service request for elevator repair/maintenance
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *     responses:
 *       201:
 *         description: Service request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequest'
 */
router.post('/request', auth, async (req, res) => {
    try {
        const request = new ServiceRequest(req.body);
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /service/requests/{userId}:
 *   get:
 *     summary: Get all service requests by a user
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of service requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceRequest'
 */
router.get('/requests/:userId', auth, async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ userId: req.params.userId });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /service/request/status/{requestId}:
 *   get:
 *     summary: Track live status of a normal service request
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the service request
 *     responses:
 *       200:
 *         description: Current status of the service request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requestId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: In Progress
 *       404:
 *         description: Service request not found
 */
router.get('/request/status/:requestId', auth, async (req, res) => {
    const { requestId } = req.params;

    try {
        const serviceRequest = await ServiceRequest.findById(requestId);
        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        res.json({ requestId: serviceRequest._id, status: serviceRequest.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * @swagger
 * /service/request/status/{requestId}:
 *   patch:
 *     summary: Update the status of a service request
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the service request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed, HELP ON THE WAY]
 *                 example: In Progress
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requestId:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Request not found
 */
router.patch('/request/status/:requestId', auth, async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    try {
        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        request.status = status;
        await request.save();

        res.json({ requestId: request._id, status: request.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * @swagger
 * /service/emergency:
 *   post:
 *     summary: Trigger an emergency SOS request when stuck in lift
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmergencyRequest'
 *     responses:
 *       201:
 *         description: Emergency SOS triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyRequest'
 */
router.post('/emergency', auth, async (req, res) => {
    try {
        const emergency = new ServiceRequest({
            ...req.body,
            status: 'HELP ON THE WAY',
            isEmergency: true,
        });
        await emergency.save();
        res.status(201).json(emergency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /service/emergency/status/{requestId}:
 *   get:
 *     summary: Track live status of emergency request
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency request status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requestId:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.get('/emergency/status/:requestId', auth, async (req, res) => {
    try {
        const emergency = await ServiceRequest.findById(req.params.requestId);
        if (!emergency || !emergency.isEmergency) {
            return res.status(404).json({ error: 'Emergency request not found' });
        }
        res.json({ requestId: emergency._id, status: emergency.status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /service/emergency/status/update/{requestId}:
 *   patch:
 *     summary: Update the status of an emergency request
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the emergency request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, HELP ON THE WAY, Resolved]
 *                 example: HELP ON THE WAY
 *     responses:
 *       200:
 *         description: Emergency request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requestId:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Emergency request not found
 */
router.patch('/emergency/status/update/:requestId', auth, async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    try {
        const emergency = await EmergencyRequest.findById(requestId);
        if (!emergency) {
            return res.status(404).json({ message: 'Emergency request not found' });
        }

        emergency.status = status;
        await emergency.save();

        res.json({ requestId: emergency._id, status: emergency.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;