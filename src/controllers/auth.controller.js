import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

const signToken = (user) => {
    return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const signup = catchAsync(async (req, res) => {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(httpStatus.CREATED).json({ user: { id: user.id, name: user.name, role: user.role }, token });
});

// export const login = catchAsync(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
//     const ok = await user.comparePassword(password);
//     if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
//     res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
// });

export const login = catchAsync(async (req, res) => {
    console.log("Incoming body:", req.body);   // 👈 debug
    const { phone, password } = req.body;
    console.log("Phone:", phone, "Password:", password);

    const user = await User.findOne({ phone }).select('+password');
    console.log("Found user:", user);

    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

    const ok = await user.comparePassword(password);
    console.log("Password check:", ok);

    if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

    res.json({
        token: signToken(user),
        user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role
        }
    });
});


export const me = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ user });
});

export const service_executive_list = catchAsync(async(req, res) => {
    const serviceExecutives = await User.find({role: 'SERVICE_EXEC'}).select('id name phone');
    res.json({ serviceExecutives });
})

export const users_list = catchAsync(async(req, res) => {
    const users = await User.find().select('id name phone role');
    res.json({ users });
});

export const customer_list = catchAsync(async(req, res) => {
    const customers = await User.find({role: 'CUSTOMER'}).select('id name phone');
    res.json({ customers });
});

// export const requestOtp = catchAsync(async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email }).select('+otpCode +otpExpiresAt');
//     if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     const code = crypto.randomInt(100000, 999999).toString();
//     const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
//     user.otpCode = code;
//     user.otpExpiresAt = new Date(Date.now() + minutes * 60 * 1000);
//     await user.save({ validateBeforeSave: false });
//     // In real life, send via SMS/Email. Here we return for demo or log it.
//     res.json({ message: 'OTP generated', code });
// });

// export const verifyOtp = catchAsync(async (req, res) => {
//     const { email, code } = req.body;
//     const user = await User.findOne({ email }).select('+otpCode +otpExpiresAt');
//     if (!user || !user.otpCode || !user.otpExpiresAt) throw new ApiError(httpStatus.BAD_REQUEST, 'OTP not requested');
//     if (user.otpCode !== code || user.otpExpiresAt < new Date()) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired OTP');
//     user.otpCode = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save({ validateBeforeSave: false });
//     res.json({ token: jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' }) });
// });

export const requestOtp = catchAsync(async (req, res) => {
    const { phone } = req.body;
    let user = await User.findOne({ phone }).select('+otpCode +otpExpiresAt');

    // Auto-create user if not exists
    if (!user) {
        user = await User.create({ phone });
    }

    // Generate OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);

    user.otpCode = code;
    user.otpExpiresAt = new Date(Date.now() + minutes * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Send via Twilio SMS
    await client.messages.create({
        body: `Your Elevator App OTP is ${code}. It will expire in ${minutes} minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER, // must be Twilio purchased/verified number
        to: phone.startsWith('+') ? phone : `+91${phone}`, // ensure with country code
    });

    res.json({ message: 'OTP sent successfully via SMS' });
});

/**
 * Verify OTP and issue JWT
 */
export const verifyOtp = catchAsync(async (req, res) => {
    const { phone, code } = req.body;
    const user = await User.findOne({ phone }).select('+otpCode +otpExpiresAt');

    if (!user || !user.otpCode || !user.otpExpiresAt) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'OTP not requested');
    }

    if (user.otpCode !== code || user.otpExpiresAt < new Date()) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired OTP');
    }

    // Reset OTP fields after successful login
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate JWT
    const token = jwt.sign(
        { sub: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({ message: 'OTP verified successfully', token });
});