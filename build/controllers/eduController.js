"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneEduPost = exports.getAllEduPost = exports.createEduPost = void 0;
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createEduPost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { title, content } = req.body;
    if (!user || user.role !== 'admin')
        return next(new AppError_1.default('ERROR: Permission Denied.', 400));
    let video = '';
    if (req.file) {
        // eslint-disable-next-line prefer-destructuring
        video = req.file.location.split('public/')[1];
    }
    const newEduPost = yield models_1.EduPost.create({
        title,
        video,
        content,
        userId: user.id,
        school: user.school
    });
    res.status(201).json({
        status: 'success',
        newEduPost
    });
}));
exports.getAllEduPost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const eduPosts = yield models_1.EduPost.findAll({});
    res.status(201).json({
        status: 'success',
        eduPosts
    });
}));
exports.getOneEduPost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const eduPost = yield models_1.EduPost.findOne({ where: { id: req.params.id } });
    res.status(201).json({
        status: 'success',
        eduPost
    });
}));
