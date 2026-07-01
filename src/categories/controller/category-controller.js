import categoryRepository from '../repositories/category-repositories.js';
import sendResponse from '../../utils/response.js';

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const category = await categoryRepository.addCategory(req.body);
            return sendResponse(res, {
                code: 201,
                status: 'success',
                message: 'Kategori berhasil dibuat',
                data: { id: category.id, name: category.name },
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllCategories(req, res, next) {
        try {
            const categories = await categoryRepository.getAllCategories();
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Kategori berhasil didapatkan',
                data: { categories },
            });
        } catch (err) {
            next(err);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const category = await categoryRepository.getCategoryById(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Kategori berhasil didapatkan',
                data: { id: category.id, name: category.name, description: category.description },
            });
        } catch (err) {
            next(err);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const category = await categoryRepository.updateCategory(req.params.id, req.body);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Kategori berhasil diperbarui',
                data: { id: category.id, name: category.name },
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            await categoryRepository.deleteCategory(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Kategori berhasil dihapus',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new CategoryController();