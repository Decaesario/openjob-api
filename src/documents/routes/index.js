import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../../middleware/auth.js';
import controller from '../controller/document-controller.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documents');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post('/documents', auth, upload.single('document'), (req, res, next) => controller.uploadDocument(req, res, next));
router.get('/documents', (req, res, next) => controller.getDocuments(req, res, next));
router.get('/documents/:id', (req, res, next) => controller.getDocumentById(req, res, next));
router.delete('/documents/:id', auth, (req, res, next) => controller.deleteDocument(req, res, next));

export default router;