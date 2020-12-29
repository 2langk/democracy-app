import { Request, Response, NextFunction } from 'express';
import { User, Evalutation } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createEvaluation = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { user } = req;

		if (!user) return next(new AppError('protect', 400));

		const president = await User.findOne({ where: { school: user.school } });

		const newEval = await Evalutation.create({
			presidentId: president!.id,
			userId: user.id,
			school: user.school,
			rating: req.body.rating
		});

		newEval.id = undefined;
		res.status(201).json({
			status: 'success',
			data: {
				newEval
			}
		});
	}
);

export const getEvaluationAVG = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const evaluations = await Evalutation.findAll({
			where: { school: req.user!.school }
		});

		let ratingAVG = 0;
		evaluations.forEach((e) => {
			ratingAVG += e.rating;
		});

		ratingAVG /= evaluations.length;

		res.status(201).json({
			status: 'success',
			data: {
				ratingAVG
			}
		});
	}
);

export const getMyEvaluation = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const evaluation = await Evalutation.findOne({
			where: { userId: req.user!.id },
			attributes: { exclude: ['id'] }
		});

		res.status(201).json({
			status: 'success',
			data: {
				evaluation
			}
		});
	}
);

export const updateMyEvaluation = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const evaluation = await Evalutation.findOne({
			where: { userId: req.user!.id }
		});

		evaluation!.rating = req.body.rating;

		await evaluation!.save();

		const { id, ...update } = evaluation?.toJSON() as Evalutation;

		res.status(201).json({
			status: 'success',
			data: {
				evaluation: update
			}
		});
	}
);
