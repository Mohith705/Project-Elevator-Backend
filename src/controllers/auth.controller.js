import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

const signToken = (user) => {
    return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const signup = catchAsync(async (req, res) => {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(httpStatus.CREATED).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
});

export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    const ok = await user.comparePassword(password);
    if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export const me = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ user });
});

export const requestOtp = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+otpCode +otpExpiresAt');
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    const code = crypto.randomInt(100000, 999999).toString();
    const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    user.otpCode = code;
    user.otpExpiresAt = new Date(Date.now() + minutes * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    // In real life, send via SMS/Email. Here we return for demo or log it.
    res.json({ message: 'OTP generated', code });
});

export const verifyOtp = catchAsync(async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email }).select('+otpCode +otpExpiresAt');
    if (!user || !user.otpCode || !user.otpExpiresAt) throw new ApiError(httpStatus.BAD_REQUEST, 'OTP not requested');
    if (user.otpCode !== code || user.otpExpiresAt < new Date()) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired OTP');
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    res.json({ token: jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' }) });
});
