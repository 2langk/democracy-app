import { Request, Response, NextFunction } from 'express';
import { User, Evalutation } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createEvaluation = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { user } = req;

		if (!user) return next(new AppError('protect', 400));

		const evaluation = await Evalutation.findOne({
			where: { postId: req.params.id, userId: user.id }
		});

		if (evaluation) return next(new AppError('protect', 400));

		const newEval = await Evalutation.create({
			postId: req.params.id,
			userId: user.id,
			school: user.school,
			rating: req.body.rating
		});

		res.status(201).json({
			status: 'success',
			newEval
		});
	}
);

export const getEvaluation = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const evaluations = await Evalutation.findAll({
			where: { postId: req.params.id }
		});

		const rates = {
			A: 0,
			B: 0,
			C: 0,
			D: 0,
			E: 0
		};

		const total = evaluations.length;
		evaluations.forEach((evaluation) => {
			switch (
				((evaluation.toJSON() as Evalutation).rating as unknown) as number
			) {
				case 5:
					rates.A += 1;
					break;
				case 4:
					rates.B += 1;
					break;
				case 3:
					rates.C += 1;
					break;
				case 2:
					rates.D += 1;
					break;
				case 1:
					rates.E += 1;
					break;
				default:
			}
		});

		rates.A = (rates.A / total) * 100;
		rates.B = (rates.B / total) * 100;
		rates.C = (rates.C / total) * 100;
		rates.D = (rates.D / total) * 100;
		rates.E = (rates.E / total) * 100;
		res.status(201).json({
			status: 'success',
			rates
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
			evaluation
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
			evaluation: update
		});
	}
);
