import userRepository from '../repositories/user-repositories.js';
import sendResponse from '../../utils/response.js';

class UserController {
    async registerUser(req, res, next) {
        try {
            const user = await userRepository.addUser(req.body);
            return sendResponse(res, {
                code: 201,
                status: 'success',
                message: 'User berhasil didaftarkan',
                data: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const { data, source } = await userRepository.getUserById(req.params.id);
            res.setHeader('X-Data-Source', source);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'User berhasil didapatkan',
                data: { id: data.id, name: data.name, email: data.email, role: data.role },
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();