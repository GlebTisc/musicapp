import { Router } from 'express';
import { tryRefresh } from '../middleware/tryRefresh';
import { authenticate } from '../middleware/authenticate';
import * as userController from '../controllers/userController';
import { authorize } from 'src/middleware/authorize';
import { validateQuery } from 'src/middleware/validate';
import { GetUserParamsSchema } from 'src/utils/schemas';

const router = Router();

router.get('/me', tryRefresh, authenticate, userController.me)
router.post('/logout', userController.logout)
router.get('/getList', tryRefresh, authenticate, authorize('admin'), validateQuery(GetUserParamsSchema), userController.getList)
router.get('/get/:id', tryRefresh, authenticate, authorize('admin'))

export default router;