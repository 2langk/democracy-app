import { Router } from 'express';
import { protect } from '../controllers/authController';
import * as evalController from '../controllers/evalController';

const router = Router();

router.use(protect);

router
	.route('/:id')
	.get(evalController.getEvaluation)
	.post(evalController.createEvaluation);

export default router;
