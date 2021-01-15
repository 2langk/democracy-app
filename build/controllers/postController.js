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
exports.deleteSubComment = exports.updateSubComment = exports.createSubComment = exports.deleteComment = exports.updateComment = exports.createComment = exports.deletePost = exports.updatePost = exports.getOnePost = exports.getAllPost = exports.createPost = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createPost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, category } = req.body;
    const { school, id } = req.user;
    if (['edu', 'notice'].includes(category) && req.user.role !== 'admin')
        return next(new AppError_1.default('Error: Permission Denied', 400));
    const uploads = req.files;
    let image = '';
    let video = '';
    if (uploads.images) {
        uploads.images.forEach((i) => {
            image += `${i.location.split('public/')[1]},`;
        });
    }
    if (uploads.video) {
        // eslint-disable-next-line prefer-destructuring
        video = uploads.video[0].location.split('public/')[1];
    }
    const newPost = yield models_1.Post.create({
        title,
        content,
        school,
        category,
        video,
        image,
        userId: id
    });
    if (!newPost)
        return next(new AppError_1.default('Error: Cannot create post', 400));
    res.status(201).json({
        status: 'success',
        newPost
    });
}));
exports.getAllPost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, category, searchParam, searchTerm } = req.query;
    const admin = yield models_1.User.findOne({
        where: { role: 'admin', school: req.user.school }
    });
    if (!admin)
        return next(new AppError_1.default('Error: 관리자 미확인. 등록되지 않은 학교입니다.', 400));
    let posts;
    if (searchTerm && searchParam) {
        posts = yield models_1.Post.findAll({
            where: {
                school: req.user.school,
                category,
                [searchParam]: {
                    [sequelize_1.Op.like]: `%${searchTerm}%`
                }
            },
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['name', 'photo', 'schoolClass']
                },
                {
                    model: models_1.Comment,
                    as: 'comment',
                    attributes: ['id']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10,
            offset: (+page - 1) * 10
        });
    }
    else {
        posts = yield models_1.Post.findAll({
            where: {
                school: req.user.school,
                category
            },
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['name', 'photo', 'schoolClass']
                },
                {
                    model: models_1.Comment,
                    as: 'comment',
                    attributes: ['id']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10,
            offset: (+page - 1) * 10
        });
    }
    posts = posts.map((post) => {
        const a = post.toJSON();
        a.commentCount = post.comment.length;
        a.comment = undefined;
        return a;
    });
    res.status(201).json({
        status: 'success',
        posts
    });
}));
exports.getOnePost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const admin = yield models_1.User.findOne({
        where: { role: 'admin', school: req.user.school }
    });
    if (!admin)
        return next(new AppError_1.default('Error: 등록되지 않은 학교입니다.', 400));
    const isAnonymous = admin.isVote;
    let post;
    post = yield models_1.Post.findByPk(req.params.id);
    if (isAnonymous || (post === null || post === void 0 ? void 0 : post.category) === 'debate') {
        post = yield models_1.Post.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Comment,
                    as: 'comment',
                    attributes: ['content', 'updatedAt'],
                    include: [
                        {
                            model: models_1.SubComment,
                            as: 'subComment',
                            attributes: ['content', 'updatedAt']
                        }
                    ]
                }
            ]
        });
    }
    else {
        post = yield models_1.Post.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['name', 'schoolClass', 'photo']
                },
                {
                    model: models_1.Comment,
                    as: 'comment',
                    attributes: ['content', 'updatedAt'],
                    include: [
                        {
                            model: models_1.User,
                            as: 'user',
                            attributes: ['name', 'schoolClass', 'photo']
                        },
                        {
                            model: models_1.SubComment,
                            as: 'subComment',
                            attributes: ['content', 'updatedAt'],
                            include: [
                                {
                                    model: models_1.User,
                                    as: 'user',
                                    attributes: ['name', 'schoolClass', 'photo']
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
    if (!post)
        return next(new AppError_1.default('Error: Cannot find post', 400));
    (_a = post === null || post === void 0 ? void 0 : post.comment) === null || _a === void 0 ? void 0 : _a.forEach((b) => {
        var _a;
        // eslint-disable-next-line no-param-reassign
        if ((_a = b.user) === null || _a === void 0 ? void 0 : _a.password) {
            b.user.password = undefined;
        }
    });
    post.viewCount += 1;
    yield post.save();
    post.image = post.image.split(',');
    post.image.pop();
    res.status(201).json({
        status: 'success',
        post
    });
}));
exports.updatePost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!title || !content)
        return next(new AppError_1.default('Error: please check title, content', 400));
    const uploads = req.files;
    let image = '';
    let video = '';
    if (uploads.images) {
        uploads.images.forEach((i) => {
            image += `${i.location.split('public/')[1]},`;
        });
    }
    if (uploads.video) {
        // eslint-disable-next-line prefer-destructuring
        video = uploads.video[0].location.split('public/')[1];
    }
    const post = yield models_1.Post.findByPk(req.params.id, {
        include: { model: models_1.User, as: 'user' }
    });
    if (!post || post.userId !== req.user.id)
        return next(new AppError_1.default('Error: permission Denied', 400));
    post.title = title;
    post.content = content;
    post.image = image === '' ? post.image : image;
    post.video = video === '' ? post.video : video;
    yield post.save();
    res.status(201).json({
        status: 'success',
        post
    });
}));
exports.deletePost = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.Post.findByPk(req.params.id);
    if (req.user.id !== (post === null || post === void 0 ? void 0 : post.userId))
        return next(new AppError_1.default('Error: permission Denied', 400));
    yield post.destroy();
    res.status(201).json({
        status: 'success'
    });
}));
exports.createComment = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (!content)
        return next(new AppError_1.default('Error: please pass your comment', 400));
    const newComment = yield models_1.Comment.create({
        content,
        postId: req.params.id,
        userId: req.user.id
    });
    res.status(201).json({
        status: 'success',
        newComment
    });
}));
exports.updateComment = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield models_1.Comment.findOne({
        where: { postId: req.params.postId, id: req.params.id }
    });
    if (!comment || comment.userId !== req.user.id)
        return next(new AppError_1.default('Error: Permission Denied', 400));
    comment.content = req.body.content || comment.content;
    yield comment.save();
    res.status(201).json({
        status: 'success',
        comment
    });
}));
exports.deleteComment = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield models_1.Comment.findOne({
        where: { postId: req.params.postId, id: req.params.id }
    });
    if (!comment || comment.userId !== req.user.id)
        return next(new AppError_1.default('Error: Permission Denied', 400));
    yield comment.destroy();
    res.status(201).json({
        status: 'success'
    });
}));
exports.createSubComment = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (!content)
        return next(new AppError_1.default('Error: please pass your comment', 400));
    const newSubComment = yield models_1.SubComment.create({
        content,
        commentId: req.params.id,
        userId: req.user.id
    });
    res.status(201).json({
        status: 'success',
        newSubComment
    });
}));
exports.updateSubComment = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (!content)
        return next(new AppError_1.default('Error: please pass your comment', 400));
    const subComment = yield models_1.SubComment.findByPk(req.params.id);
    if (!subComment || subComment.userId !== req.user.id)
        return next(new AppError_1.default('Error: Permisison Denied', 400));
    subComment.content = content;
    yield subComment.save();
    res.status(201).json({
        status: 'success',
        subComment
    });
}));
exports.deleteSubComment = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subComment = yield models_1.SubComment.findByPk(req.params.id);
    if (!subComment || subComment.userId !== req.user.id)
        return next(new AppError_1.default('Error: Permisison Denied', 400));
    yield subComment.destroy();
    res.status(201).json({
        status: 'success'
    });
}));
