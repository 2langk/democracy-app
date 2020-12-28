import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import * as pledgeController from '../controllers/pledgeController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get()
	.post(restrictTo('candidate'), pledgeController.createPledge);

export default router;
