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
    .get(authController_1.restrictTo('admin'), applyController.getAllApplications);
// only for admin
router.use(authController_1.restrictTo('admin'));
router
    .route('/enrollment')
    .post(applyController.permitApplication)
    .delete(applyController.deleteApplication);
exports.default = router;
