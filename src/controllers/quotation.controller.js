import httpStatus from 'http-status';
import Quotation, { QUOTE_STATUS } from '../models/Quotation.js';
import Lead, { LEAD_STATUS } from '../models/Lead.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const upsertQuote = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId);
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found');
    let quote = await Quotation.findOne({ lead: leadId });
    if (!quote) {
        quote = await Quotation.create({ lead: leadId, preparedBy: req.user.id, ...req.body });
    } else {
        Object.assign(quote, req.body);
        await quote.save();
    }
    lead.status = LEAD_STATUS.QUOTED;
    await lead.save();
    res.status(httpStatus.OK).json({ quote });
});

export const sendQuote = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const quote = await Quotation.findOne({ lead: leadId });
    if (!quote) throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
    quote.status = QUOTE_STATUS.SENT;
    await quote.save();
    res.json({ quote, message: 'Quote sent to client (demo)' });
});

export const approveQuote = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const quote = await Quotation.findOne({ lead: leadId });
    if (!quote) throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
    quote.status = QUOTE_STATUS.APPROVED;
    quote.approvedAt = new Date();
    await quote.save();
    const lead = await Lead.findById(leadId);
    lead.status = LEAD_STATUS.APPROVED;
    await lead.save();
    res.json({ quote, message: 'Approved. Proceed to installation.' });
});

export const rejectQuote = catchAsync(async (req, res) => {
    const { leadId } = req.params;
    const quote = await Quotation.findOne({ lead: leadId });
    if (!quote) throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
    quote.status = QUOTE_STATUS.REJECTED;
    await quote.save();
    const lead = await Lead.findById(leadId);
    lead.status = LEAD_STATUS.REJECTED;
    await lead.save();
    res.json({ quote });
});

export const getAllQuotesByLead = catchAsync(async (req, res) => {
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId);
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found');

    const quotes = await Quotation.find({ lead: leadId }).sort({ createdAt: -1 });

    res.status(httpStatus.OK).json({ leadId, quotes });
});