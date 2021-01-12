import { Sequelize } from 'sequelize';
import { createClient as redisCreateClient } from 'redis';

import * as dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const DB = process.env.DB_DATABASE || 'test';
const USER = process.env.DB_USERNAME || 'root';
const PASSWORD = process.env.DB_PASSWORD || 'root';
const HOST = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(DB, USER, PASSWORD, {
	host: HOST,
	dialect: 'mysql',
	logging: false
});

export default sequelize;

export const redisClient = redisCreateClient({
	host: '127.0.0.1',
	port: 6379
});
