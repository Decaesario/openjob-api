import { Router } from 'express';
import validate from '../../middleware/validate.js';
import auth from '../../middleware/auth.js';
import { createCompanySchema, updateCompanySchema } from '../validator/schema.js';
import controller from '../controller/company-controller.js';

const router = Router();

router.get('/', (req, res, next) => controller.getAllCompanies(req, res, next));
router.get('/:id', (req, res, next) => controller.getCompanyById(req, res, next));
router.post('/', auth, validate(createCompanySchema), (req, res, next) => controller.createCompany(req, res, next));
router.put('/:id', auth, validate(updateCompanySchema), (req, res, next) => controller.updateCompany(req, res, next));
router.delete('/:id', auth, (req, res, next) => controller.deleteCompany(req, res, next));

export default router;