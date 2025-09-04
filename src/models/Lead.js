import mongoose from 'mongoose';

export const LEAD_STATUS = {
    NEW: 'NEW',
    ASSIGNED: 'ASSIGNED',
    INSPECTION: 'INSPECTION',
    QUOTED: 'QUOTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    INSTALLING: 'INSTALLING',
    COMPLETED: 'COMPLETED',
};

const leadSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        clientName: { type: String, required: true },
        clientEmail: { type: String },
        clientPhone: { type: String },
        address: { type: String },
        location: {
            lat: Number,
            lng: Number,
        },
        requirements: { type: String },
        status: { type: String, enum: Object.values(LEAD_STATUS), default: LEAD_STATUS.NEW, index: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
