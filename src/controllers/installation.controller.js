import httpStatus from 'http-status';
import Installation, { INSTALL_STATUS } from '../models/Installation.js';
import Lead, { LEAD_STATUS } from '../models/Lead.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const createInstall = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId);
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found');
    const inst = await Installation.create({ lead: leadId, assignedTo: req.body.assignedTo, steps: req.body.steps || [] });
    lead.status = LEAD_STATUS.INSTALLING;
    await lead.save();
    res.status(httpStatus.CREATED).json({ installation: inst });
});

export const getInstall = catchAsync(async (req, res) => {
    const inst = await Installation.findOne({ lead: req.params.leadId }).populate('photos');
    if (!inst) throw new ApiError(httpStatus.NOT_FOUND, 'Installation not found');
    res.json({ installation: inst });
});

export const updateStep = catchAsync(async (req, res) => {
    const { index, completed } = req.body;
    const inst = await Installation.findOne({ lead: req.params.leadId });
    if (!inst) throw new ApiError(httpStatus.NOT_FOUND, 'Installation not found');
    if (!inst.steps[index]) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid step index');
    inst.steps[index].completed = completed;
    inst.steps[index].completedAt = completed ? new Date() : undefined;
    const allDone = inst.steps.length > 0 && inst.steps.every((s) => s.completed);
    if (allDone) {
        inst.status = INSTALL_STATUS.COMPLETED;
        inst.completedAt = new Date();
        const lead = await Lead.findById(inst.lead);
        lead.status = 'COMPLETED';
        await lead.save();
    } else {
        inst.status = INSTALL_STATUS.IN_PROGRESS;
    }
    await inst.save();
    res.json({ installation: inst });
});
