import Joi from 'joi';

export const createApplicationSchema = Joi.object({
    job_id: Joi.string().required(),
    user_id: Joi.string().optional(),
    cover_letter: Joi.string().allow('', null).optional(),
    status: Joi.string().optional(),
});

export const updateApplicationSchema = Joi.object({
    status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required(),
});