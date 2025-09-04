import Joi from 'joi';

export const signup = {
    body: Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional(),
        role: Joi.string().valid('ADMIN', 'MANAGER', 'MARKETING_EXEC', 'SERVICE_EXEC').optional(),
        password: Joi.string().min(6).required(),
    }),
};

export const login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

export const requestOtp = {
    body: Joi.object({ email: Joi.string().email().required() }),
};

export const verifyOtp = {
    body: Joi.object({ email: Joi.string().email().required(), code: Joi.string().length(6).required() }),
};
