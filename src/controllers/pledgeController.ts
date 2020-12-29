import { Request, Response, NextFunction } from 'express';
import { Pledge } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createPledge = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;

		if (!title || !content)
			return next(new AppError('ERROR: Cannot find title or content', 400));

		const newPledge = await Pledge.create({
			title,
			content,
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
			where: { school: req.user!.school }
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
			where: { school: req.user!.school, candidateId: req.params.id }
		});
		res.status(200).json({
			status: 'success',
			pledge
		});
	}
);
