import { Router } from 'express';
import { tryRefresh } from '../middleware/tryRefresh';
import { authenticate } from '../middleware/authenticate';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/me', tryRefresh, authenticate, userController.me)

export default router;