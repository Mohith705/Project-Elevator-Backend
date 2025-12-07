import Joi from 'joi';
import libphonenumber from 'google-libphonenumber';

const { PhoneNumberUtil } = libphonenumber;
const phoneUtil = PhoneNumberUtil.getInstance();

const validateIndianPhone = (value, helpers) => {
    try {
        const parsed = phoneUtil.parse(value, 'IN');

        if (!phoneUtil.isValidNumberForRegion(parsed, 'IN')) {
            return helpers.error('any.invalid');
        }

        return value;
    } catch (err) {
        return helpers.error('any.invalid');
    }
};

export const signup = {
    body: Joi.object({
        name: Joi.string().min(2).required(),
        phone: Joi.string()
            .custom(validateIndianPhone, 'Indian phone validation')
            .required(),
        role: Joi.string()
            .valid('ADMIN', 'MANAGER', 'MARKETING_EXEC', 'SERVICE_EXEC', 'CUSTOMER')
            .optional(),
        password: Joi.string().min(6).optional(),
    }),
};

export const login = {
    body: Joi.object({
        phone: Joi.string()
            .custom(validateIndianPhone, 'Indian phone validation')
            .required(),
        password: Joi.string().min(6).required(),
    }),
};

export const requestOtp = {
    body: Joi.object({
        phone: Joi.string()
            .custom(validateIndianPhone, 'Indian phone validation')
            .required(),
    }),
};

export const verifyOtp = {
    body: Joi.object({
        phone: Joi.string()
            .custom(validateIndianPhone, 'Indian phone validation')
            .required(),
        code: Joi.string()
            .length(6)
            .pattern(/^\d+$/)
            .required(),
    }),
};
