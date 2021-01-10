"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const applyController = require("../controllers/applyController");
const router = express_1.Router();
router.use('/', authController_1.protect);
router
    .route('/')
    .post(applyController.createApplication)
    .get(applyController.getAllApplications)
    .put(authController_1.restrictTo('admin'), applyController.openOrCloseBoard);
// only for admin
router.use(authController_1.restrictTo('admin'));
router
    .route('/:id')
    .post(applyController.permitApplication)
    .delete(applyController.deleteApplication);
exports.default = router;
