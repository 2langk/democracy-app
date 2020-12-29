import { Request, Response, NextFunction } from 'express';
import { Answer, Question, User } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createQuestion = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;

		const { school, id } = req.user!;

		const newQuestion = await Question.create({
			title,
			content,
			school,
			userId: id
		});

		if (!newQuestion) return new AppError('Error: create question', 400);

		res.status(201).json({
			status: 'success',
			data: {
				newQuestion
			}
		});
	}
);

export const getAllQuestion = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const questions = await Question.findAll({
			where: { school: req.user!.school }
		});

		res.status(201).json({
			status: 'success',
			data: {
				questions
			}
		});
	}
);

export const getOneQuestion = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const question = await Question.findByPk(req.params.id, {
			include: [
				{ model: User, as: 'user' },
				{
					model: Answer,
					as: 'answer',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			]
		});

		question?.answer?.forEach((a: Answer) => {
			// eslint-disable-next-line no-param-reassign
			a.user!.password = undefined;
		});

		res.status(201).json({
			status: 'success',
			data: {
				question
			}
		});
	}
);

export const updateQuestion = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;
		if (!title || !content)
			return next(new AppError('Error: please check title, content', 400));

		const question = await Question.findByPk(req.params.id, {
			include: { model: User, as: 'user' }
		});

		if (question!.userId !== req.user!.id)
			return next(new AppError('Error: permission Denied', 400));

		question!.title = title;
		question!.content = content;

		res.status(201).json({
			status: 'success',
			data: {
				question
			}
		});
	}
);

export const deleteQuestion = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const question = await Question.findByPk(req.params.id, {
			include: { model: User, as: 'user' }
		});

		res.status(201).json({
			status: 'success',
			data: {
				question
			}
		});
	}
);

export const createAnswer = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { content } = req.body;

		if (!content) next(new AppError('Error: please pass your answer', 400));

		const newAnswer = await Answer.create({
			content,
			questionId: req.params.id,
			userId: req.user!.id
		});

		res.status(201).json({
			status: 'success',
			data: {
				newAnswer
			}
		});
	}
);
