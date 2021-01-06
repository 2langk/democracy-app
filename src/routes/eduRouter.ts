import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import { uploadEduVideo } from '../utils/multerConfig';
import * as eduController from '../controllers/eduController';

const router = Router();

router
	.route('/')
	.get(eduController.getAllEduPost)
	.post(
		protect,
		restrictTo('admin'),
		uploadEduVideo.single('video'),
		eduController.createEduPost
	);

router.route('/:id').get(eduController.getOneEduPost);
router.use('/', protect);

export default router;
