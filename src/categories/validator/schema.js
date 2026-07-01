import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional(),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional(),
});