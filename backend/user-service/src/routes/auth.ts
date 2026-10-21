import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import * as refreshController from '../controllers/refreshController';
import { RegisterSchema, LoginSchema } from '../services/authService';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);
router.post('/refresh', refreshController.refresh)
router.post('/validate', authController.validate)

export default router;