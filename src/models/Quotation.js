import mongoose from 'mongoose';

export const QUOTE_STATUS = {
    DRAFT: 'DRAFT',
    SENT: 'SENT',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    REVISION_REQUESTED: 'REVISION_REQUESTED',
};

const itemSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        qty: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
    },
    { _id: false }
);

const quotationSchema = new mongoose.Schema(
    {
        lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
        preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [itemSchema],
        discount: { type: Number, default: 0 },
        taxPct: { type: Number, default: 18 },
        notes: String,
        status: { type: String, enum: Object.values(QUOTE_STATUS), default: QUOTE_STATUS.DRAFT, index: true },
        approvedAt: Date,
    },
    { timestamps: true }
);

quotationSchema.virtual('subtotal').get(function () {
    return this.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
});

quotationSchema.virtual('total').get(function () {
    const subtotal = this.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
    const discounted = Math.max(subtotal - this.discount, 0);
    const tax = (discounted * this.taxPct) / 100;
    return Math.round((discounted + tax) * 100) / 100;
});

quotationSchema.set('toJSON', { virtuals: true });
quotationSchema.set('toObject', { virtuals: true });

export default mongoose.model('Quotation', quotationSchema);
