"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const pledgeController = require("../controllers/pledgeController");
const router = express_1.Router();
router.use(authController_1.protect);
router
    .route('/')
    .get(pledgeController.getAllPledges)
    .post(authController_1.restrictTo('candidate'), pledgeController.uploadImage, pledgeController.createPledge);
router
    .route('/admin')
    .get(authController_1.restrictTo('admin'), pledgeController.getResult)
    .post(authController_1.restrictTo('admin'), pledgeController.electPresident);
router
    .route('/:id')
    .get(pledgeController.getOnePledge)
    .post(pledgeController.voteToPledge) // for every user(same school)
    .patch(authController_1.restrictTo('candidate', 'admin'), pledgeController.uploadImage, pledgeController.updatePledge)
    .delete(authController_1.restrictTo('candidate', 'admin'), pledgeController.deletePledge);
exports.default = router;
