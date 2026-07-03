import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';

const { Pool } = pg;

class JobRepository {
    constructor() {
        this._pool = new Pool();
    }

    async addJob({ title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id, ownerId }) {
        const id = `job-${nanoid(16)}`;
        const query = {
            text: `INSERT INTO jobs (id, title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             RETURNING id, title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id, owner_id`,
            values: [id, title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status || 'open', company_id, category_id, ownerId],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async getAllJobs({ title, companyName } = {}) {
        let text = `SELECT j.id, j.title, j.description, j.job_type, j.experience_level,
                     j.location_type, j.location_city, j.salary_min, j.salary_max,
                     j.is_salary_visible, j.status, j.company_id, j.category_id
              FROM jobs j
              LEFT JOIN companies c ON j.company_id = c.id
              WHERE 1=1`;
        const values = [];
        let paramIndex = 1;

        if (title) {
            text += ` AND j.title ILIKE $${paramIndex}`;
            values.push(`%${title}%`);
            paramIndex++;
        }

        if (companyName) {
            text += ` AND c.name ILIKE $${paramIndex}`;
            values.push(`%${companyName}%`);
            paramIndex++;
        }

        text += ' ORDER BY j.created_at DESC';

        const result = await this._pool.query({ text, values });
        return result.rows;
    }

    async getJobById(id) {
        const query = {
            text: `SELECT j.id, j.title, j.description, j.requirements, j.salary_min, j.salary_max,
                    j.is_salary_visible, j.job_type, j.experience_level, j.location_type,
                    j.location_city, j.status, j.company_id, j.category_id, j.owner_id,
                    c.name as company_name, cat.name as category_name, j.created_at, j.updated_at
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             LEFT JOIN categories cat ON j.category_id = cat.id
             WHERE j.id = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Job tidak ditemukan');
        }
        return result.rows[0];
    }

    async getJobsByCompany(companyId) {
        const query = {
            text: `SELECT j.id, j.title, j.description, j.requirements, j.salary_min, j.salary_max,
                    j.is_salary_visible, j.job_type, j.experience_level, j.location_type,
                    j.location_city, j.status, j.company_id, j.category_id, j.owner_id,
                    c.name as company_name, cat.name as category_name
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             LEFT JOIN categories cat ON j.category_id = cat.id
             WHERE j.company_id = $1
             ORDER BY j.created_at DESC`,
            values: [companyId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getJobsByCategory(categoryId) {
        const query = {
            text: `SELECT j.id, j.title, j.description, j.requirements, j.salary_min, j.salary_max,
                    j.is_salary_visible, j.job_type, j.experience_level, j.location_type,
                    j.location_city, j.status, j.company_id, j.category_id, j.owner_id,
                    c.name as company_name, cat.name as category_name
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             LEFT JOIN categories cat ON j.category_id = cat.id
             WHERE j.category_id = $1
             ORDER BY j.created_at DESC`,
            values: [categoryId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async updateJob(id, { title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id }) {
        const query = {
            text: `UPDATE jobs SET title = $1, description = $2, requirements = $3, salary_min = $4,
             salary_max = $5, is_salary_visible = $6, job_type = $7, experience_level = $8,
             location_type = $9, location_city = $10, status = $11, company_id = $12,
             category_id = $13, updated_at = NOW()
             WHERE id = $14
             RETURNING id, title, description, requirements, salary_min, salary_max, is_salary_visible,
             job_type, experience_level, location_type, location_city, status, company_id, category_id, owner_id`,
            values: [title, description, requirements, salary_min, salary_max, is_salary_visible, job_type, experience_level, location_type, location_city, status, company_id, category_id, id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Job tidak ditemukan');
        }
        return result.rows[0];
    }

    async deleteJob(id) {
        const query = {
            text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Job tidak ditemukan');
        }
    }

    async verifyJobOwner(id, ownerId) {
        const query = {
            text: 'SELECT owner_id FROM jobs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Job tidak ditemukan');
        }
        if (result.rows[0].owner_id !== ownerId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

export default new JobRepository();