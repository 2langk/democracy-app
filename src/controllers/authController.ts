import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { User } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const registerForTeacher = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email, password, school, schoolCode, schoolClass } = req.body;

		const result = await axios.get(
			'http://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=aa3d3a5f6bd1d9de0b6c146efa360489&svcType=api&svcCode=SCHOOL&contentType=json&gubun=high_list&perPage=2500'
		);

		const match = result.data.dataSearch.content.find((s: any) => {
			return s.schoolName === `${school}등학교`;
		});

		if (!match || match.seq !== schoolCode) {
			return next(new AppError('ERROR: Cannot find school!', 400));
		}

		const newUser = await User.create({
			name,
			email,
			password,
			school,
			role: 'teacher',
			schoolClass,
			isVote: 'true',
			isAuth: 'true',
			photo: 'default'
		});

		if (!newUser) return next(new AppError('ERROR: Cannot create user', 400));

		delete newUser.password;

		res.status(201).json({
			status: 'success',
			newUser
		});
	}
);

export const registerForStudent = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email, password, school, schoolClass, photo } = req.body;

		const result = await axios.get(
			'http://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=aa3d3a5f6bd1d9de0b6c146efa360489&svcType=api&svcCode=SCHOOL&contentType=json&gubun=high_list&perPage=2500'
		);

		const match = result.data.dataSearch.content.find((s: any) => {
			return s.schoolName === `${req.body.school}등학교`;
		});

		if (!match) {
			return next(new AppError('ERROR: Cannot find school!', 400));
		}

		const newUser = await User.create({
			name,
			email,
			password,
			school,
			schoolClass,
			photo
		});

		if (!newUser) return next(new AppError('ERROR: Cannot create user', 400));

		newUser.password = undefined;

		res.status(201).json({
			status: 'success',
			newUser
		});
	}
);

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		const user = await User.scope('withPassword').findOne({
			where: { email }
		});

		if (!user || !user.isAuth)
			return next(new AppError('ERROR: Cannot find user or not auth ', 400));

		// Password is Not valid.
		if (!(await user.comparePassword(password)))
			return next(new AppError('ERROR: Cannot find user.', 400));

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
			expiresIn: process.env.JWT_EXPIRES_IN
		});

		// const expire =
		// 	((process.env.JWT_COOKIE_EXPIRES_IN as unknown) as number) || 1;

		// const cookieOptions = {
		// 	expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
		// 	httpOnly: true
		// 	// secure: process.env.NODE_ENV === 'production'
		// };

		user.password = undefined;

		// res.cookie('jwt', token, cookieOptions);

		res.status(200).json({
			status: 'success',
			user,
			token
		});
	}
);

export const protect = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// eslint-disable-next-line prefer-destructuring
			token = req.headers.authorization.split('Bearer ')[1];
		}

		if (!token) return next(new AppError('ERROR: Please Login', 400));

		const decode: any = jwt.verify(token, process.env.JWT_SECRET!);

		const currentUser = await User.findByPk(decode.id);

		if (!currentUser || !currentUser.isAuth)
			return next(new AppError('ERROR: Please Login', 400));

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
			expiresIn: '2s'
		});

		// const cookieOptions = {
		// 	expires: new Date(Date.now() + 1 * 1000),
		// 	httpOnly: true
		// 	// secure: process.env.NODE_ENV === 'production'
		// };

		// res.cookie('jwt', token, cookieOptions);

		res.status(200).json({
			status: 'success',
			token
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

export const getAllStudent = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const teacher = req.user as User;
		const students = await User.scope('notAuth').findAll({
			where: { school: teacher.school, schoolClass: teacher.schoolClass }
		});

		res.status(200).json({
			status: 'success',
			students
		});
	}
);

export const authStudent = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const teacher = req.user as User;
		const student = await User.scope('notAuth').findOne({
			where: {
				school: teacher.school,
				schoolClass: teacher.schoolClass,
				id: req.params.id
			}
		});

		if (!student) return next(new AppError(`ERROR: Permission denied.`, 400));

		student.isAuth = true;
		student.photo = 'default';

		await student.save();

		res.status(200).json({
			status: 'success',
			student
		});
	}
);
