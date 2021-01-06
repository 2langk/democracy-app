"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class EduPost extends sequelize_1.Model {
}
EduPost.init({
    userId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    video: {
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
    modelName: 'EduPost',
    tableName: 'eduPost',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    EduPost.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};
exports.associate = associate;
exports.default = EduPost;
