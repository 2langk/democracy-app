import { Request, Response, NextFunction } from 'express';
import { User, EduPost } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createEduPost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { user } = req;
		const { title, content } = req.body;

		if (!user || user!.role !== 'admin')
			return next(new AppError('ERROR: Permission Denied.', 400));

		const video = req.file.key;

		const newEduPost = await EduPost.create({
			title,
			video,
			content,
			userId: user.id,
			school: user.school
		});

		res.status(201).json({
			status: 'success',
			newEduPost
		});
	}
);

export const getAllEduPost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const eduPosts = await EduPost.findAll({});

		res.status(201).json({
			status: 'success',
			eduPosts
		});
	}
);

export const getOneEduPost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const eduPost = await EduPost.findOne({ where: { id: req.params.id } });

		res.status(201).json({
			status: 'success',
			eduPost
		});
	}
);
