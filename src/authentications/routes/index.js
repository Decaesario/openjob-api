import { Router } from 'express';
import validate from '../../middleware/validate.js';
import auth from '../../middleware/auth.js';
import { loginSchema, refreshTokenSchema, deleteAuthSchema } from '../validator/schema.js';
import controller from '../controller/authentication-controller.js';

const router = Router();

router.post('/', validate(loginSchema), (req, res, next) => controller.login(req, res, next));
router.put('/', validate(refreshTokenSchema), (req, res, next) => controller.refreshToken(req, res, next));
router.delete('/', auth, validate(deleteAuthSchema), (req, res, next) => controller.logout(req, res, next));

export default router;