import Joi from 'joi';

export const createAmc = {
    body: Joi.object({ planMonths: Joi.number().min(1).default(12), price: Joi.number().min(0).required(), startsAt: Joi.date().optional() }),
};
