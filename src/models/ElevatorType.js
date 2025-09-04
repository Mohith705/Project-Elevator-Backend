import mongoose from "mongoose";

const ElevatorTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    capacityPersons: {
        type: Number,
        required: true,
    },
    capacityWeight: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String, // store image URL
        required: false,
    },
}, { timestamps: true });

export default mongoose.model("ElevatorType", ElevatorTypeSchema);
