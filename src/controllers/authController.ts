import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.send('hi');
	}
);

export const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {}
);
