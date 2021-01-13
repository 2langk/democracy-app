"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Evalutation extends sequelize_1.Model {
}
Evalutation.init({
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
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            max: 10,
            min: 1
        }
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Evalutation',
    tableName: 'evalutation',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
const associate = (db) => {
    // eslint-disable-next-line prettier/prettier
    Evalutation.belongsTo(db.User, { foreignKey: 'presidentId', as: 'president' });
};
exports.associate = associate;
exports.default = Evalutation;
