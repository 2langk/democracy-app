import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import * as applyController from '../controllers/applyController';
import { uploadApplyImages } from '../utils/multerConfig';

const router = Router();

router.use('/', protect);

router
	.route('/')
	.post(uploadApplyImages.array('images'), applyController.createApplication)
	.get(applyController.getAllApplications)
	.put(restrictTo('admin'), applyController.openOrCloseBoard);

router
	.route('/:id')
	.get(applyController.getOneApplication)
	.post(restrictTo('admin'), applyController.permitApplication)
	.delete(restrictTo('admin'), applyController.deleteApplication);

export default router;
