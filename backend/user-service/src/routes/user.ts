import { Router } from 'express';
import { tryRefresh } from '../middleware/tryRefresh';
import { authenticate } from '../middleware/authenticate';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/me', tryRefresh, authenticate, userController.me)
router.post('/logout', userController.logout)

export default router;