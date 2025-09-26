import Joi from 'joi';

export const createOrUpdateQuote = {
    body: Joi.object({
        items: Joi.array()
            .items(
                Joi.object({ name: Joi.string().required(), description: Joi.string().allow(''), qty: Joi.number().min(1).required(), unitPrice: Joi.number().min(0).required() })
            )
            .min(1)
            .required(),
        discount: Joi.number().min(0).default(0),
        taxPct: Joi.number().min(0).max(50).default(18),
        notes: Joi.string().allow(''),
    }),
};

export const getQuotesByLead = {
    params: Joi.object({
        leadId: Joi.string().length(24).hex().required(),
    }),
};