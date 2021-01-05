import { Router } from 'express';
import { uploadUserPhoto } from '../utils/multerConfig';
import * as authController from '../controllers/authController';

const router = Router();

router
	.route('/register')
	.post(authController.registerForTeacher)
	.patch(uploadUserPhoto.single('photo'), authController.registerForStudent);

router.post('/login', authController.login);

router.use(authController.protect);

router.get('/logout', authController.logout);

router.use(authController.restrictTo('teacher'));

router.route('/teacher').get(authController.getAllStudent);
router.route('/teacher/:id').post(authController.authStudent);

export default router;
