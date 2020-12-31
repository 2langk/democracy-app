"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Question extends sequelize_1.Model {
}
Question.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    userId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    school: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 8]
        }
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Question',
    tableName: 'question',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    Question.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
    Question.hasMany(db.Answer, { foreignKey: 'questionId', as: 'answer' });
};
exports.associate = associate;
exports.default = Question;
