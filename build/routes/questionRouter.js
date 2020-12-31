"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const questionController = require("../controllers/questionController");
const router = express_1.Router();
router.use(authController_1.protect);
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
exports.default = router;
