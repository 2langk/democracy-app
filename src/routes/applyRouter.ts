import { application, Router } from 'express';
import { protect } from '../controllers/authController';
import * as applyController from '../controllers/applyController';

const router = Router();

router.use('/', protect);

router
	.route('/')
	.post(applyController.createApplication)
	.get(applyController.getAllApplications);

// only for admin
router.route('/enrollment').post(applyController.permitEnrollment);
export default router;
