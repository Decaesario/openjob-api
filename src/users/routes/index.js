import { Router } from 'express';
import validate from '../../middleware/validate.js';
import { registerUserSchema } from '../validator/schema.js';
import controller from '../controller/user-controller.js';

const router = Router();

router.post('/', validate(registerUserSchema), (req, res, next) => controller.registerUser(req, res, next));
router.get('/:id', (req, res, next) => controller.getUserById(req, res, next));

export default router;