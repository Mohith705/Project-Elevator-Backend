import catchAsync from '../utils/catchAsync.js';
import httpStatus from "http-status";
import Feedback from '../models/Feedback.js';

export const submitFeedback = catchAsync(async (req, res) => {
    const feedback = await Feedback.create(req.body);
    res.status(httpStatus.CREATED).json({
        message: "Thank you for feedback!",
        feedback
    });
});

export const getAllFeedback = catchAsync(async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedbacks });
});