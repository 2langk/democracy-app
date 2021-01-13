"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express_1.Router();
router.use(authController_1.protect);
router.route('/').get(userController.getCurrentUser);
router
    .route('/:id')
    .get(userController.getOneUser)
    .post(userController.changePassword)
    .patch(userController.updateUserInfo)
    .delete(userController.deleteUser);
exports.default = router;
