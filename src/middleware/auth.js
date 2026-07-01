import TokenManager from '../security/token-manager.js';
import AuthenticationError from '../exceptions/authentication-error.js';

const auth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new AuthenticationError('Missing authentication token');
        }

        const [scheme, token] = authorization.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new AuthenticationError('Invalid token format');
        }

        const decoded = TokenManager.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
};

export default auth;