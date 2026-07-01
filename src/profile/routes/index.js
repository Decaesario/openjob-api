import { Router } from 'express';
import auth from '../../middleware/auth.js';
import controller from '../controller/profile-controller.js';

const router = Router();

router.get('/', auth, (req, res, next) => controller.getProfile(req, res, next));
router.get('/applications', auth, (req, res, next) => controller.getProfileApplications(req, res, next));
router.get('/bookmarks', auth, (req, res, next) => controller.getProfileBookmarks(req, res, next));

export default router;