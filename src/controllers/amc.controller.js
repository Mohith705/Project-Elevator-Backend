import httpStatus from 'http-status';
import AMC, { AMC_STATUS } from '../models/AMC.js';
import Lead from '../models/Lead.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const createAmc = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId);
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found');
    const startsAt = req.body.startsAt ? new Date(req.body.startsAt) : new Date();
    const endsAt = new Date(startsAt);
    endsAt.setMonth(endsAt.getMonth() + (req.body.planMonths || 12));
    const amc = await AMC.create({ lead: leadId, ...req.body, startsAt, endsAt, status: AMC_STATUS.ACTIVE });
    res.status(httpStatus.CREATED).json({ amc });
});

export const getAmc = catchAsync(async (req, res) => {
    const amc = await AMC.findOne({ lead: req.params.leadId });
    if (!amc) throw new ApiError(httpStatus.NOT_FOUND, 'AMC not found');
    res.json({ amc });
});

export const updateAmc = catchAsync(async (req, res) => {
    const { leadId } = req.params;

    const amc = await AMC.findOne({ lead: leadId });
    if (!amc) throw new ApiError(httpStatus.NOT_FOUND, 'AMC not found');

    const updateData = req.body;
    if (updateData.startsAt) {
        const startsAt = new Date(updateData.startsAt);
        const endsAt = new Date(startsAt);
        endsAt.setMonth(endsAt.getMonth() + (updateData.planMonths || amc.planMonths || 12));
        updateData.startsAt = startsAt;
        updateData.endsAt = endsAt;
    }

    Object.assign(amc, updateData);
    await amc.save();

    res.json({ message: 'AMC updated successfully', amc });
});

export const deleteAmc = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const amc = await AMC.findOneAndDelete({ lead: leadId });

    if (!amc) throw new ApiError(httpStatus.NOT_FOUND, 'AMC not found');
    res.json({ message: 'AMC deleted successfully', deletedAmc: amc });
});
