import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Maintenance subdocument stored per purchase.
 * Each purchase (an elevator bought by a customer) has its own maintenanceCalendar array.
 */
const MaintenanceSchema = new Schema(
    {
        date: { type: Date, required: true },
        task: { type: String, required: true, trim: true },
        notes: { type: String, trim: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // optional: who created the task
    },
    { timestamps: true }
);

const CustomerPurchaseSchema = new Schema(
    {
        customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
        elevatorTypeId: { type: Schema.Types.ObjectId, ref: 'ElevatorType', required: true },
        purchasedAt: { type: Date, default: Date.now },
        pricePaid: { type: Number, required: true },
        warrantyEndDate: { type: Date },
        // Embedded maintenance calendar for this purchased elevator
        maintenanceCalendar: { type: [MaintenanceSchema], default: [] },
    },
    { timestamps: true }
);

// add a small helper method (optional) to append a maintenance item
CustomerPurchaseSchema.methods.addMaintenance = function (item) {
    this.maintenanceCalendar.push(item);
    return this.save();
};

export default model('CustomerPurchase', CustomerPurchaseSchema);
