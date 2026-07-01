import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

const { Pool } = pg;

class BookmarkRepository {
    constructor() {
        this._pool = new Pool();
    }

    async addBookmark({ jobId, userId }) {
        const id = `bookmark-${nanoid(16)}`;
        const query = {
            text: `INSERT INTO bookmarks (id, job_id, user_id)
             VALUES ($1, $2, $3)
             RETURNING id, job_id, user_id, created_at`,
            values: [id, jobId, userId],
        };
        try {
            const result = await this._pool.query(query);
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new InvariantError('Job sudah di-bookmark');
            }
            throw err;
        }
    }

    async getBookmarkById(id) {
        const query = {
            text: `SELECT b.id, b.job_id, b.user_id, b.created_at,
                    j.title as job_title, j.location_city, j.job_type,
                    c.name as company_name
             FROM bookmarks b
             LEFT JOIN jobs j ON b.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE b.id = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Bookmark tidak ditemukan');
        }
        return result.rows[0];
    }

    async getBookmarksByUser(userId) {
        const query = {
            text: `SELECT b.id, b.job_id, b.user_id, b.created_at,
                    j.title as job_title, j.location_city, j.job_type,
                    c.name as company_name
             FROM bookmarks b
             LEFT JOIN jobs j ON b.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async deleteBookmarkByJobAndUser({ jobId, userId }) {
        const query = {
            text: 'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
            values: [jobId, userId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Bookmark tidak ditemukan');
        }
    }

    async verifyBookmarkOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM bookmarks WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Bookmark tidak ditemukan');
        }
    }
}

export default new BookmarkRepository();