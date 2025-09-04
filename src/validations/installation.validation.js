import Joi from 'joi';

export const createInstall = {
    body: Joi.object({ assignedTo: Joi.string().hex().length(24).required(), steps: Joi.array().items(Joi.object({ name: Joi.string().required() })).default([]) }),
};

export const updateStep = {
    body: Joi.object({ index: Joi.number().min(0).required(), completed: Joi.boolean().required() }),
};
