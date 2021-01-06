"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEduVideo = exports.uploadUserPhoto = exports.uploadPledgeImages = void 0;
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
// eslint-disable-next-line import/prefer-default-export
exports.uploadPledgeImages = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/image',
        acl: 'public-read',
        key(req, file, cb) {
            console.log(file);
            console.log(req.user);
            cb(null, `pledgeImage-${req.user.name}-${Date.now()}.${file.mimetype.split('/')[1]}`);
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
            var _a;
            cb(null, `userPhoto-${((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || 'auth'}-${Date.now()}.${file.mimetype.split('/')[1]}`);
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
            cb(null, `eduVideo-${req.user.name}-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: videoFilter,
    limits: { fileSize: 100 * 1024 * 1024 }
});
