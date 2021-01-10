"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerConfig_1 = require("../utils/multerConfig");
const authController_1 = require("../controllers/authController");
const postController = require("../controllers/postController");
const router = express_1.Router();
router.use(authController_1.protect);
router
    .route('/')
    .get(postController.getAllPost)
    .post(multerConfig_1.uploadEduVideo.single('video'), postController.createPost);
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
exports.default = router;
