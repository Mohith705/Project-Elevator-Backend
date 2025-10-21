import Joi from 'joi';

export const createAmc = {
    body: Joi.object({ planMonths: Joi.number().min(1).default(12), price: Joi.number().min(0).required(), startsAt: Joi.date().optional() }),
};

export const updateAmc = {
    body: Joi.object({
        planMonths: Joi.number().min(1).optional(),
        price: Joi.number().min(0).optional(),
        status: Joi.string().valid('OFFERED', 'ACTIVE', 'EXPIRED', 'DECLINED').optional(),
        startsAt: Joi.date().optional(),
    }),
};

