import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";
import Feedback from "../models/Feedback.js";
import ApiError from "../utils/ApiError.js";

export const submitFeedback = catchAsync(async (req, res) => {
    const feedback = await Feedback.create(req.body);
    res.status(httpStatus.CREATED).json({
        message: "Thank you for your feedback! Pending admin approval.",
        feedback,
    });
});

export const getAllFeedback = catchAsync(async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedbacks });
});

// Fetch only approved feedbacks (for public display)
export const getApprovedFeedback = catchAsync(async (req, res) => {
    const feedbacks = await Feedback.find({ allowShowcase: true, approved: true }).sort({ createdAt: -1 });
    res.json({ feedbacks });
});

// Update feedback (admin can modify content or approve)
export const updateFeedback = catchAsync(async (req, res) => {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (!feedback) throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");

    Object.assign(feedback, req.body);
    await feedback.save();

    res.json({ message: "Feedback updated successfully", feedback });
});

// Delete feedback
export const deleteFeedback = catchAsync(async (req, res) => {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");

    res.json({ message: "Feedback deleted successfully", deletedFeedback: feedback });
});
