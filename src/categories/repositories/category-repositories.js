import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

const { Pool } = pg;

class CategoryRepository {
    constructor() {
        this._pool = new Pool();
    }

    async addCategory({ name, description }) {
        const id = `category-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) RETURNING id, name, description',
            values: [id, name, description],
        };
        try {
            const result = await this._pool.query(query);
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new InvariantError('Nama kategori sudah digunakan');
            }
            throw err;
        }
    }

    async getAllCategories() {
        const result = await this._pool.query(
            'SELECT id, name, description, created_at FROM categories ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async getCategoryById(id) {
        const query = {
            text: 'SELECT id, name, description, created_at, updated_at FROM categories WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Kategori tidak ditemukan');
        }
        return result.rows[0];
    }

    async updateCategory(id, { name, description }) {
        const query = {
            text: `UPDATE categories SET name = $1, description = $2, updated_at = NOW()
             WHERE id = $3 RETURNING id, name, description`,
            values: [name, description, id],
        };
        try {
            const result = await this._pool.query(query);
            if (!result.rows.length) {
                throw new NotFoundError('Kategori tidak ditemukan');
            }
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new InvariantError('Nama kategori sudah digunakan');
            }
            throw err;
        }
    }

    async deleteCategory(id) {
        const query = {
            text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Kategori tidak ditemukan');
        }
    }
}

export default new CategoryRepository();