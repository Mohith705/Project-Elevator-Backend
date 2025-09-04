import mongoose from 'mongoose';

export const INSTALL_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
};

const stepSchema = new mongoose.Schema(
    {
        name: String,
        completed: { type: Boolean, default: false },
        completedAt: Date,
    },
    { _id: false }
);

const installationSchema = new mongoose.Schema(
    {
        lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, unique: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: Object.values(INSTALL_STATUS), default: INSTALL_STATUS.PENDING, index: true },
        steps: { type: [stepSchema], default: [] },
        photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
        completedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model('Installation', installationSchema);
