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
exports.updateMyEvaluation = exports.getMyEvaluation = exports.getEvaluationAVG = exports.createEvaluation = void 0;
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createEvaluation = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (!user)
        return next(new AppError_1.default('protect', 400));
    const president = yield models_1.User.findOne({ where: { school: user.school } });
    const newEval = yield models_1.Evalutation.create({
        presidentId: president.id,
        userId: user.id,
        school: user.school,
        rating: req.body.rating
    });
    newEval.id = undefined;
    res.status(201).json({
        status: 'success',
        data: {
            newEval
        }
    });
}));
exports.getEvaluationAVG = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluations = yield models_1.Evalutation.findAll({
        where: { school: req.user.school }
    });
    let ratingAVG = 0;
    evaluations.forEach((e) => {
        ratingAVG += e.rating;
    });
    ratingAVG /= evaluations.length;
    res.status(201).json({
        status: 'success',
        data: {
            ratingAVG
        }
    });
}));
exports.getMyEvaluation = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield models_1.Evalutation.findOne({
        where: { userId: req.user.id },
        attributes: { exclude: ['id'] }
    });
    res.status(201).json({
        status: 'success',
        data: {
            evaluation
        }
    });
}));
exports.updateMyEvaluation = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield models_1.Evalutation.findOne({
        where: { userId: req.user.id }
    });
    evaluation.rating = req.body.rating;
    yield evaluation.save();
    const _a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.toJSON(), { id } = _a, update = __rest(_a, ["id"]);
    res.status(201).json({
        status: 'success',
        data: {
            evaluation: update
        }
    });
}));
