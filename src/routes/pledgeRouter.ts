import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import * as pledgeController from '../controllers/pledgeController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get(pledgeController.getAllPledges)
	.post(restrictTo('candidate'), pledgeController.createPledge);

router.route('/:id').get(pledgeController.getOnePledge);
// .patch(restrictTo('candidate'), pledgeController.updatePledge)
// .delete((restrictTo('candidate'),pledgeController.deletePledge));
export default router;
