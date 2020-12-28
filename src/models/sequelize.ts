import { Sequelize } from 'sequelize';
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
