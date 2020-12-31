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
exports.deleteAnswer = exports.updateAnswer = exports.createAnswer = exports.deleteQuestion = exports.updateQuestion = exports.getOneQuestion = exports.getAllQuestion = exports.createQuestion = void 0;
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createQuestion = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const { school, id } = req.user;
    const newQuestion = yield models_1.Question.create({
        title,
        content,
        school,
        userId: id
    });
    if (!newQuestion)
        return new AppError_1.default('Error: create question', 400);
    res.status(201).json({
        status: 'success',
        data: {
            newQuestion
        }
    });
}));
exports.getAllQuestion = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield models_1.Question.findAll({
        where: { school: req.user.school }
    });
    res.status(201).json({
        status: 'success',
        data: {
            questions
        }
    });
}));
exports.getOneQuestion = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const question = yield models_1.Question.findByPk(req.params.id, {
        include: [
            { model: models_1.User, as: 'user' },
            {
                model: models_1.Answer,
                as: 'answer',
                include: [
                    {
                        model: models_1.User,
                        as: 'user'
                    }
                ]
            }
        ]
    });
    (_a = question === null || question === void 0 ? void 0 : question.answer) === null || _a === void 0 ? void 0 : _a.forEach((a) => {
        // eslint-disable-next-line no-param-reassign
        a.user.password = undefined;
    });
    res.status(201).json({
        status: 'success',
        data: {
            question
        }
    });
}));
exports.updateQuestion = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!title || !content)
        return next(new AppError_1.default('Error: please check title, content', 400));
    const question = yield models_1.Question.findByPk(req.params.id, {
        include: { model: models_1.User, as: 'user' }
    });
    if (question.userId !== req.user.id)
        return next(new AppError_1.default('Error: permission Denied', 400));
    question.title = title;
    question.content = content;
    res.status(201).json({
        status: 'success',
        data: {
            question
        }
    });
}));
exports.deleteQuestion = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield models_1.Question.findByPk(req.params.id);
    if (req.user.id !== (question === null || question === void 0 ? void 0 : question.userId))
        return next(new AppError_1.default('Error: permission Denied', 400));
    yield question.destroy();
    res.status(201).json({
        status: 'success',
        data: {}
    });
}));
exports.createAnswer = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (!content)
        return next(new AppError_1.default('Error: please pass your answer', 400));
    const newAnswer = yield models_1.Answer.create({
        content,
        questionId: req.params.id,
        userId: req.user.id
    });
    res.status(201).json({
        status: 'success',
        data: {
            newAnswer
        }
    });
}));
exports.updateAnswer = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield models_1.Answer.findOne({
        where: { questionId: req.params.questionId, id: req.params.id }
    });
    if (!answer || answer.userId !== req.user.id)
        return next(new AppError_1.default('Error: Permission Denied', 400));
    answer.content = req.body.content || answer.content;
    yield answer.save();
    res.status(201).json({
        status: 'success',
        data: {
            answer
        }
    });
}));
exports.deleteAnswer = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield models_1.Answer.findOne({
        where: { questionId: req.params.questionId, id: req.params.id }
    });
    if (!answer || answer.userId !== req.user.id)
        return next(new AppError_1.default('Error: Permission Denied', 400));
    yield answer.destroy();
    res.status(201).json({
        status: 'success',
        data: {}
    });
}));
