"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class SubComment extends sequelize_1.Model {
}
SubComment.init({
    commentId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER
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
    modelName: 'SubComment',
    tableName: 'subComment',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    SubComment.belongsTo(db.Comment, { foreignKey: 'commentId', as: 'comment' });
    SubComment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};
exports.associate = associate;
exports.default = SubComment;
