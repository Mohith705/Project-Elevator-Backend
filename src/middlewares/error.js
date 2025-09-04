import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
};

export const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;
    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    res.status(statusCode).json(response);
};
