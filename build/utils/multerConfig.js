"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPostFile = exports.uploadEduVideo = exports.uploadUserPhoto = exports.uploadPostImages = exports.uploadPledgeImages = void 0;
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const AppError_1 = require("./AppError");
AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_S3_ID,
    secretAccessKey: process.env.AWS_S3_SECRET
});
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default('Please upload only images.', 400));
    }
};
const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default('Please upload only video.', 400));
    }
};
const videoOrImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video') || file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default('Please upload only video.', 400));
    }
};
// eslint-disable-next-line import/prefer-default-export
exports.uploadPledgeImages = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/image',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `pledgeImage-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
exports.uploadPostImages = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/image',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `postImage-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
exports.uploadUserPhoto = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/photo',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `userPhoto-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
exports.uploadEduVideo = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/video',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `eduVideo-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: videoFilter,
    limits: { fileSize: 100 * 1024 * 1024 }
});
exports.uploadPostFile = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/posts',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `Post-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: videoOrImageFilter,
    limits: { fileSize: 100 * 1024 * 1024 }
});
