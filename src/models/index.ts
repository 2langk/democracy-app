import User, { associate as associateUser } from './User';
import Application, { associate as associateApplication } from './Application';
import Evalutation, { associate as associateEvalutation } from './Evalutation';
import Pledge, { associate as associatePledge } from './Pledge';
import Post, { associate as associatePost } from './Post';
import Comment, { associate as associateComment } from './Comment';
import SubComment, { associate as associateSubComment } from './SubComment';

import sequelize from './sequelize';

const db = {
	User,
	Application,
	Evalutation,
	Pledge,
	Post,
	Comment,
	SubComment
};

export type dbType = typeof db;

associateUser(db);
associateApplication(db);
associateEvalutation(db);
associatePledge(db);
associatePost(db);
associateComment(db);
associateSubComment(db);

export {
	sequelize,
	User,
	Application,
	Evalutation,
	Pledge,
	Post,
	Comment,
	SubComment
};
