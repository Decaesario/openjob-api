import Joi from 'joi';

export const createCompanySchema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().required(),
    location: Joi.string().max(255).required(),
    industry: Joi.string().max(100).allow('', null).optional(),
    website: Joi.string().max(255).allow('', null).optional(),
});

export const updateCompanySchema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional(),
    location: Joi.string().max(255).allow('', null).optional(),
    industry: Joi.string().max(100).allow('', null).optional(),
    website: Joi.string().max(255).allow('', null).optional(),
});