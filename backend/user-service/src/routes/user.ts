import { Router } from 'express';
import { tryRefresh } from '../middleware/tryRefresh';
import { authenticate } from '../middleware/authenticate';
import * as userController from '../controllers/userController';
import { authorize } from 'src/middleware/authorize';
import { validate } from 'src/middleware/validate';
import { GetUserParamsSchema, GetUserByIdSchema, CreateUserSchema, UpdateUserSchema } from 'src/utils/schemas';

const router = Router();

router.get('/me', tryRefresh, authenticate, userController.me)
router.post('/logout', userController.logout)
router.get('/get', tryRefresh, authenticate, authorize('admin'), validate.query(GetUserParamsSchema), userController.get)
router.get('/getOne/:id', tryRefresh, authenticate, authorize('admin'), validate.params(GetUserByIdSchema), userController.getOne)
router.post('/create', tryRefresh, authenticate, authorize('admin'), validate.body(CreateUserSchema), userController.create)
router.patch(
    '/update/:id', 
    tryRefresh, 
    authenticate, 
    authorize('admin'), 
    validate.params(GetUserByIdSchema),
    validate.body(UpdateUserSchema),
    userController.update
)
router.delete('/delete/:id', tryRefresh, authenticate, authorize('admin'), validate.params(GetUserByIdSchema), userController.deleteUser)

export default router;