import mongoose from "mongoose";

const customerRequirementSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        occupation: { type: String },
        location: { type: String },
        mobile: { type: String, required: true },

        // Section 1 - Your Need
        verticalTransport: { type: String, required: true }, // Passenger, Home Elevator, etc.
        purpose: { type: String, required: true }, // Residential, Commercial, etc.

        // Section 2 - Appearance
        outputStyle: { type: String },
        doorType: { type: String },
        capacity: { type: String },
        cabinSize: { type: String },
        interiorColor: { type: String },
        interiorTheme: { type: String },
        lighting: { type: String },
        floorMaterial: { type: String },

        // Section 3 - Technical
        floors: { type: Number },
        travelHeight: { type: String },
        pitDepth: { type: String },
        overheadSpace: { type: String },
        powerSupply: { type: String },
        preferredSpeed: { type: String },

        // Section 4 - Reliability
        features: [{ type: String }], // Array of selected safety/reliability features
        amcRequired: { type: String }, // Yes, No, Not Sure

        // Section 5 - Additional Inputs
        budget: { type: String },
        timeline: { type: String },
        additionalNotes: { type: String }
    },
    { timestamps: true }
);

const CustomerRequirement = mongoose.model("CustomerRequirement", customerRequirementSchema);

export default CustomerRequirement;