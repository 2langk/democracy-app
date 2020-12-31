"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Answer extends sequelize_1.Model {
}
Answer.init({
    questionId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID
    },
    userId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Answer',
    tableName: 'answer',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    Answer.belongsTo(db.Question, { foreignKey: 'questionId', as: 'question' });
    Answer.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};
exports.associate = associate;
exports.default = Answer;
