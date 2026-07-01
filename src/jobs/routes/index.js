import { Router } from 'express';
import validate from '../../middleware/validate.js';
import auth from '../../middleware/auth.js';
import { createJobSchema, updateJobSchema } from '../validator/schema.js';
import controller from '../controller/job-controller.js';
import bookmarkController from '../../bookmarks/controller/bookmark-controller.js';

const router = Router();

router.get('/', (req, res, next) => controller.getAllJobs(req, res, next));
router.get('/company/:companyId', (req, res, next) => controller.getJobsByCompany(req, res, next));
router.get('/category/:categoryId', (req, res, next) => controller.getJobsByCategory(req, res, next));
router.get('/:id', (req, res, next) => controller.getJobById(req, res, next));
router.post('/', auth, validate(createJobSchema), (req, res, next) => controller.createJob(req, res, next));
router.put('/:id', auth, validate(updateJobSchema), (req, res, next) => controller.updateJob(req, res, next));
router.delete('/:id', auth, (req, res, next) => controller.deleteJob(req, res, next));

router.post('/:jobId/bookmark', auth, (req, res, next) => bookmarkController.addBookmark(req, res, next));
router.get('/:jobId/bookmark/:id', auth, (req, res, next) => bookmarkController.getBookmarkById(req, res, next));
router.delete('/:jobId/bookmark', auth, (req, res, next) => bookmarkController.deleteBookmark(req, res, next));

export default router;