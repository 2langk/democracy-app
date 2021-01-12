import { Request, Response, NextFunction } from 'express';
import { Pledge, User, Redis } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createPledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;

		const files = req.files as Array<any>;

		let image = '';
		if (files) {
			files.forEach((file) => {
				image += `${file.location.split('public/')[1]},`;
			});
		}

		if (!title || !content)
			return next(new AppError('ERROR: Cannot find title or content', 400));

		const newPledge = await Pledge.create({
			title,
			content,
			image,
			school: req.user!.school,
			candidateId: req.user!.id
		});

		if (await Redis.getCache(req.user!.school)) {
			Redis.deleteCache(req.user!.school);
		}

		res.status(200).json({
			status: 'success',
			newPledge
		});
	}
);

export const getAllPledges = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const cache = await Redis.getCache(req.user!.school);

		if (cache) {
			return res.status(200).json({
				status: 'success',
				pledges: JSON.parse(cache),
				isCache: true
			});
		}

		const pledges = await Pledge.findAll({
			where: { school: req.user!.school },
			attributes: { exclude: ['image', 'canVote', 'voteCount', 'content'] },
			include: {
				model: User,
				as: 'candidate',
				attributes: ['name', 'photo', 'school']
			}
		});

		await Redis.setCache(req.user!.school, 100, JSON.stringify(pledges));

		res.status(200).json({
			status: 'success',
			pledges
		});
	}
);

export const getOnePledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		let cache: string | Pledge | null = await Redis.getCache(req.params.id);

		if (cache) {
			cache = JSON.parse(cache as string) as Pledge;

			if (cache.school !== req.user!.school)
				return next(new AppError('Error: Permisison Denied!', 400));

			return res.status(200).json({
				status: 'success',
				pledge: cache,
				isCache: true
			});
		}

		const pledge = await Pledge.findOne({
			where: { school: req.user!.school, candidateId: req.params.id },
			include: { model: User, as: 'candidate' },
			attributes: { exclude: ['voteCount'] }
		});

		if (!pledge) return next(new AppError('ERROR: Cannot find pledge', 400));

		pledge.image = (pledge.image as string).split(',');

		pledge.image.pop();

		await Redis.setCache(pledge.candidateId, 100, JSON.stringify(pledge));

		res.status(200).json({
			status: 'success',
			pledge
		});
	}
);

export const voteToPledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user!.isVote)
			return next(new AppError('ERROR: You can vote only one time', 400));

		const userPromise = User.findByPk(req.user!.id);
		const pledgePromise = Pledge.findOne({
			where: { candidateId: req.params!.id }
		});

		const [user, pledge] = await Promise.all([userPromise, pledgePromise]);

		if (!user || !pledge || user!.school !== pledge!.school)
			return next(new AppError('ERROR: You can vote to your school', 400));

		if (!pledge.canVote)
			return next(new AppError('ERROR: 투표 시간이 아닙니다!', 400));

		user.isVote = true;
		pledge.voteCount += 1;

		await Promise.all([user.save(), pledge.save()]).catch(() =>
			next(new AppError('ERROR: fail to vote, Please try again', 500))
		);

		res.status(200).json({
			status: 'success',
			isVote: user.isVote
		});
	}
);

export const updatePledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return next(new AppError('ERROR: Permission denied', 400));
		const files = req.files as Array<any>;

		let image = '';

		if (files) {
			files.forEach((file) => {
				image += `${file.location.split('public/')[1]},`;
			});
		}

		const pledge = await Pledge.findOne({
			where: { candidateId: req.params.id },
			attributes: { exclude: ['voteCount'] }
		});

		if (!pledge || pledge.candidateId !== req.user.id)
			return next(new AppError('ERROR: Permission denied', 400));

		pledge.title = req.body?.title || pledge.title;
		pledge.content = req.body?.content || pledge.content;
		pledge.image = image || pledge.image;

		await pledge.save();

		const { id, ...update } = pledge.toJSON() as Pledge;

		update.image = (update.image as string).split(',');

		update.image.pop();

		Redis.deleteCache([req.user!.school, pledge.candidateId]);

		res.status(200).json({
			status: 'success',
			pledge: update
		});
	}
);

export const deletePledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return next(new AppError('ERROR: Permission denied', 400));

		const pledge = await Pledge.findOne({
			where: { candidateId: req.params.id },
			attributes: { exclude: ['voteCount'] }
		});

		if (
			!pledge ||
			(pledge.candidateId !== req.user.id && req.user.role !== 'admin')
		)
			return next(new AppError('ERROR: Permission denied', 400));

		await pledge.destroy();

		Redis.deleteCache([req.user!.school, pledge.candidateId]);

		res.status(200).json({
			status: 'success'
		});
	}
);

export const openOrCloseVote = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user!.role !== 'admin')
			return next(new AppError('ERROR: Permission denied', 400));

		let pledges = await Pledge.findAll({
			where: { school: req.user!.school },
			attributes: { exclude: ['voteCount'] }
		});

		const pledgesPromise = pledges.map((pledge) => {
			// eslint-disable-next-line no-param-reassign
			pledge.canVote = !pledge.canVote;
			return pledge.save();
		});

		pledges = await Promise.all(pledgesPromise);

		const keys = pledges.map((pledge) => {
			return pledge.candidateId;
		});

		Redis.deleteCache([req.user!.school, ...keys]);

		res.status(200).json({
			status: 'success',
			canVote: pledges[0].canVote
		});
	}
);

export const voteReset = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user!.role !== 'admin')
			return next(new AppError('ERROR: Permission denied', 400));

		let pledges = await Pledge.findAll({
			where: { school: req.user!.school },
			attributes: { exclude: ['voteCount'] }
		});

		if (pledges[0].canVote) {
			return next(new AppError('Error: 투표를 먼저 종료하세요!', 400));
		}

		const pledgesPromise = pledges.map((pledge) => {
			// eslint-disable-next-line no-param-reassign
			pledge.canVote = false;
			// eslint-disable-next-line no-param-reassign
			pledge.voteCount = 0;
			return pledge.save();
		});

		pledges = await Promise.all(pledgesPromise);

		res.status(200).json({
			status: 'success',
			pledges
		});
	}
);

export const getResult = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const pledges = await Pledge.findAll({
			where: { school: req.user!.school },
			include: {
				model: User,
				as: 'candidate',
				attributes: { exclude: ['password'] }
			}
		});

		const max = (await Pledge.max('voteCount')) as number;

		const winner = await Pledge.findAll({
			where: { voteCount: max },
			attributes: ['candidateId']
		});

		res.status(200).json({
			status: 'success',
			pledges,
			winner
		});
	}
);

export const electPresident = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { candidateId } = req.body;

		const president = await User.findByPk(candidateId);

		if (!president || president!.school !== req.user!.school)
			return next(new AppError('ERROR: Permission denied', 400));

		president.role = 'president';

		await president.save();

		res.status(200).json({
			status: 'success',
			president
		});
	}
);
