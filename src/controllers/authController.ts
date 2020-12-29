import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { User } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email, password, school } = req.body;

		const newUser = await User.create({ name, email, password, school });

		if (!newUser) return next(new AppError('ERROR: Cannot create user', 400));

		delete newUser.password;

		res.status(201).json({
			status: 'success',
			data: {
				newUser
			}
		});
	}
);

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		const user = await User.scope('withPassword').findOne({
			where: { email }
		});

		if (!user) return next(new AppError('ERROR: Cannot find user.', 400));

		// Password is Not valid.
		if (!(await user.comparePassword(password)))
			return next(new AppError('ERROR: Cannot find user.', 400));

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
			expiresIn: process.env.JWT_EXPIRES_IN
		});

		const expire =
			((process.env.JWT_COOKIE_EXPIRES_IN as unknown) as number) || 1;

		const cookieOptions = {
			expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production'
		};

		user.password = undefined;

		res.cookie('jwt', token, cookieOptions);

		res.status(200).json({
			status: 'success',
			data: {
				user
			}
		});
	}
);

export const protect = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.cookies.jwt) return next(new AppError('ERROR: Please Login', 400));
		const token = req.cookies.jwt;

		if (!token) return next(new AppError('ERROR: Please Login', 400));

		const decode: any = jwt.verify(token, process.env.JWT_SECRET!);

		const currentUser = await User.findByPk(decode.id);

		if (!currentUser) return next(new AppError('ERROR: Please Login', 400));

		// if (currentUser.isChangePassword(iat)) {
		// 	return next(new AppError('ERROR: password changed.', 401));
		// }

		req.user = currentUser.toJSON() as User;

		next();
	}
);

export const logout = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { user } = req;

		if (!user) return next(new AppError('ERROR: Cannot find user.', 400));

		const token = jwt.sign({ logout: 'logout' }, process.env.JWT_SECRET!, {
			expiresIn: '1s'
		});

		const cookieOptions = {
			expires: new Date(Date.now() + 1 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production'
		};

		res.cookie('jwt', token, cookieOptions);

		res.status(200).json({
			status: 'success'
		});
	}
);

export const restrictTo = (...roles: string[]): RequestHandler => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { role } = req.user as { role: string };

	if (!roles.includes(role))
		return next(
			new AppError(`ERROR: Permission denied. This is only for ${roles}`, 400)
		);

	next();
};
