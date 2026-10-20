import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import * as refreshController from '../controllers/refreshController';
import { RegisterSchema, LoginSchema } from '../services/authService';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);
router.post('/refresh', refreshController.refresh)

export default router;