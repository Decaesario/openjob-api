import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';
import CacheService from '../../cache/redis-service.js';

const { Pool } = pg;

class BookmarkRepository {
    constructor() {
        this._pool = new Pool();
        this._cacheService = new CacheService();
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
            await this._cacheService.delete(`bookmarks:user:${userId}`);
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
        const cacheKey = `bookmarks:user:${userId}`;
        try {
            const cached = await this._cacheService.get(cacheKey);
            return { data: JSON.parse(cached), source: 'cache' };
        } catch {
            const query = {
                text: `SELECT b.id, b.job_id, b.user_id, b.created_at,
                              j.title as job_title, j.description as job_description,
                              j.job_type, j.experience_level, j.location_type,
                              j.location_city, j.salary_min, j.salary_max,
                              j.is_salary_visible, j.status as job_status,
                              j.company_id, j.category_id, j.owner_id,
                              c.name as company_name
                       FROM bookmarks b
                       LEFT JOIN jobs j ON b.job_id = j.id
                       LEFT JOIN companies c ON j.company_id = c.id
                       WHERE b.user_id = $1
                       ORDER BY b.created_at DESC`,
                values: [userId],
            };
            const result = await this._pool.query(query);
            await this._cacheService.set(cacheKey, JSON.stringify(result.rows));
            return { data: result.rows, source: 'database' };
        }
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
        await this._cacheService.delete(`bookmarks:user:${userId}`);
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