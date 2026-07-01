import applicationRepository from '../repositories/application-repositories.js';
import sendResponse from '../../utils/response.js';

class ApplicationController {
    async createApplication(req, res, next) {
        try {
            const userId = req.user.id;
            const { job_id, cover_letter } = req.body;
            const application = await applicationRepository.addApplication({ jobId: job_id, userId, coverLetter: cover_letter });
            return sendResponse(res, {
                code: 201,
                status: 'success',
                message: 'Lamaran berhasil dibuat',
                data: { id: application.id, job_id: application.job_id, user_id: application.user_id, status: application.status },
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllApplications(req, res, next) {
        try {
            const applications = await applicationRepository.getAllApplications();
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { applications },
            });
        } catch (err) {
            next(err);
        }
    }

    async getApplicationById(req, res, next) {
        try {
            const application = await applicationRepository.getApplicationById(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { id: application.id, job_id: application.job_id, user_id: application.user_id, cover_letter: application.cover_letter, status: application.status },
            });
        } catch (err) {
            next(err);
        }
    }

    async getApplicationsByUser(req, res, next) {
        try {
            const applications = await applicationRepository.getApplicationsByUser(req.params.userId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { applications },
            });
        } catch (err) {
            next(err);
        }
    }

    async getApplicationsByJob(req, res, next) {
        try {
            const applications = await applicationRepository.getApplicationsByJob(req.params.jobId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { applications },
            });
        } catch (err) {
            next(err);
        }
    }

    async updateApplication(req, res, next) {
        try {
            await applicationRepository.verifyJobOwnerForApplication(req.params.id, req.user.id);
            const application = await applicationRepository.updateApplicationStatus(req.params.id, req.body);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil diperbarui',
                data: { application },
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteApplication(req, res, next) {
        try {
            await applicationRepository.verifyApplicationOwner(req.params.id, req.user.id);
            await applicationRepository.deleteApplication(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil dihapus',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new ApplicationController();