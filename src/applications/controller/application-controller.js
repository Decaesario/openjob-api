import applicationRepository from '../repositories/application-repositories.js';
import sendResponse from '../../utils/response.js';
import ProducerService from '../../message-broker/producer.js';

class ApplicationController {
    async createApplication(req, res, next) {
        try {
            const userId = req.user.id;
            const { job_id, cover_letter } = req.body;
            const application = await applicationRepository.addApplication({ jobId: job_id, userId, coverLetter: cover_letter });

            // Publish ke RabbitMQ (non-blocking)
            ProducerService.sendMessage('applications', JSON.stringify({
                applicationId: application.id,
                jobId: application.job_id,
                userId: application.user_id,
            })).catch(console.error);

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
            const { data, source } = await applicationRepository.getApplicationById(req.params.id);
            res.setHeader('X-Data-Source', source);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { id: data.id, job_id: data.job_id, user_id: data.user_id, cover_letter: data.cover_letter, status: data.status },
            });
        } catch (err) {
            next(err);
        }
    }

    async getApplicationsByUser(req, res, next) {
        try {
            const { data, source } = await applicationRepository.getApplicationsByUser(req.params.userId);
            res.setHeader('X-Data-Source', source);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { applications: data },
            });
        } catch (err) {
            next(err);
        }
    }

    async getApplicationsByJob(req, res, next) {
        try {
            const { data, source } = await applicationRepository.getApplicationsByJob(req.params.jobId);
            res.setHeader('X-Data-Source', source);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Lamaran berhasil didapatkan',
                data: { applications: data },
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