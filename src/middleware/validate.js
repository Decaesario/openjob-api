import InvariantError from '../exceptions/invariant-error.js';

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join('; ');
        return next(new InvariantError(messages));
    }
    next();
};

export default validate;