import { Router } from 'express';
import { protect } from '../controllers/authController';
import * as questionController from '../controllers/questionController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get(questionController.getAllQuestion)
	.post(questionController.createQuestion);

router
	.route('/:id')
	.get(questionController.getOneQuestion)
	.post(questionController.createAnswer)
	.patch(questionController.updateQuestion)
	.delete(questionController.deleteQuestion);

router
	.route('/:questionId/answer/:id')
	.patch(questionController.updateAnswer)
	.delete(questionController.deleteAnswer);
export default router;
