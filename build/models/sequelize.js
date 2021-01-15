"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const sequelize_1 = require("sequelize");
const redis_1 = require("redis");
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
exports.redisClient = redis_1.createClient({
    host: 
    // process.env.NODE_ENV === 'production'
    // 	? 'host.docker.internal'
    '127.0.0.1',
    port: 6379
});
