"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendErrorProd = (err, req, res) => {
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
const sendErrorDev = (err, req, res) => res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
});
const globalErrorHandler = (err, req, res, next) => {
    // console.log(err.stack);
    const error = err;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, req, res);
    }
};
exports.default = globalErrorHandler;
