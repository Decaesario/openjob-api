import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'owner').optional(),
});