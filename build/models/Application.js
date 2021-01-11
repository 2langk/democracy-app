"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Application extends sequelize_1.Model {
}
Application.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    school: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 8]
        }
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 20]
        }
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isConclude: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Application',
    tableName: 'application',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    Application.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};
exports.associate = associate;
exports.default = Application;
