import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import * as pledgeController from '../controllers/pledgeController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get(pledgeController.getAllPledges)
	.post(restrictTo('candidate'), pledgeController.createPledge);

router
	.route('/:id')
	.get(pledgeController.getOnePledge)
	.post(pledgeController.voteToPledge) // for every user(same school)
	.patch(restrictTo('candidate', 'admin'), pledgeController.updatePledge)
	.delete(restrictTo('candidate', 'admin'), pledgeController.deletePledge);

export default router;
