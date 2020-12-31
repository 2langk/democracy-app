"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const bcrypt = require("bcryptjs");
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class User extends sequelize_1.Model {
    comparePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValid = yield bcrypt.compare(password, this.password);
            return isValid;
        });
    }
}
User.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 5]
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 20]
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['admin', 'president', 'council', 'candidate', 'user']]
        }
    },
    school: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 8]
        }
    },
    isVote: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'User',
    tableName: 'user',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    defaultScope: {
        attributes: { exclude: ['password'] }
    },
    scopes: {
        withPassword: {
            attributes: { exclude: [] }
        }
    }
});
User.beforeCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.changed('password')) {
        // eslint-disable-next-line no-param-reassign
        user.password = yield bcrypt.hash(user.password, 12);
    }
}));
const associate = (db) => {
    User.hasOne(db.Pledge, { foreignKey: 'candidateId', as: 'pledge' });
    User.hasOne(db.Application, { foreignKey: 'userId', as: 'application' });
    User.hasMany(db.Evalutation, { foreignKey: 'presidentId', as: 'evaluation' });
    // eslint-disable-next-line prettier/prettier
    User.hasMany(db.PublicOpinion, { foreignKey: 'candidateId', as: 'publicOpinion' });
    User.hasMany(db.Question, { foreignKey: 'userId', as: 'question' });
    User.hasMany(db.Answer, { foreignKey: 'userId', as: 'answer' });
};
exports.associate = associate;
exports.default = User;
