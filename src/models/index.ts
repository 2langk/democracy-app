import User, { associate as associateUser } from './User';
import Application, { associate as associateApplication } from './Application';
import Evalutation, { associate as associateEvalutation } from './Evalutation';
import Pledge, { associate as associatePledge } from './Pledge';
import PublicOpinion, { associate as associateOpinion } from './PublicOpinion';
import Question, { associate as associateQuestion } from './Question';
import Answer, { associate as associateAnswer } from './Answer';

import sequelize from './sequelize';

const db = {
	User,
	Application,
	Evalutation,
	Pledge,
	PublicOpinion,
	Question,
	Answer
};

export type dbType = typeof db;

associateUser(db);
associateApplication(db);
associateEvalutation(db);
associatePledge(db);
associateOpinion(db);
associateQuestion(db);
associateAnswer(db);

export {
	sequelize,
	User,
	Application,
	Evalutation,
	Pledge,
	PublicOpinion,
	Question,
	Answer
};
