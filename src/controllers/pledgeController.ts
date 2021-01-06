import { Request, Response, NextFunction } from 'express';
import { Pledge, User } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createPledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;

		const files = req.files as Array<any>;

		let image = '';
		if (files) {
			files.forEach((file) => {
				image += `${file.key},`;
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

		res.status(200).json({
			status: 'success',
			newPledge
		});
	}
);

export const getAllPledges = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const pledges = await Pledge.findAll({
			where: { school: req.user!.school },
			attributes: { exclude: ['id', 'voteCount'] }
		});

		res.status(200).json({
			status: 'success',
			data: {
				pledges
			}
		});
	}
);

export const getOnePledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const pledge = await Pledge.findOne({
			where: { school: req.user!.school, candidateId: req.params.id },
			include: { model: User, as: 'candidate' },
			attributes: { exclude: ['voteCount'] }
		});

		if (!pledge) return next(new AppError('ERROR: Cannot find pledge', 400));

		pledge.image = (pledge.image as string).split(',');

		pledge.image.pop();

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
			return next(new AppError('ERROR: This is not voting time', 400));

		user.isVote = true;
		pledge.voteCount += 1;

		await Promise.all([user.save(), pledge.save()]).catch(() =>
			next(new AppError('ERROR: VOTE, Please try again', 500))
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
				image += `${file.key},`;
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

		res.status(200).json({
			status: 'success',
			pledges
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
