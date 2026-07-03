import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import InvariantError from '../../exceptions/invariant-error.js';
import CacheService from '../../cache/redis-service.js';

const { Pool } = pg;

class ApplicationRepository {
    constructor() {
        this._pool = new Pool();
        this._cacheService = new CacheService();
    }

    async addApplication({ jobId, userId, coverLetter }) {
        const id = `application-${nanoid(16)}`;
        const query = {
            text: `INSERT INTO applications (id, job_id, user_id, cover_letter)
             VALUES ($1, $2, $3, $4)
             RETURNING id, job_id, user_id, cover_letter, status, created_at`,
            values: [id, jobId, userId, coverLetter],
        };
        try {
            const result = await this._pool.query(query);
            await this._cacheService.delete(`applications:user:${userId}`);
            await this._cacheService.delete(`applications:job:${jobId}`);
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new InvariantError('Anda sudah melamar pekerjaan ini');
            }
            throw err;
        }
    }

    async getAllApplications() {
        const query = {
            text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                          a.created_at, a.updated_at,
                          j.title as job_title, j.company_id, j.category_id,
                          j.location_city, j.job_type, j.experience_level
                   FROM applications a
                   LEFT JOIN jobs j ON a.job_id = j.id
                   ORDER BY a.created_at DESC`,
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getApplicationById(id) {
        const cacheKey = `application:${id}`;
        try {
            const cached = await this._cacheService.get(cacheKey);
            return { data: JSON.parse(cached), source: 'cache' };
        } catch {
            const query = {
                text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                              a.created_at, a.updated_at,
                              j.title as job_title, u.name as user_name
                       FROM applications a
                       LEFT JOIN jobs j ON a.job_id = j.id
                       LEFT JOIN users u ON a.user_id = u.id
                       WHERE a.id = $1`,
                values: [id],
            };
            const result = await this._pool.query(query);
            if (!result.rows.length) {
                throw new NotFoundError('Application tidak ditemukan');
            }
            await this._cacheService.set(cacheKey, JSON.stringify(result.rows[0]));
            return { data: result.rows[0], source: 'database' };
        }
    }

    async getApplicationsByUser(userId) {
        const cacheKey = `applications:user:${userId}`;
        try {
            const cached = await this._cacheService.get(cacheKey);
            return { data: JSON.parse(cached), source: 'cache' };
        } catch {
            const query = {
                text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                              a.created_at, a.updated_at,
                              j.title as job_title, j.company_id, j.category_id,
                              j.location_city, j.job_type, j.experience_level
                       FROM applications a
                       LEFT JOIN jobs j ON a.job_id = j.id
                       WHERE a.user_id = $1
                       ORDER BY a.created_at DESC`,
                values: [userId],
            };
            const result = await this._pool.query(query);
            await this._cacheService.set(cacheKey, JSON.stringify(result.rows));
            return { data: result.rows, source: 'database' };
        }
    }

    async getApplicationsByUserForProfile(userId) {
        const query = {
            text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                          a.created_at, a.updated_at,
                          j.title as job_title, j.description as job_description,
                          j.company_id, j.category_id, j.location_city,
                          j.job_type, j.experience_level, j.salary_min
                   FROM applications a
                   LEFT JOIN jobs j ON a.job_id = j.id
                   WHERE a.user_id = $1
                   ORDER BY a.created_at DESC`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getApplicationsByJob(jobId) {
        const cacheKey = `applications:job:${jobId}`;
        try {
            const cached = await this._cacheService.get(cacheKey);
            return { data: JSON.parse(cached), source: 'cache' };
        } catch {
            const query = {
                text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                              a.created_at, a.updated_at,
                              j.title as job_title, j.company_id, j.category_id,
                              j.location_city, j.job_type, j.experience_level
                       FROM applications a
                       LEFT JOIN jobs j ON a.job_id = j.id
                       WHERE a.job_id = $1
                       ORDER BY a.created_at DESC`,
                values: [jobId],
            };
            const result = await this._pool.query(query);
            await this._cacheService.set(cacheKey, JSON.stringify(result.rows));
            return { data: result.rows, source: 'database' };
        }
    }

    async updateApplicationStatus(id, { status }) {
        const query = {
            text: `UPDATE applications SET status = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, job_id, user_id, cover_letter, status, updated_at`,
            values: [status, id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Application tidak ditemukan');
        }
        const app = result.rows[0];
        await this._cacheService.delete(`application:${id}`);
        await this._cacheService.delete(`applications:user:${app.user_id}`);
        await this._cacheService.delete(`applications:job:${app.job_id}`);
        return app;
    }

    async deleteApplication(id) {
        const getQuery = {
            text: 'SELECT user_id, job_id FROM applications WHERE id = $1',
            values: [id],
        };
        const getResult = await this._pool.query(getQuery);
        if (!getResult.rows.length) {
            throw new NotFoundError('Application tidak ditemukan');
        }
        const { user_id, job_id } = getResult.rows[0];

        const query = {
            text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
            values: [id],
        };
        await this._pool.query(query);
        await this._cacheService.delete(`application:${id}`);
        await this._cacheService.delete(`applications:user:${user_id}`);
        await this._cacheService.delete(`applications:job:${job_id}`);
    }

    async verifyApplicationOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM applications WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Application tidak ditemukan');
        }
        if (result.rows[0].user_id !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyJobOwnerForApplication(applicationId, userId) {
        const query = {
            text: `SELECT j.owner_id FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.id = $1`,
            values: [applicationId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Application tidak ditemukan');
        }
        if (result.rows[0].owner_id !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

export default new ApplicationRepository();