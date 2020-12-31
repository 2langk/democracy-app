"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = exports.Question = exports.PublicOpinion = exports.Pledge = exports.Evalutation = exports.Application = exports.User = exports.sequelize = void 0;
const User_1 = require("./User");
exports.User = User_1.default;
const Application_1 = require("./Application");
exports.Application = Application_1.default;
const Evalutation_1 = require("./Evalutation");
exports.Evalutation = Evalutation_1.default;
const Pledge_1 = require("./Pledge");
exports.Pledge = Pledge_1.default;
const PublicOpinion_1 = require("./PublicOpinion");
exports.PublicOpinion = PublicOpinion_1.default;
const Question_1 = require("./Question");
exports.Question = Question_1.default;
const Answer_1 = require("./Answer");
exports.Answer = Answer_1.default;
const sequelize_1 = require("./sequelize");
exports.sequelize = sequelize_1.default;
const db = {
    User: User_1.default,
    Application: Application_1.default,
    Evalutation: Evalutation_1.default,
    Pledge: Pledge_1.default,
    PublicOpinion: PublicOpinion_1.default,
    Question: Question_1.default,
    Answer: Answer_1.default
};
User_1.associate(db);
Application_1.associate(db);
Evalutation_1.associate(db);
Pledge_1.associate(db);
PublicOpinion_1.associate(db);
Question_1.associate(db);
Answer_1.associate(db);
