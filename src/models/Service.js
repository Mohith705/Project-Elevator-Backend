import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, trim: true },
        elevatorId: { type: String, trim: true },
        issue: {
            type: String,
            required: function () {
                return !this.isEmergency;
            },
        },
        images: [{ type: String }], // Issue images (Cloudinary)
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "HELP ON THE WAY"],
            default: "Pending",
        },
        isEmergency: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("ServiceRequest", serviceRequestSchema);
