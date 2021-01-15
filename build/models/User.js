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
        validate: {}
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'student',
        validate: {
            isIn: [['admin', 'teacher', 'president', 'candidate', 'student']]
        }
    },
    photo: {
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
    schoolClass: {
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
    },
    isAuth: {
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
        where: { isAuth: true },
        attributes: { exclude: ['password'] }
    },
    scopes: {
        withPassword: {
            attributes: { exclude: [] }
        },
        notAuth: {
            where: { isAuth: false },
            attributes: { exclude: ['password'] }
        }
    },
    indexes: [
        {
            unique: false,
            fields: ['school']
        }
    ]
});
User.beforeSave((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.changed('password')) {
        // eslint-disable-next-line no-param-reassign
        user.password = yield bcrypt.hash(user.password, 12);
    }
}));
// User.beforeCreate(async (user: User) => {
// 	if (user.changed('password')) {
// 		// eslint-disable-next-line no-param-reassign
// 		user.password = await bcrypt.hash(user.password!, 12);
// 	}
// });
const associate = (db) => {
    User.hasOne(db.Pledge, { foreignKey: 'candidateId', as: 'pledge' });
    User.hasOne(db.Application, { foreignKey: 'userId', as: 'application' });
    User.hasMany(db.Evalutation, { foreignKey: 'presidentId', as: 'evaluation' });
    User.hasMany(db.Post, { foreignKey: 'userId', as: 'post' });
    User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comment' });
    User.hasMany(db.SubComment, { foreignKey: 'userId', as: 'subComment' });
};
exports.associate = associate;
exports.default = User;
