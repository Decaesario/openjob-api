import Joi from 'joi';

export const uploadDocumentSchema = Joi.object({
  name: Joi.string().max(255).optional(),
});