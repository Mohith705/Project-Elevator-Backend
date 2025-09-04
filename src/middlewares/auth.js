import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { ROLES, ROLE_HIERARCHY } from '../config/roles.js';

export const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
        if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Missing token');

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub);
        if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
        req.user = user;
        next();
    } catch (e) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
    }
};

export const permit = (...allowed) => (req, res, next) => {
    if (!req.user) return next(new ApiError(httpStatus.UNAUTHORIZED, 'Auth required'));
    const role = req.user.role;
    const can = new Set(allowed.flatMap((r) => ROLE_HIERARCHY[r] || [r]));
    if (!can.has(role)) return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient role'));
    next();
};

export const optionalAuth = async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return next();
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub);
        if (user) req.user = user;
    } catch { }
    next();
};
