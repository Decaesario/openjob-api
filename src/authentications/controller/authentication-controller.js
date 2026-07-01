import authenticationRepository from '../repositories/authentication-repositories.js';
import userRepository from '../../users/repositories/user-repositories.js';
import TokenManager from '../../security/token-manager.js';
import sendResponse from '../../utils/response.js';

class AuthenticationController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await userRepository.verifyUserCredentials({ email, password });

            const accessToken = TokenManager.generateAccessToken({ id: user.id, email: user.email, role: user.role });
            const refreshToken = TokenManager.generateRefreshToken({ id: user.id, email: user.email, role: user.role });

            await authenticationRepository.addRefreshToken(refreshToken);

            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Login berhasil',
                data: { accessToken, refreshToken },
            });
        } catch (err) {
            next(err);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await authenticationRepository.verifyRefreshToken(refreshToken);
            const decoded = TokenManager.verifyRefreshToken(refreshToken);

            const accessToken = TokenManager.generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });

            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Access token berhasil diperbarui',
                data: { accessToken },
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await authenticationRepository.deleteRefreshToken(refreshToken);

            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Logout berhasil',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthenticationController();