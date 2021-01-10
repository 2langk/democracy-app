"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubComment = exports.Comment = exports.Post = exports.Pledge = exports.Evalutation = exports.Application = exports.User = exports.sequelize = void 0;
const User_1 = require("./User");
exports.User = User_1.default;
const Application_1 = require("./Application");
exports.Application = Application_1.default;
const Evalutation_1 = require("./Evalutation");
exports.Evalutation = Evalutation_1.default;
const Pledge_1 = require("./Pledge");
exports.Pledge = Pledge_1.default;
const Post_1 = require("./Post");
exports.Post = Post_1.default;
const Comment_1 = require("./Comment");
exports.Comment = Comment_1.default;
const SubComment_1 = require("./SubComment");
exports.SubComment = SubComment_1.default;
const sequelize_1 = require("./sequelize");
exports.sequelize = sequelize_1.default;
const db = {
    User: User_1.default,
    Application: Application_1.default,
    Evalutation: Evalutation_1.default,
    Pledge: Pledge_1.default,
    Post: Post_1.default,
    Comment: Comment_1.default,
    SubComment: SubComment_1.default
};
User_1.associate(db);
Application_1.associate(db);
Evalutation_1.associate(db);
Pledge_1.associate(db);
Post_1.associate(db);
Comment_1.associate(db);
SubComment_1.associate(db);
