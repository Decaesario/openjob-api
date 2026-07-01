import userRepository from '../../users/repositories/user-repositories.js';
import applicationRepository from '../../applications/repositories/application-repositories.js';
import bookmarkRepository from '../../bookmarks/repositories/bookmark-repositories.js';
import sendResponse from '../../utils/response.js';

class ProfileController {
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await userRepository.getUserById(userId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Profile berhasil didapatkan',
                data: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        } catch (err) {
            next(err);
        }
    }

    async getProfileApplications(req, res, next) {
        try {
            const userId = req.user.id;
            const applications = await applicationRepository.getApplicationsByUser(userId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Profile applications berhasil didapatkan',
                data: { applications },
            });
        } catch (err) {
            next(err);
        }
    }

    async getProfileBookmarks(req, res, next) {
        try {
            const userId = req.user.id;
            const bookmarks = await bookmarkRepository.getBookmarksByUser(userId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Profile bookmarks berhasil didapatkan',
                data: { bookmarks },
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new ProfileController();