import Joi from 'joi';

export const createLead = {
    body: Joi.object({
        title: Joi.string().required(),
        clientName: Joi.string().required(),
        clientEmail: Joi.string().email().optional(),
        clientPhone: Joi.string().optional(),
        address: Joi.string().optional(),
        location: Joi.object({ lat: Joi.number(), lng: Joi.number() }).optional(),
        requirements: Joi.string().allow('').optional(),
    }),
};

export const assignLead = {
    body: Joi.object({ serviceExecId: Joi.string().hex().length(24).required() }),
};
