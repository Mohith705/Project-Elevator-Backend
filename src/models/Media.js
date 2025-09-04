import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        originalName: String,
        mimeType: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
        context: { type: String, enum: ['INSPECTION', 'COMPLETION'] },
    },
    { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
