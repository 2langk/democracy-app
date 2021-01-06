"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const multerConfig_1 = require("../utils/multerConfig");
const eduController = require("../controllers/eduController");
const router = express_1.Router();
router
    .route('/')
    .get(eduController.getAllEduPost)
    .post(authController_1.protect, authController_1.restrictTo('admin'), multerConfig_1.uploadEduVideo.single('video'), eduController.createEduPost);
router.route('/:id').get(eduController.getOneEduPost);
router.use('/', authController_1.protect);
exports.default = router;
