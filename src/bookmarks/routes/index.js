import { Router } from 'express';
import auth from '../../middleware/auth.js';
import controller from '../controller/bookmark-controller.js';

const router = Router();

router.get('/', auth, (req, res, next) => controller.getBookmarksByUser(req, res, next));

export default router;