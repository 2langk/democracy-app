import { Request, Response, NextFunction } from 'express';
import { User, Application } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createApplication = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title } = req.body;
		const { user } = req;

		if (!user || !title)
			return next(new AppError('Cannot find user or title', 400));

		const newApply = await Application.create({
			userId: user.id,
			school: user.school,
			title
		});

		res.status(201).json({
			status: 'success',
			data: {
				newApply
			}
		});
	}
);

// only for admin
export const getAllApplications = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = req.user;

		if (!admin || admin.role !== 'admin')
			return next(new AppError('This is only for admin', 400));

		const applications = await Application.findAll({
			where: { school: admin.school },
			attributes: { exclude: ['id'] }
		});

		res.status(201).json({
			status: 'success',
			data: {
				applications
			}
		});
	}
);

export const permitEnrollment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = req.user;
		const { permission, userId } = req.body as {
			permission: boolean;
			userId: string;
		};

		if (!admin || admin.role !== 'admin')
			return next(new AppError('This is only for admin', 400));

		const userPromise = User.findByPk(userId);
		const applicationPromise = Application.findOne({
			where: { userId }
		});

		const [user, application] = await Promise.all([
			userPromise,
			applicationPromise
		]);

		if (
			!user ||
			!application ||
			user.school !== admin.school ||
			application.isConclude === true
		)
			return next(new AppError('ERROR: Permission Denied', 400));

		if (permission) {
			user.role = 'candidate';
		}
		application.isConclude = true;

		await Promise.all([user.save(), application.save()]);

		res.status(201).json({
			status: 'success',
			data: {
				user
			}
		});
	}
);
