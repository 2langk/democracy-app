import { Router } from 'express';
import { protect } from '../controllers/authController';
import * as evalController from '../controllers/evalController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get(evalController.getEvaluationAVG)
	.post(evalController.createEvaluation);

router
	.route('/:id')
	.get(evalController.getMyEvaluation)
	.patch(evalController.updateMyEvaluation);

export default router;
