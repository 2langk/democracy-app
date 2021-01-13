"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerConfig_1 = require("../utils/multerConfig");
const authController = require("../controllers/authController");
const router = express_1.Router();
router
    .route('/register')
    .post(authController.registerForTeacher)
    .patch(multerConfig_1.uploadUserPhoto.single('photo'), authController.registerForStudent);
router.post('/login', authController.login);
router.use(authController.protect);
router.get('/logout', authController.logout);
router.use(authController.restrictTo('teacher'));
router.route('/teacher').get(authController.getAllStudent);
router.route('/teacher/:id').post(authController.authStudent);
exports.default = router;
