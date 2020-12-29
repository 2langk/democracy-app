import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { Pledge, User } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads');
	},
	filename(req, file, cb) {
		cb(null, `${req.user!.name}-${Date.now()}.${file.mimetype.split('/')[1]}`);
	}
});

const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Please upload only images.', 400));
	}
};

export const uploadImage = multer({ storage, fileFilter }).array('images');

export const createPledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;
		const files = req.files as Array<Express.Multer.File>;

		let image = '';
		if (files) {
			files.forEach((file) => {
				image += `${file.filename},`;
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
			data: {
				newPledge
			}
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
			attributes: { exclude: ['id', 'voteCount'] }
		});

		res.status(200).json({
			status: 'success',
			data: {
				pledge
			}
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
			data: {
				isVote: user.isVote
			}
		});
	}
);

export const updatePledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return next(new AppError('ERROR: Permission denied', 400));
		const files = req.files as Array<Express.Multer.File>;
		let image = '';

		if (files) {
			files.forEach((file) => {
				image += `${file.filename},`;
			});
		}

		const pledge = await Pledge.findOne({
			where: { candidateId: req.params.id },
			attributes: { exclude: ['voteCount'] }
		});

		if (
			!pledge ||
			(pledge.candidateId !== req.user.id && req.user.role !== 'admin')
		)
			return next(new AppError('ERROR: Permission denied', 400));

		if (req.user.id === pledge.candidateId) {
			pledge.title = req.body?.title || pledge.title;
			pledge.content = req.body?.content || pledge.content;
			pledge.image = image || pledge.image;
		}

		if (req.user.role === 'admin')
			pledge.canVote = req.body?.canVote || pledge.canVote;

		await pledge.save();

		const { id, ...update } = pledge.toJSON() as Pledge;

		res.status(200).json({
			status: 'success',
			data: {
				pledge: update
			}
		});
	}
);

export const deletePledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json({
			status: 'success',
			data: {}
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

		res.status(200).json({
			status: 'success',
			data: {
				pledges
			}
		});
	}
);

export const electPresident = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { candidateId } = req.body;

		const president = await User.findByPk(candidateId);

		if (president!.school !== req.user!.school)
			return next(new AppError('ERROR: Permission denied', 400));

		president!.role = 'president';

		res.status(200).json({
			status: 'success',
			data: {
				president
			}
		});
	}
);
