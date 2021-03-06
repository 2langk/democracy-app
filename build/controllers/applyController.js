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
exports.deleteApplication = exports.permitApplication = exports.getOneApplication = exports.getAllApplications = exports.openOrCloseBoard = exports.createApplication = void 0;
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createApplication = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const { user } = req;
    const admin = yield models_1.User.findOne({ where: { role: 'admin' } });
    if (!admin || admin.schoolClass !== 'open') {
        return next(new AppError_1.default('Error: 입후보 신청 기간이 아닙니다.', 400));
    }
    if (!user || !title)
        return next(new AppError_1.default('Error: 잘못된 접근입니다.', 400));
    let image = '';
    const upload = req.files;
    upload.forEach((file) => {
        image += `${file.location.split('public/')[1]},`;
    });
    const newApply = yield models_1.Application.create({
        userId: user.id,
        school: user.school,
        title,
        content,
        image
    });
    res.status(201).json({
        status: 'success',
        newApply
    });
}));
exports.openOrCloseBoard = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield models_1.User.findOne({ where: { id: req.user.id } });
    if (!admin || admin.role !== 'admin') {
        return next(new AppError_1.default('Error: Permission Denied', 400));
    }
    admin.schoolClass = admin.schoolClass === 'open' ? 'close' : 'open';
    yield admin.save();
    res.status(201).json({
        status: 'success',
        isOpen: admin.schoolClass
    });
}));
exports.getAllApplications = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const applications = yield models_1.Application.findAll({
        where: { school: (_a = req.user) === null || _a === void 0 ? void 0 : _a.school },
        attributes: { exclude: ['id'] },
        include: {
            model: models_1.User,
            as: 'user',
            attributes: ['id', 'name', 'photo', 'school']
        }
    });
    res.status(201).json({
        status: 'success',
        applications
    });
}));
// only for admin
exports.getOneApplication = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const application = yield models_1.Application.findOne({
        where: { school: (_b = req.user) === null || _b === void 0 ? void 0 : _b.school, userId: req.params.id },
        include: {
            model: models_1.User,
            as: 'user',
            attributes: ['name', 'school', 'photo']
        },
        attributes: { exclude: ['id'] }
    });
    if (!application) {
        return next(new AppError_1.default('cannot find app', 400));
    }
    const image = application.image.split(',');
    image.pop();
    application.image = image;
    res.status(201).json({
        status: 'success',
        application
    });
}));
exports.permitApplication = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user;
    const { permission } = req.body;
    if (!admin || admin.role !== 'admin')
        return next(new AppError_1.default('This is only for admin', 400));
    const userPromise = models_1.User.findByPk(req.params.id);
    const applicationPromise = models_1.Application.findOne({
        where: { userId: req.params.id }
    });
    const [user, application] = yield Promise.all([
        userPromise,
        applicationPromise
    ]);
    if (!user ||
        !application ||
        user.school !== admin.school ||
        application.isConclude === true)
        return next(new AppError_1.default('ERROR: Permission Denied', 400));
    if (permission) {
        user.role = 'candidate';
    }
    application.isConclude = true;
    yield Promise.all([user.save(), application.save()]);
    res.status(201).json({
        status: 'success',
        user
    });
}));
exports.deleteApplication = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user;
    if (!admin || admin.role !== 'admin')
        return next(new AppError_1.default('This is only for admin', 400));
    const userPromise = models_1.User.findByPk(req.params.id);
    const applicationPromise = models_1.Application.findOne({
        where: { userId: req.params.id }
    });
    const [user, application] = yield Promise.all([
        userPromise,
        applicationPromise
    ]);
    if (!user || !application || user.school !== admin.school)
        return next(new AppError_1.default('Error: Permission Denied', 400));
    yield application.destroy();
    res.status(201).json({
        status: 'success'
    });
}));
