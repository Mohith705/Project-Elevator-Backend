import mongoose from "mongoose";

const customerRequirementSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        occupation: { type: String },
        location: { type: String },
        mobile: { type: String, required: true },

        verticalTransport: { type: String, required: true },
        purpose: { type: String, required: true },

        outputStyle: { type: String },
        doorType: { type: String },
        capacity: { type: String },
        cabinSize: { type: String },
        interiorColor: { type: String },
        interiorTheme: { type: String },
        lighting: { type: String },
        floorMaterial: { type: String },

        floors: { type: Number },
        travelHeight: { type: String },
        pitDepth: { type: String },
        overheadSpace: { type: String },
        powerSupply: { type: String },
        preferredSpeed: { type: String },

        features: [{ type: String }],
        amcRequired: { type: String },

        budget: { type: String },
        timeline: { type: String },
        additionalNotes: { type: String },

        images: [{ type: String }], // Cloudinary URLs
    },
    { timestamps: true }
);

export default mongoose.model("CustomerRequirement", customerRequirementSchema);
