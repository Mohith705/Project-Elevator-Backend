import mongoose from 'mongoose';

export const AMC_STATUS = {
    OFFERED: 'OFFERED',
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    DECLINED: 'DECLINED',
};

const amcSchema = new mongoose.Schema(
    {
        lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, unique: true },
        planMonths: { type: Number, default: 12 },
        price: { type: Number, required: true },
        status: { type: String, enum: Object.values(AMC_STATUS), default: AMC_STATUS.OFFERED, index: true },
        startsAt: Date,
        endsAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model('AMC', amcSchema);
