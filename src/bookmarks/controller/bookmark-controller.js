import bookmarkRepository from '../repositories/bookmark-repositories.js';
import sendResponse from '../../utils/response.js';

class BookmarkController {
    async addBookmark(req, res, next) {
        try {
            const userId = req.user.id;
            const { jobId } = req.params;
            const bookmark = await bookmarkRepository.addBookmark({ jobId, userId });
            return sendResponse(res, {
                code: 201,
                status: 'success',
                message: 'Bookmark berhasil ditambahkan',
                data: { id: bookmark.id, job_id: bookmark.job_id, user_id: bookmark.user_id },
            });
        } catch (err) {
            next(err);
        }
    }

    async getBookmarkById(req, res, next) {
        try {
            const bookmark = await bookmarkRepository.getBookmarkById(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Bookmark berhasil didapatkan',
                data: { id: bookmark.id, job_id: bookmark.job_id, user_id: bookmark.user_id },
            });
        } catch (err) {
            next(err);
        }
    }

    async getBookmarksByUser(req, res, next) {
        try {
            const userId = req.user.id;
            const bookmarks = await bookmarkRepository.getBookmarksByUser(userId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Bookmarks berhasil didapatkan',
                data: { bookmarks },
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteBookmark(req, res, next) {
        try {
            const userId = req.user.id;
            const { jobId } = req.params;
            await bookmarkRepository.deleteBookmarkByJobAndUser({ jobId, userId });
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Bookmark berhasil dihapus',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new BookmarkController();