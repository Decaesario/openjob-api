import jobRepository from '../repositories/job-repositories.js';
import sendResponse from '../../utils/response.js';

class JobController {
    async createJob(req, res, next) {
        try {
            const ownerId = req.user.id;
            const { title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id } = req.body;
            const job = await jobRepository.addJob({
                title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id, ownerId,
            });
            return sendResponse(res, {
                code: 201,
                status: 'success',
                message: 'Job berhasil dibuat',
                data: { id: job.id, title: job.title, company_id: job.company_id, category_id: job.category_id },
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllJobs(req, res, next) {
        try {
            const { title } = req.query;
            const companyName = req.query['company-name'];
            const jobs = await jobRepository.getAllJobs({ title, companyName });
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Jobs berhasil didapatkan',
                data: { jobs },
            });
        } catch (err) {
            next(err);
        }
    }

    async getJobById(req, res, next) {
        try {
            const job = await jobRepository.getJobById(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Job berhasil didapatkan',
                data: { id: job.id, title: job.title, description: job.description, requirements: job.requirements, salary_min: job.salary_min, salary_max: job.salary_max, is_salary_visible: job.is_salary_visible, job_type: job.job_type, experience_level: job.experience_level, location_type: job.location_type, location_city: job.location_city, status: job.status, company_id: job.company_id, category_id: job.category_id, owner_id: job.owner_id, company_name: job.company_name, category_name: job.category_name },
            });
        } catch (err) {
            next(err);
        }
    }

    async getJobsByCompany(req, res, next) {
        try {
            const jobs = await jobRepository.getJobsByCompany(req.params.companyId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Jobs berhasil didapatkan',
                data: { jobs },
            });
        } catch (err) {
            next(err);
        }
    }

    async getJobsByCategory(req, res, next) {
        try {
            const jobs = await jobRepository.getJobsByCategory(req.params.categoryId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Jobs berhasil didapatkan',
                data: { jobs },
            });
        } catch (err) {
            next(err);
        }
    }

    async updateJob(req, res, next) {
        try {
            await jobRepository.verifyJobOwner(req.params.id, req.user.id);
            const { title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id } = req.body;
            const job = await jobRepository.updateJob(req.params.id, {
                title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id,
            });
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Job berhasil diperbarui',
                data: { job },
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteJob(req, res, next) {
        try {
            await jobRepository.verifyJobOwner(req.params.id, req.user.id);
            await jobRepository.deleteJob(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Job berhasil dihapus',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new JobController();