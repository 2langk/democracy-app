"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const DB = process.env.DB_DATABASE || 'test';
const USER = process.env.DB_USERNAME || 'root';
const PASSWORD = process.env.DB_PASSWORD || 'root';
const HOST = process.env.DB_HOST || 'localhost';
const sequelize = new sequelize_1.Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: 'mysql',
    logging: false
});
exports.default = sequelize;
