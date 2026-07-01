import Joi from 'joi';

export const createJobSchema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    requirements: Joi.string().allow('', null).optional(),
    salary_min: Joi.number().integer().min(0).allow(null).optional(),
    salary_max: Joi.number().integer().min(0).allow(null).optional(),
    is_salary_visible: Joi.boolean().optional(),
    job_type: Joi.string().max(50).allow('', null).optional(),
    experience_level: Joi.string().max(50).allow('', null).optional(),
    location_type: Joi.string().max(50).allow('', null).optional(),
    location_city: Joi.string().max(255).allow('', null).optional(),
    status: Joi.string().valid('open', 'close').optional(),
    company_id: Joi.string().required(),
    category_id: Joi.string().required(),
});

export const updateJobSchema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    requirements: Joi.string().allow('', null).optional(),
    salary_min: Joi.number().integer().min(0).allow(null).optional(),
    salary_max: Joi.number().integer().min(0).allow(null).optional(),
    is_salary_visible: Joi.boolean().optional(),
    job_type: Joi.string().max(50).allow('', null).optional(),
    experience_level: Joi.string().max(50).allow('', null).optional(),
    location_type: Joi.string().max(50).allow('', null).optional(),
    location_city: Joi.string().max(255).allow('', null).optional(),
    status: Joi.string().valid('open', 'close').optional(),
    company_id: Joi.string().required(),
    category_id: Joi.string().required(),
});