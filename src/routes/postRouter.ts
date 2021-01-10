import { Router } from 'express';
import { uploadEduVideo } from '../utils/multerConfig';
import { protect } from '../controllers/authController';
import * as postController from '../controllers/postController';

const router = Router();

router.use(protect);

router
	.route('/')
	.get(postController.getAllPost)
	.post(uploadEduVideo.single('video'), postController.createPost);

router
	.route('/:id')
	.get(postController.getOnePost)
	.post(postController.createComment)
	.patch(postController.updatePost)
	.delete(postController.deletePost);

router
	.route('/:postId/comment/:id')
	.post(postController.createSubComment)
	.patch(postController.updateComment)
	.delete(postController.deleteComment);

router
	.route('/subcomment/:id')
	.patch(postController.updateSubComment)
	.delete(postController.deleteSubComment);
export default router;
