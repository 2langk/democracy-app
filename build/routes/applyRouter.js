"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const applyController = require("../controllers/applyController");
const multerConfig_1 = require("../utils/multerConfig");
const router = express_1.Router();
router.use('/', authController_1.protect);
router
    .route('/')
    .post(multerConfig_1.uploadApplyImages.array('images'), applyController.createApplication)
    .get(applyController.getAllApplications)
    .put(authController_1.restrictTo('admin'), applyController.openOrCloseBoard);
router
    .route('/:id')
    .get(applyController.getOneApplication)
    .post(authController_1.restrictTo('admin'), applyController.permitApplication)
    .delete(authController_1.restrictTo('admin'), applyController.deleteApplication);
exports.default = router;
