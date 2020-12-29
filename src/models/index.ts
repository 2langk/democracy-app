import User, { associate as associateUser } from './User';
import Application, { associate as associateApplication } from './Application';
import Evalutation, { associate as associateEvalutation } from './Evalutation';
import Pledge, { associate as associatePledge } from './Pledge';
import PublicOpinion, { associate as associateOpinion } from './PublicOpinion';

import sequelize from './sequelize';

const db = {
	User,
	Application,
	Evalutation,
	Pledge,
	PublicOpinion
};

export type dbType = typeof db;

associateUser(db);
associateApplication(db);
associateEvalutation(db);
associatePledge(db);
associateOpinion(db);

export { sequelize };
export { User, Application, Evalutation, Pledge, PublicOpinion };
