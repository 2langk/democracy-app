import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import { uploadPledgeImages } from '../utils/multerConfig';
import * as pledgeController from '../controllers/pledgeController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get(pledgeController.getAllPledges)
	.post(
		restrictTo('candidate'),
		uploadPledgeImages.array('images'),
		pledgeController.createPledge
	);

router
	.route('/admin')
	.get(restrictTo('admin'), pledgeController.getResult)
	.post(restrictTo('admin'), pledgeController.electPresident)
	// .patch(restrictTo('admin'), pledgeController.voteReset)
	.put(restrictTo('admin'), pledgeController.openOrCloseVote);

router
	.route('/:id')
	.get(pledgeController.getOnePledge)
	.put(pledgeController.voteToPledge) // for every user(same school)
	.patch(
		restrictTo('candidate'),
		uploadPledgeImages.array('images'),
		pledgeController.updatePledge
	)
	.delete(restrictTo('candidate', 'admin'), pledgeController.deletePledge);

export default router;
