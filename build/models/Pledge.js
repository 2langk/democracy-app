"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Pledge extends sequelize_1.Model {
}
Pledge.init({
    candidateId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {}
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {}
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
    canVote: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    voteCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Pledge',
    tableName: 'pledge',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
        {
            unique: false,
            fields: ['school']
        }
    ]
});
const associate = (db) => {
    Pledge.belongsTo(db.User, { foreignKey: 'candidateId', as: 'candidate' });
};
exports.associate = associate;
exports.default = Pledge;
