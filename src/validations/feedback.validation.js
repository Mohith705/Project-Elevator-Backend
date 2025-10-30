import Joi from "joi";

export const submitFeedback = {
    body: Joi.object({
        name: Joi.string().required(),
        companyOrProject: Joi.string().required(),
        phone: Joi.string().required(),
        productType: Joi.string()
            .valid("Passenger Elevator", "Home Elevator", "Freight", "Escalator", "Travelator", "Other")
            .required(),
        otherProduct: Joi.string().optional(),
        location: Joi.string().required(),
        feedback: Joi.string().min(15).required(),
        allowShowcase: Joi.boolean().required(),
    }),
};

export const updateFeedback = {
    body: Joi.object({
        name: Joi.string().optional(),
        companyOrProject: Joi.string().optional(),
        phone: Joi.string().optional(),
        productType: Joi.string().valid(
            "Passenger Elevator",
            "Home Elevator",
            "Freight",
            "Escalator",
            "Travelator",
            "Other"
        ).optional(),
        otherProduct: Joi.string().optional(),
        location: Joi.string().optional(),
        feedback: Joi.string().optional(),
        allowShowcase: Joi.boolean().optional(),
        approved: Joi.boolean().optional(),
    }),
};
