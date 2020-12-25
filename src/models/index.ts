import User, { associate as associateUser } from './User';

export * from './sequelize';

const db = {
	User
};

export type dbType = typeof db;

associateUser(db);
