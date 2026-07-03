import path from 'path';
import fs from 'fs';
import documentRepository from '../repositories/document-repositories.js';
import sendResponse from '../../utils/response.js';

class DocumentController {
    async uploadDocument(req, res, next) {
        try {
            const userId = req.user.id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'File is required and must be a PDF',
                });
            }

            const url = `http://${process.env.HOST}:${process.env.PORT}/uploads/documents/${file.filename}`;
            const document = await documentRepository.addDocument({
                userId,
                name: file.originalname,
                url,
                filename: file.filename,
                size: file.size,
            });

            return sendResponse(res, {
                code: 201,
                status: 'success',
                message: 'Dokumen berhasil diupload',
                data: {
                    documentId: document.id,
                    filename: document.filename,
                    originalName: document.name,
                    size: document.size,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    async getDocuments(req, res, next) {
        try {
            const userId = req.user ? req.user.id : null;
            const documents = await documentRepository.getDocuments(userId);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Dokumen berhasil didapatkan',
                data: { documents },
            });
        } catch (err) {
            next(err);
        }
    }

    async getDocumentById(req, res, next) {
        try {
            const document = await documentRepository.getDocumentById(req.params.id);
            const filePath = path.resolve(`uploads/documents/${document.filename}`);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'File tidak ditemukan',
                });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${document.name}"`);
            return res.sendFile(filePath);
        } catch (err) {
            next(err);
        }
    }

    async deleteDocument(req, res, next) {
        try {
            await documentRepository.verifyDocumentOwner(req.params.id, req.user.id);
            await documentRepository.deleteDocument(req.params.id);
            return sendResponse(res, {
                code: 200,
                status: 'success',
                message: 'Dokumen berhasil dihapus',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new DocumentController();