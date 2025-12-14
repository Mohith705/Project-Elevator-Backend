import mongoose from "mongoose";

const ElevatorTypeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        capacityPersons: { type: Number, required: true },
        capacityWeight: { type: Number, required: true },
        price: { type: Number, required: true },
        images: [{ type: String }], // Cloudinary URLs
    },
    { timestamps: true }
);

export default mongoose.model("ElevatorType", ElevatorTypeSchema);
