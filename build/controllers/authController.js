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
exports.authStudent = exports.getAllStudent = exports.restrictTo = exports.logout = exports.protect = exports.login = exports.registerForStudent = exports.registerForTeacher = void 0;
const jwt = require("jsonwebtoken");
const axios_1 = require("axios");
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.registerForTeacher = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, school, schoolCode, schoolClass } = req.body;
    const result = yield axios_1.default.get('http://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=aa3d3a5f6bd1d9de0b6c146efa360489&svcType=api&svcCode=SCHOOL&contentType=json&gubun=high_list&perPage=2500');
    const match = result.data.dataSearch.content.find((s) => {
        return s.schoolName === `${school}등학교`;
    });
    if (!match || match.seq !== schoolCode) {
        return next(new AppError_1.default('ERROR: Cannot find school!', 400));
    }
    const newUser = yield models_1.User.create({
        name,
        email,
        password,
        school,
        role: 'teacher',
        schoolClass,
        isVote: 'true',
        isAuth: 'true',
        photo: 'default'
    });
    if (!newUser)
        return next(new AppError_1.default('ERROR: Cannot create user', 400));
    newUser.password = undefined;
    res.status(201).json({
        status: 'success',
        newUser
    });
}));
exports.registerForStudent = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, email, password, school, schoolClass } = req.body;
    const photo = (_b = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.split('public/')[1];
    if (!photo)
        return next(new AppError_1.default('ERROR: Please send photo!', 400));
    const result = yield axios_1.default.get('http://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=aa3d3a5f6bd1d9de0b6c146efa360489&svcType=api&svcCode=SCHOOL&contentType=json&gubun=high_list&perPage=2500');
    const match = result.data.dataSearch.content.find((s) => {
        return s.schoolName === `${req.body.school}등학교`;
    });
    if (!match) {
        return next(new AppError_1.default('ERROR: Cannot find school!', 400));
    }
    const newUser = yield models_1.User.create({
        name,
        email,
        password,
        school,
        schoolClass,
        photo
    });
    if (!newUser)
        return next(new AppError_1.default('ERROR: Cannot create user', 400));
    newUser.password = undefined;
    res.status(201).json({
        status: 'success',
        newUser
    });
}));
exports.login = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield models_1.User.scope('withPassword').findOne({
        where: { email }
    });
    if (!user || !user.isAuth)
        return next(new AppError_1.default('ERROR: Cannot find user or not auth ', 400));
    // Password is Not valid.
    if (!(yield user.comparePassword(password)))
        return next(new AppError_1.default('ERROR: Cannot find user.', 400));
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    // const expire =
    // 	((process.env.JWT_COOKIE_EXPIRES_IN as unknown) as number) || 1;
    // const cookieOptions = {
    // 	expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
    // 	httpOnly: true
    // 	// secure: process.env.NODE_ENV === 'production'
    // };
    user.password = undefined;
    // res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        status: 'success',
        user,
        token
    });
}));
exports.protect = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        // eslint-disable-next-line prefer-destructuring
        token = req.headers.authorization.split('Bearer ')[1] || req.cookies.jwt;
    }
    if (!token)
        return next(new AppError_1.default('ERROR: Please Login', 400));
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = yield models_1.User.findByPk(decode.id);
    if (!currentUser || !currentUser.isAuth)
        return next(new AppError_1.default('ERROR: 미인증된 사용자입니다.', 400));
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
        expiresIn: '2s'
    });
    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
        // secure: process.env.NODE_ENV === 'production'
    };
    res.cookie('jwt', 'hi', cookieOptions);
    res.status(200).json({
        status: 'success',
        token
    });
}));
const restrictTo = (...roles) => (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role))
        return next(new AppError_1.default(`ERROR: Permission denied. This is only for ${roles}`, 400));
    next();
};
exports.restrictTo = restrictTo;
exports.getAllStudent = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = req.user;
    const students = yield models_1.User.scope('notAuth').findAll({
        where: { school: teacher.school, schoolClass: teacher.schoolClass }
    });
    res.status(200).json({
        status: 'success',
        students
    });
}));
exports.authStudent = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = req.user;
    const student = yield models_1.User.scope('notAuth').findOne({
        where: {
            school: teacher.school,
            schoolClass: teacher.schoolClass,
            id: req.params.id
        }
    });
    if (!student)
        return next(new AppError_1.default(`ERROR: Permission denied.`, 400));
    student.isAuth = true;
    student.photo = 'default';
    yield student.save();
    // const email = new Email(student);
    // await email.sendWelcome();
    res.status(200).json({
        status: 'success',
        student
    });
}));
