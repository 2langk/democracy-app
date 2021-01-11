"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Post extends sequelize_1.Model {
}
Post.init({
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
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['debate', 'edu']]
        }
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
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'no'
    },
    video: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'no'
    },
    viewCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Post',
    tableName: 'post',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
    Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comment' });
};
exports.associate = associate;
exports.default = Post;
