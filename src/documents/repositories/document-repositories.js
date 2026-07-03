import { nanoid } from 'nanoid';
import pg from 'pg';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';

const { Pool } = pg;

class DocumentRepository {
    constructor() {
        this._pool = new Pool();
    }

    async addDocument({ userId, name, filename, url, size }) {
        const id = `document-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO documents (id, user_id, name, filename, url, size) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, name, filename, url, size, created_at',
            values: [id, userId, name, filename, url, size],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async getDocuments(userId) {
        let query;
        if (userId) {
            query = {
                text: 'SELECT id, user_id, name, filename, url, size, created_at FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
                values: [userId],
            };
        } else {
            query = {
                text: 'SELECT id, user_id, name, filename, url, size, created_at FROM documents ORDER BY created_at DESC',
            };
        }
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getDocumentById(id) {
        const query = {
            text: 'SELECT id, user_id, name, filename, url, size, created_at FROM documents WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Dokumen tidak ditemukan');
        }
        return result.rows[0];
    }

    async deleteDocument(id) {
        const query = {
            text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Dokumen tidak ditemukan');
        }
    }

    async verifyDocumentOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM documents WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Dokumen tidak ditemukan');
        }
        if (result.rows[0].user_id !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

export default new DocumentRepository();