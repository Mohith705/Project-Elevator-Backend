import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import ElevatorType from '../models/ElevatorType.js';
import CustomerPurchase from '../models/Customer.js';

const router = Router();

/**
 * @swagger  
 * tags:
 *   - name: Customers
 *     description: Customer elevator purchases & AMC calendar
 *
 * components:
 *   schemas:
 *     CustomerPurchase:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customerId:
 *           type: string
 *         elevatorTypeId:
 *           type: string
 *         purchasedAt:
 *           type: string
 *           format: date-time
 *         pricePaid:
 *           type: number
 *         warrantyEndDate:
 *           type: string
 *           format: date
 *         maintenanceCalendar:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MaintenanceTask'
 *
 *     MaintenanceTask:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         task:
 *           type: string
 *         notes:
 *           type: string
 *         createdBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - date
 *         - task
 *
 *     CreatePurchaseRequest:
 *       type: object
 *       required:
 *         - elevatorTypeId
 *         - pricePaid
 *       properties:
 *         elevatorTypeId:
 *           type: string
 *         pricePaid:
 *           type: number
 *         purchasedAt:
 *           type: string
 *           format: date
 *         warrantyEndDate:
 *           type: string
 *           format: date
 *
 *     CreateMaintenanceRequest:
 *       type: object
 *       required:
 *         - purchaseId
 *         - date
 *         - task
 *       properties:
 *         purchaseId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         task:
 *           type: string
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * /customers/{id}/purchases:
 *   get:
 *     summary: Get all purchases for a customer
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Array of purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerPurchase'
 *       404:
 *         description: Customer not found
 */
router.get('/:id/purchases', auth, async (req, res) => {
    try {
        const customerId = req.params.id;
        // Optional: validate customer existence if you have a Customer model
        // const cust = await Customer.findById(customerId);
        // if (!cust) return res.status(404).json({ message: 'Customer not found' });

        const purchases = await CustomerPurchase.find({ customerId }).populate('elevatorTypeId', 'name capacityPersons capacityWeight price image');
        res.json(purchases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}/purchases:
 *   post:
 *     summary: Create a new purchase record for the customer
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseRequest'
 *     responses:
 *       201:
 *         description: Purchase recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerPurchase'
 *       400:
 *         description: Invalid input
 */
router.post('/:id/purchases', auth, async (req, res) => {
    try {
        const customerId = req.params.id;
        const { elevatorTypeId, pricePaid, purchasedAt, warrantyEndDate } = req.body;

        // Validate elevator type exists
        const et = await ElevatorType.findById(elevatorTypeId);
        if (!et) return res.status(400).json({ message: 'Invalid elevatorTypeId' });

        // Optional: validate customer exists
        // const cust = await Customer.findById(customerId);
        // if (!cust) return res.status(404).json({ message: 'Customer not found' });

        const purchase = new CustomerPurchase({
            customerId,
            elevatorTypeId,
            pricePaid,
            purchasedAt: purchasedAt ? new Date(purchasedAt) : undefined,
            warrantyEndDate: warrantyEndDate ? new Date(warrantyEndDate) : undefined,
        });

        await purchase.save();
        const populated = await purchase.populate('elevatorTypeId', 'name capacityPersons capacityWeight price image').execPopulate?.() ?? await CustomerPurchase.findById(purchase._id).populate('elevatorTypeId', 'name capacityPersons capacityWeight price image');

        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}/maintenance-calendar:
 *   get:
 *     summary: Get aggregated maintenance calendar for a customer (optionally filter by purchaseId)
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *       - name: purchaseId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional purchaseId to filter maintenance tasks for a single purchased elevator
 *     responses:
 *       200:
 *         description: Maintenance tasks list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaintenanceTask'
 */
router.get('/:id/maintenance-calendar', auth, async (req, res) => {
    try {
        const customerId = req.params.id;
        const { purchaseId } = req.query;

        if (purchaseId) {
            // Return maintenance tasks for a single purchase (ensure it belongs to customer)
            const purchase = await CustomerPurchase.findOne({ _id: purchaseId, customerId });
            if (!purchase) return res.status(404).json({ message: 'Purchase not found for customer' });
            return res.json(purchase.maintenanceCalendar);
        }

        // Aggregate tasks across all purchases for the customer
        const purchases = await CustomerPurchase.find({ customerId }).select('maintenanceCalendar');
        const tasks = purchases.reduce((acc, p) => acc.concat(p.maintenanceCalendar.map((t) => ({ purchaseId: p._id, ...t.toObject() }))), []);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}/maintenance-calendar:
 *   post:
 *     summary: Add a maintenance task to a purchase (calendar entry)
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMaintenanceRequest'
 *     responses:
 *       201:
 *         description: Maintenance task added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceTask'
 *       400:
 *         description: Invalid input / purchase mismatch
 */
router.post('/:id/maintenance-calendar', auth, async (req, res) => {
    try {
        const customerId = req.params.id;
        const { purchaseId, date, task, notes } = req.body;

        if (!purchaseId || !date || !task) return res.status(400).json({ message: 'purchaseId, date and task required' });

        const purchase = await CustomerPurchase.findOne({ _id: purchaseId, customerId });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found for customer' });

        const newTask = { date: new Date(date), task, notes, createdBy: req.user?.id ?? undefined };
        purchase.maintenanceCalendar.push(newTask);
        await purchase.save();

        // return the last inserted maintenance task
        const added = purchase.maintenanceCalendar[purchase.maintenanceCalendar.length - 1];
        res.status(201).json(added);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}/purchases/{purchaseId}/maintenance:
 *   get:
 *     summary: Get maintenance tasks for a particular purchase
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *       - name: purchaseId
 *         in: path
 *         required: true
 *         description: Purchase ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of maintenance tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaintenanceTask'
 */
router.get('/:id/purchases/:purchaseId/maintenance', auth, async (req, res) => {
    try {
        const { id: customerId, purchaseId } = req.params;
        const purchase = await CustomerPurchase.findOne({ _id: purchaseId, customerId });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase.maintenanceCalendar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}/purchases/{purchaseId}/maintenance/{taskId}:
 *   patch:
 *     summary: Update a maintenance task for a purchase (date/task/notes)
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: purchaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               task:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated maintenance task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceTask'
 *       404:
 *         description: Purchase or task not found
 */
router.patch('/:id/purchases/:purchaseId/maintenance/:taskId', auth, async (req, res) => {
    try {
        const { id: customerId, purchaseId, taskId } = req.params;
        const { date, task, notes } = req.body;

        const purchase = await CustomerPurchase.findOne({ _id: purchaseId, customerId });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        const m = purchase.maintenanceCalendar.id(taskId);
        if (!m) return res.status(404).json({ message: 'Maintenance task not found' });

        if (date) m.date = new Date(date);
        if (task) m.task = task;
        if (notes !== undefined) m.notes = notes;

        await purchase.save();
        res.json(m);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}/purchases/{purchaseId}/maintenance/{taskId}:
 *   delete:
 *     summary: Delete a maintenance task
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: purchaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Purchase or task not found
 */
router.delete('/:id/purchases/:purchaseId/maintenance/:taskId', auth, async (req, res) => {
    try {
        const { id: customerId, purchaseId, taskId } = req.params;
        const purchase = await CustomerPurchase.findOne({ _id: purchaseId, customerId });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        const m = purchase.maintenanceCalendar.id(taskId);
        if (!m) return res.status(404).json({ message: 'Maintenance task not found' });

        m.remove();
        await purchase.save();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
