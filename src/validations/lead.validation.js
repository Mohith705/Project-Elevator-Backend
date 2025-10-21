import Joi from 'joi';
import { LEAD_STATUS } from '../models/Lead.js';

export const createLead = {
    body: Joi.object({
        title: Joi.string().required(),
        clientName: Joi.string().required(),
        clientEmail: Joi.string().email().optional().allow(''),
        clientPhone: Joi.string().optional().allow(''),
        address: Joi.string().optional().allow(''),
        location: Joi.object({
            lat: Joi.number(),
            lng: Joi.number(),
        }).optional(),
        requirements: Joi.string().optional().allow(''),
        items: Joi.array()
            .items(
                Joi.object({
                    elevatorId: Joi.string().optional(),
                    name: Joi.string().optional(),
                })
            )
            .optional(),
        referralId: Joi.string().optional().allow(''),
    }),
};

export const getReferralLeads = {
    params: Joi.object({
        phoneNumber: Joi.string().required(),
    }),
};


export const assignLead = {
    body: Joi.object({ serviceExecId: Joi.string().hex().length(24).required() }),
};
