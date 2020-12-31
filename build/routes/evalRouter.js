"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const evalController = require("../controllers/evalController");
const router = express_1.Router();
router.use(authController_1.protect);
router
    .route('/')
    .get(evalController.getEvaluationAVG)
    .post(evalController.createEvaluation);
router
    .route('/:id')
    .get(evalController.getMyEvaluation)
    .patch(evalController.updateMyEvaluation);
exports.default = router;
