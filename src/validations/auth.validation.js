// import Joi from 'joi';

// export const signup = {
//     body: Joi.object({
//         name: Joi.string().min(2).required(),
//         email: Joi.string().email().required(),
//         phone: Joi.string().optional(),
//         role: Joi.string().valid('ADMIN', 'MANAGER', 'MARKETING_EXEC', 'SERVICE_EXEC').optional(),
//         password: Joi.string().min(6).required(),
//     }),
// };

// export const login = {
//     body: Joi.object({
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//     }),
// };

// export const requestOtp = {
//     body: Joi.object({ email: Joi.string().email().required() }),
// };

// export const verifyOtp = {
//     body: Joi.object({ email: Joi.string().email().required(), code: Joi.string().length(6).required() }),
// };


import Joi from 'joi';

export const signup = {
    body: Joi.object({
        name: Joi.string().min(2).required(),
        phone: Joi.string()
            .pattern(/^\+?[1-9]\d{9,14}$/) // E.164 format like +919876543210
            .required(),
        role: Joi.string()
            .valid('ADMIN', 'MANAGER', 'MARKETING_EXEC', 'SERVICE_EXEC', 'CUSTOMER')
            .optional(),
        password: Joi.string().min(6).optional(), // only if you still want fallback password
    }),
};

// 🔹 No more email/password login → using OTP
export const login = {
    body: Joi.object({
        phone: Joi.string()
            .pattern(/^\+?[1-9]\d{9,14}$/)
            .required(),
        password: Joi.string().min(6).required()
    }),
};

export const requestOtp = {
    body: Joi.object({
        phone: Joi.string()
            .pattern(/^\+?[1-9]\d{9,14}$/)
            .required(),
    }),
};

export const verifyOtp = {
    body: Joi.object({
        phone: Joi.string()
            .pattern(/^\+?[1-9]\d{9,14}$/)
            .required(),
        code: Joi.string()
            .length(6)
            .pattern(/^\d+$/)
            .required(),
    }),
};
