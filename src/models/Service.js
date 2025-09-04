import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        elevatorId: {
            type: String,
            required: false,
            trim: true,
        },
        issue: {
            type: String,
            required: function () {
                return !this.isEmergency; // Issue is required only for normal service requests
            },
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'HELP ON THE WAY'],
            default: 'Pending',
        },
        isEmergency: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
