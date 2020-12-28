import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

const sendErrorProd = (err, req: Request, res: Response) => {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}
	// 1) Log error
	console.error('ERROR: ', err);

	// 2) Send generic message
	return res.status(500).json({
		status: 'error',
		message: 'Server Error, please try again'
	});
};

const sendErrorDev = (err: AppError, req: Request, res: Response) =>
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});

const ErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// console.log(err.stack);
	const error = err as AppError;

	error.statusCode = error.statusCode || 500;
	error.status = error.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(error, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		sendErrorProd(error, req, res);
	}
};

export default ErrorHandler;
