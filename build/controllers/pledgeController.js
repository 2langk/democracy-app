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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.electPresident = exports.getResult = exports.voteReset = exports.openOrCloseVote = exports.deletePledge = exports.updatePledge = exports.voteToPledge = exports.getOnePledge = exports.getAllPledges = exports.createPledge = void 0;
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createPledge = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const files = req.files;
    let image = '';
    if (files) {
        files.forEach((file) => {
            image += `${file.key},`;
        });
    }
    if (!title || !content)
        return next(new AppError_1.default('ERROR: Cannot find title or content', 400));
    const newPledge = yield models_1.Pledge.create({
        title,
        content,
        image,
        school: req.user.school,
        candidateId: req.user.id
    });
    res.status(200).json({
        status: 'success',
        newPledge
    });
}));
exports.getAllPledges = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pledges = yield models_1.Pledge.findAll({
        where: { school: req.user.school },
        attributes: { exclude: ['id', 'voteCount'] }
    });
    res.status(200).json({
        status: 'success',
        data: {
            pledges
        }
    });
}));
exports.getOnePledge = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pledge = yield models_1.Pledge.findOne({
        where: { school: req.user.school, candidateId: req.params.id },
        include: { model: models_1.User, as: 'candidate' },
        attributes: { exclude: ['voteCount'] }
    });
    res.status(200).json({
        status: 'success',
        pledge
    });
}));
exports.voteToPledge = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isVote)
        return next(new AppError_1.default('ERROR: You can vote only one time', 400));
    const userPromise = models_1.User.findByPk(req.user.id);
    const pledgePromise = models_1.Pledge.findOne({
        where: { candidateId: req.params.id }
    });
    const [user, pledge] = yield Promise.all([userPromise, pledgePromise]);
    if (!user || !pledge || user.school !== pledge.school)
        return next(new AppError_1.default('ERROR: You can vote to your school', 400));
    if (!pledge.canVote)
        return next(new AppError_1.default('ERROR: This is not voting time', 400));
    user.isVote = true;
    pledge.voteCount += 1;
    yield Promise.all([user.save(), pledge.save()]).catch(() => next(new AppError_1.default('ERROR: VOTE, Please try again', 500)));
    res.status(200).json({
        status: 'success',
        isVote: user.isVote
    });
}));
exports.updatePledge = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.user)
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    const files = req.files;
    let image = '';
    if (files) {
        files.forEach((file) => {
            image += `${file.key},`;
        });
    }
    const pledge = yield models_1.Pledge.findOne({
        where: { candidateId: req.params.id },
        attributes: { exclude: ['voteCount'] }
    });
    if (!pledge || pledge.candidateId !== req.user.id)
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    pledge.title = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.title) || pledge.title;
    pledge.content = ((_b = req.body) === null || _b === void 0 ? void 0 : _b.content) || pledge.content;
    pledge.image = image || pledge.image;
    yield pledge.save();
    const _c = pledge.toJSON(), { id } = _c, update = __rest(_c, ["id"]);
    res.status(200).json({
        status: 'success',
        pledge: update
    });
}));
exports.deletePledge = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    const pledge = yield models_1.Pledge.findOne({
        where: { candidateId: req.params.id },
        attributes: { exclude: ['voteCount'] }
    });
    if (!pledge ||
        (pledge.candidateId !== req.user.id && req.user.role !== 'admin'))
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    yield pledge.destroy();
    res.status(200).json({
        status: 'success'
    });
}));
exports.openOrCloseVote = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== 'admin')
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    let pledges = yield models_1.Pledge.findAll({
        where: { school: req.user.school },
        attributes: { exclude: ['voteCount'] }
    });
    const pledgesPromise = pledges.map((pledge) => {
        // eslint-disable-next-line no-param-reassign
        pledge.canVote = !pledge.canVote;
        return pledge.save();
    });
    pledges = yield Promise.all(pledgesPromise);
    res.status(200).json({
        status: 'success',
        pledges
    });
}));
exports.voteReset = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== 'admin')
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    let pledges = yield models_1.Pledge.findAll({
        where: { school: req.user.school },
        attributes: { exclude: ['voteCount'] }
    });
    const pledgesPromise = pledges.map((pledge) => {
        // eslint-disable-next-line no-param-reassign
        pledge.canVote = false;
        // eslint-disable-next-line no-param-reassign
        pledge.voteCount = 0;
        return pledge.save();
    });
    pledges = yield Promise.all(pledgesPromise);
    res.status(200).json({
        status: 'success',
        pledges
    });
}));
exports.getResult = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pledges = yield models_1.Pledge.findAll({
        where: { school: req.user.school },
        include: {
            model: models_1.User,
            as: 'candidate',
            attributes: { exclude: ['password'] }
        }
    });
    const max = (yield models_1.Pledge.max('voteCount'));
    const winner = yield models_1.Pledge.findAll({
        where: { voteCount: max },
        attributes: ['candidateId']
    });
    res.status(200).json({
        status: 'success',
        pledges,
        winner
    });
}));
exports.electPresident = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { candidateId } = req.body;
    const president = yield models_1.User.findByPk(candidateId);
    if (!president || president.school !== req.user.school)
        return next(new AppError_1.default('ERROR: Permission denied', 400));
    president.role = 'president';
    yield president.save();
    res.status(200).json({
        status: 'success',
        president
    });
}));
