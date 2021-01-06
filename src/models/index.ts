import User, { associate as associateUser } from './User';
import Application, { associate as associateApplication } from './Application';
import Evalutation, { associate as associateEvalutation } from './Evalutation';
import Pledge, { associate as associatePledge } from './Pledge';
import Question, { associate as associateQuestion } from './Question';
import Answer, { associate as associateAnswer } from './Answer';
import EduPost, { associate as associateEduPost } from './EduPost';

import sequelize from './sequelize';

const db = {
	User,
	Application,
	Evalutation,
	Pledge,
	Question,
	Answer,
	EduPost
};

export type dbType = typeof db;

associateUser(db);
associateApplication(db);
associateEvalutation(db);
associatePledge(db);
associateQuestion(db);
associateAnswer(db);
associateEduPost(db);

export {
	sequelize,
	User,
	Application,
	Evalutation,
	Pledge,
	Question,
	Answer,
	EduPost
};
