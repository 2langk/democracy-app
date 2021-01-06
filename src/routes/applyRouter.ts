import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import * as applyController from '../controllers/applyController';

const router = Router();

router.use('/', protect);

router
	.route('/')
	.post(applyController.createApplication)
	.get(restrictTo('admin'), applyController.getAllApplications)
	.put(restrictTo('admin'), applyController.openOrCloseBoard);

// only for admin
router.use(restrictTo('admin'));

router
	.route('/:id')
	.post(applyController.permitApplication)
	.delete(applyController.deleteApplication);

export default router;
