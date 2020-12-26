import User, { associate as associateUser } from './User';

import sequelize from './sequelize';

const db = {
	User
};

export type dbType = typeof db;

associateUser(db);

export default sequelize;
