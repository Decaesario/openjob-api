import { Router } from 'express';
import validate from '../../middleware/validate.js';
import auth from '../../middleware/auth.js';
import { createApplicationSchema, updateApplicationSchema } from '../validator/schema.js';
import controller from '../controller/application-controller.js';

const router = Router();

router.post('/', auth, validate(createApplicationSchema), (req, res, next) => controller.createApplication(req, res, next));
router.get('/', auth, (req, res, next) => controller.getAllApplications(req, res, next));
router.get('/user/:userId', auth, (req, res, next) => controller.getApplicationsByUser(req, res, next));
router.get('/job/:jobId', auth, (req, res, next) => controller.getApplicationsByJob(req, res, next));
router.get('/:id', auth, (req, res, next) => controller.getApplicationById(req, res, next));
router.put('/:id', auth, validate(updateApplicationSchema), (req, res, next) => controller.updateApplication(req, res, next));
router.delete('/:id', auth, (req, res, next) => controller.deleteApplication(req, res, next));

export default router;