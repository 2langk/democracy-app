"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPledgeImages = void 0;
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const AppError_1 = require("./AppError");
AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_S3_ID,
    secretAccessKey: process.env.AWS_S3_SECRET
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default('Please upload only images.', 400));
    }
};
// eslint-disable-next-line import/prefer-default-export
exports.uploadPledgeImages = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: '2langk-s3-bucket/democracy-app/public/image',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `${req.user.name}-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
