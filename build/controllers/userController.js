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
exports.deleteUser = exports.updateUserInfo = exports.changePassword = exports.getOneUser = exports.getCurrentUser = void 0;
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.getCurrentUser = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(201).json({
        status: 'success',
        user
    });
}));
exports.getOneUser = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const { user } = req;
    const admin = yield models_1.User.findOne({ where: { role: 'admin' } });
    if (!admin || admin.schoolClass !== 'open') {
        return next(new AppError_1.default('Error: Permission Denied', 400));
    }
    if (!user || !title)
        return next(new AppError_1.default('Cannot find user or title', 400));
    const newApply = yield models_1.Application.create({
        userId: user.id,
        school: user.school,
        title
    });
    res.status(201).json({
        status: 'success',
        newApply
    });
}));
exports.changePassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const me = req.user;
    const user = yield models_1.User.scope('withPassword').findByPk(req.params.id);
    if (!user || user.id !== me.id)
        return next(new AppError_1.default('Cannot change password', 400));
    user.password = req.body.password;
    yield user.save();
    res.status(201).json({
        status: 'success',
        user
    });
}));
exports.updateUserInfo = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(201).json({
        status: 'success',
        user
    });
}));
exports.deleteUser = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(201).json({
        status: 'success',
        user
    });
}));
