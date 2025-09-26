import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    companyOrProject: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        enum: ["Passenger Elevator", "Home Elevator", "Freight", "Escalator", "Travelator", "Other"],
        required: true
    },
    otherProduct: {
        type: String 
    },
    location: {
        type: String, 
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    allowShowcase: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;