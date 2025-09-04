import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/roles.js';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.MARKETING_EXEC,
            index: true,
        },
        password: { type: String, required: true, select: false },
        otpCode: { type: String, select: false },
        otpExpiresAt: { type: Date, select: false },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
