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
exports.login2 = exports.restrictTo = exports.logout = exports.protect = exports.login = exports.register = void 0;
const jwt = require("jsonwebtoken");
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.register = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, school } = req.body;
    const newUser = yield models_1.User.create({ name, email, password, school });
    if (!newUser)
        return next(new AppError_1.default('ERROR: Cannot create user', 400));
    delete newUser.password;
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    });
}));
exports.login = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield models_1.User.scope('withPassword').findOne({
        where: { email }
    });
    if (!user)
        return next(new AppError_1.default('ERROR: Cannot find user.', 400));
    // Password is Not valid.
    if (!(yield user.comparePassword(password)))
        return next(new AppError_1.default('ERROR: Cannot find user.', 400));
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const expire = process.env.JWT_COOKIE_EXPIRES_IN || 1;
    const cookieOptions = {
        expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
}));
exports.protect = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.jwt)
        return next(new AppError_1.default('ERROR: Please Login', 400));
    const token = req.cookies.jwt;
    if (!token)
        return next(new AppError_1.default('ERROR: Please Login', 400));
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = yield models_1.User.findByPk(decode.id);
    if (!currentUser)
        return next(new AppError_1.default('ERROR: Please Login', 400));
    // if (currentUser.isChangePassword(iat)) {
    // 	return next(new AppError('ERROR: password changed.', 401));
    // }
    req.user = currentUser.toJSON();
    next();
}));
exports.logout = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (!user)
        return next(new AppError_1.default('ERROR: Cannot find user.', 400));
    const token = jwt.sign({ logout: 'logout' }, process.env.JWT_SECRET, {
        expiresIn: '1s'
    });
    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        status: 'success'
    });
}));
const restrictTo = (...roles) => (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role))
        return next(new AppError_1.default(`ERROR: Permission denied. This is only for ${roles}`, 400));
    next();
};
exports.restrictTo = restrictTo;
exports.login2 = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.scope('withPassword').findOne();
    if (!user)
        return next(new AppError_1.default('ERROR: Cannot find user.', 400));
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const expire = process.env.JWT_COOKIE_EXPIRES_IN || 1;
    const cookieOptions = {
        expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        status: 'success',
        data: {}
    });
}));
