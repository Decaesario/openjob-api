import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

const { Pool } = pg;

class ApplicationRepository {
    constructor() {
        this._pool = new Pool();
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
                    j.title as job_title, u.name as user_name, a.created_at
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN users u ON a.user_id = u.id
             ORDER BY a.created_at DESC`,
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getApplicationById(id) {
        const query = {
            text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                    j.title as job_title, u.name as user_name, a.created_at, a.updated_at
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
        return result.rows[0];
    }

    async getApplicationsByUser(userId) {
        const query = {
            text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                    j.title as job_title, u.name as user_name, a.created_at
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN users u ON a.user_id = u.id
             WHERE a.user_id = $1
             ORDER BY a.created_at DESC`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getApplicationsByJob(jobId) {
        const query = {
            text: `SELECT a.id, a.job_id, a.user_id, a.cover_letter, a.status,
                    j.title as job_title, u.name as user_name, a.created_at
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN users u ON a.user_id = u.id
             WHERE a.job_id = $1
             ORDER BY a.created_at DESC`,
            values: [jobId],
        };
        const result = await this._pool.query(query);
        return result.rows;
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
        return result.rows[0];
    }

    async deleteApplication(id) {
        const query = {
            text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Application tidak ditemukan');
        }
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