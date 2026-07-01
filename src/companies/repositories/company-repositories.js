import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';

const { Pool } = pg;

class CompanyRepository {
    constructor() {
        this._pool = new Pool();
    }

    async addCompany({ name, description, location, industry, website, ownerId }) {
        const id = `company-${nanoid(16)}`;
        const query = {
            text: `INSERT INTO companies (id, name, description, location, industry, website, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, description, location, industry, website, owner_id`,
            values: [id, name, description, location, industry, website, ownerId],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async getAllCompanies() {
        const query = {
            text: `SELECT c.id, c.name, c.description, c.location, c.industry, c.website, c.owner_id,
                    u.name as owner_name
             FROM companies c
             LEFT JOIN users u ON c.owner_id = u.id
             ORDER BY c.created_at DESC`,
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getCompanyById(id) {
        const query = {
            text: `SELECT c.id, c.name, c.description, c.location, c.industry, c.website,
                    c.owner_id, u.name as owner_name, c.created_at, c.updated_at
             FROM companies c
             LEFT JOIN users u ON c.owner_id = u.id
             WHERE c.id = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Company tidak ditemukan');
        }
        return result.rows[0];
    }

    async updateCompany(id, { name, description, location, industry, website }) {
        const query = {
            text: `UPDATE companies SET name = $1, description = $2, location = $3, industry = $4,
             website = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING id, name, description, location, industry, website, owner_id`,
            values: [name, description, location, industry, website, id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Company tidak ditemukan');
        }
        return result.rows[0];
    }

    async deleteCompany(id) {
        const query = {
            text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Company tidak ditemukan');
        }
    }

    async verifyCompanyOwner(id, ownerId) {
        const query = {
            text: 'SELECT owner_id FROM companies WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Company tidak ditemukan');
        }
        if (result.rows[0].owner_id !== ownerId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

export default new CompanyRepository();