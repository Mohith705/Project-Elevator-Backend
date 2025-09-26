import CustomerRequirement from "../models/CustomerRequirement.js";
import catchAsync from "../utils/catchAsync.js";

// Submit customer requirement
export const submitRequirement = catchAsync(async (req, res) => {
    const requirement = await CustomerRequirement.create(req.body);
    res.status(201).json({
        message: "Customer requirement submitted successfully",
        requirement,
    });
});

// Get all customer requirements (admin view)
export const getAllRequirements = catchAsync(async (req, res) => {
    const requirements = await CustomerRequirement.find().sort({ createdAt: -1 });
    res.json(requirements);
});
