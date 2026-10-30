import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import * as refreshController from '../controllers/refreshController';
import { RegisterSchema, LoginSchema } from '../services/authService';

const router = Router();

router.post('/register', validateBody(RegisterSchema), authController.register);
router.post('/login', validateBody(LoginSchema), authController.login);
router.post('/refresh', refreshController.refresh)
router.post('/validate', authController.validate)

export default router;