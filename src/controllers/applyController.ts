import { Request, Response, NextFunction } from 'express';
import { User, Application } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createApplication = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title } = req.body;
		const { user } = req;
		const admin = await User.findOne({ where: { role: 'admin' } });

		if (!admin || admin.schoolClass !== 'open') {
			return next(new AppError('Error: 입후보 신청 기간이 아닙니다.', 400));
		}
		if (!user || !title)
			return next(new AppError('Error: 잘못된 접근입니다.', 400));

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

export const openOrCloseBoard = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = await User.findOne({ where: { id: req.user!.id } });

		if (!admin || admin.role !== 'admin') {
			return next(new AppError('Error: Permission Denied', 400));
		}

		admin.schoolClass = admin.schoolClass === 'open' ? 'close' : 'open';

		await admin.save();

		res.status(201).json({
			status: 'success',
			isOpen: admin.schoolClass
		});
	}
);

// only for admin
export const getAllApplications = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const applications = await Application.findAll({
			where: { school: req.user?.school },
			attributes: { exclude: ['id'] }
		});

		res.status(201).json({
			status: 'success',
			applications
		});
	}
);

export const permitApplication = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = req.user;
		const { permission } = req.body as {
			permission: boolean;
		};

		if (!admin || admin.role !== 'admin')
			return next(new AppError('This is only for admin', 400));

		const userPromise = User.findByPk(req.params.id);
		const applicationPromise = Application.findOne({
			where: { userId: req.params.id }
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
			user
		});
	}
);

export const deleteApplication = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = req.user;

		if (!admin || admin.role !== 'admin')
			return next(new AppError('This is only for admin', 400));

		const userPromise = User.findByPk(req.params.id);
		const applicationPromise = Application.findOne({
			where: { userId: req.params.id }
		});

		const [user, application] = await Promise.all([
			userPromise,
			applicationPromise
		]);

		if (!user || !application || user.school !== admin.school)
			return next(new AppError('Error: Permission Denied', 400));

		await application.destroy();

		res.status(201).json({
			status: 'success'
		});
	}
);
