import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pg from 'pg';
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthenticationError from '../../exceptions/authentication-error.js';
import CacheService from '../../cache/redis-service.js';

const { Pool } = pg;

class UserRepository {
    constructor() {
        this._pool = new Pool();
        this._cacheService = new CacheService();
    }

    async addUser({ name, email, password, role }) {
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = {
            text: 'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            values: [id, name, email, hashedPassword, role || 'user'],
        };

        try {
            const result = await this._pool.query(query);
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new InvariantError('Email sudah terdaftar');
            }
            throw err;
        }
    }

    async getUserById(id) {
        const cacheKey = `user:${id}`;

        try {
            const cached = await this._cacheService.get(cacheKey);
            return { data: JSON.parse(cached), source: 'cache' };
        } catch {
            const query = {
                text: 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
                values: [id],
            };
            const result = await this._pool.query(query);
            if (!result.rows.length) {
                throw new NotFoundError('User tidak ditemukan');
            }
            await this._cacheService.set(cacheKey, JSON.stringify(result.rows[0]));
            return { data: result.rows[0], source: 'database' };
        }
    }

    async verifyUserCredentials({ email, password }) {
        const query = {
            text: 'SELECT id, name, email, role, password FROM users WHERE email = $1',
            values: [email],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new AuthenticationError('Email atau password salah');
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new AuthenticationError('Email atau password salah');
        }
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
}

export default new UserRepository();