import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import * as refreshController from '../controllers/refreshController';
import { tryRefresh } from 'src/middleware/tryRefresh';
import { authenticate } from 'src/middleware/authenticate';
import { RegisterSchema, LoginSchema } from 'src/utils/schemas';

const router = Router();

router.post('/register', validate.body(RegisterSchema), authController.register);
router.post('/login', validate.body(LoginSchema), authController.login);
router.post('/refresh', refreshController.refresh);
router.post('/validate', tryRefresh, authenticate, authController.validate);

export default router;