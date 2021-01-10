"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Comment extends sequelize_1.Model {
}
Comment.init({
    postId: {
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
    modelName: 'Comment',
    tableName: 'comment',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });
    Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};
exports.associate = associate;
exports.default = Comment;
