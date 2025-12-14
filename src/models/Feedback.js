import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        companyOrProject: { type: String, required: true },
        phone: { type: String, required: true },
        productType: {
            type: String,
            enum: ["Passenger Elevator", "Home Elevator", "Freight", "Escalator", "Travelator", "Other"],
            required: true,
        },
        otherProduct: { type: String },
        location: { type: String, required: true },
        feedback: { type: String, required: true },
        images: [{ type: String }], // Cloudinary URLs
        allowShowcase: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
