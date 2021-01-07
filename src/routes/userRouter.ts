import { Router } from 'express';
import { protect } from '../controllers/authController';
import * as userController from '../controllers/userController';

const router = Router();

router.use(protect);

router.route('/').get(userController.getCurrentUser);

router
	.route('/:id')
	.get(userController.getOneUser)
	.post(userController.changePassword)
	.patch(userController.updateUserInfo)
	.delete(userController.deleteUser);

export default router;
