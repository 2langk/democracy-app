import { Request, Response, NextFunction } from 'express';
import { User, Application } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const getCurrentUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User;

		res.status(201).json({
			status: 'success',
			user
		});
	}
);

export const getOneUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title } = req.body;
		const { user } = req;
		const admin = await User.findOne({ where: { role: 'admin' } });

		if (!admin || admin.schoolClass !== 'open') {
			return next(new AppError('Error: Permission Denied', 400));
		}
		if (!user || !title)
			return next(new AppError('Cannot find user or title', 400));

		const newApply = await Application.create({
			userId: user.id,
			school: user.school,
			title
		});

		res.status(201).json({
			status: 'success',
			newApply
		});
	}
);

export const changePassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const me = req.user as User;
		const user = await User.scope('withPassword').findByPk(req.params.id);

		if (!user || user.id !== me.id)
			return next(new AppError('Cannot change password', 400));

		user.password = req.body.password;

		await user.save();

		res.status(201).json({
			status: 'success',
			user
		});
	}
);

export const updateUserInfo = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User;

		res.status(201).json({
			status: 'success',
			user
		});
	}
);

export const deleteUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User;

		res.status(201).json({
			status: 'success',
			user
		});
	}
);
