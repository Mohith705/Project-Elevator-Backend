import httpStatus from 'http-status';
import Lead, { LEAD_STATUS } from '../models/Lead.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const createLead = catchAsync(async (req, res) => {
    const lead = await Lead.create({ ...req.body, createdBy: req.user.id });
    res.status(httpStatus.CREATED).json({ lead });
});

export const listLeads = catchAsync(async (req, res) => {
    const { status, q, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q)
        filter.$or = [
            { title: new RegExp(q, 'i') },
            { clientName: new RegExp(q, 'i') },
            { clientEmail: new RegExp(q, 'i') },
        ];

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
        Lead.find(filter)
            .populate('createdBy assignedTo', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Lead.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getLead = catchAsync(async (req, res) => {
    const lead = await Lead.findById(req.params.id).populate('createdBy assignedTo', 'name email role');
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found');
    res.json({ lead });
});

export const assignLead = catchAsync(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found');
    lead.assignedTo = req.body.serviceExecId;
    lead.status = LEAD_STATUS.ASSIGNED;
    await lead.save();
    res.json({ lead });
});

/** Get all leads referred by a specific phone number */
export const getLeadsByReferral = catchAsync(async (req, res) => {
    const { phoneNumber } = req.params;
    const leads = await Lead.find({ referralId: phoneNumber }).sort({ createdAt: -1 });

    if (!leads.length)
        throw new ApiError(httpStatus.NOT_FOUND, 'No leads found for this referral phone number');

    res.json({ referralId: phoneNumber, count: leads.length, leads });
});

export const getLeadsByPhone = catchAsync(async (req, res) => {
    const { phoneNumber } = req.params;
    const leads = await Lead.find({ clientPhone: phoneNumber }).sort({ createdAt: -1 });

    if (!leads.length)
        throw new ApiError(httpStatus.NOT_FOUND, 'No leads found for this phone number');

    res.json({ phoneNumber, count: leads.length, leads });
});
