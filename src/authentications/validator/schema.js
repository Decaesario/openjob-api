import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

export const deleteAuthSchema = Joi.object({
    refreshToken: Joi.string().required(),
});