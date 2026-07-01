import { Router } from 'express';
import validate from '../../middleware/validate.js';
import auth from '../../middleware/auth.js';
import { createCategorySchema, updateCategorySchema } from '../validator/schema.js';
import controller from '../controller/category-controller.js';

const router = Router();

router.get('/', (req, res, next) => controller.getAllCategories(req, res, next));
router.get('/:id', (req, res, next) => controller.getCategoryById(req, res, next));
router.post('/', auth, validate(createCategorySchema), (req, res, next) => controller.createCategory(req, res, next));
router.put('/:id', auth, validate(updateCategorySchema), (req, res, next) => controller.updateCategory(req, res, next));
router.delete('/:id', auth, (req, res, next) => controller.deleteCategory(req, res, next));

export default router;