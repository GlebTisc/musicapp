import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { AuthenticationError, TokenExpiredError as CustomTokenExpiredError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // if error is handled - return it
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.error,
            message: err.message,
            status: err.statusCode,
            ...(err.details !== undefined && { details: err.details }),
        });
        return;
    }

    // token expiration error
    if (err instanceof TokenExpiredError) {
        const tokenError = new CustomTokenExpiredError();
        res.status(tokenError.statusCode).json({
            error: tokenError.error,
            message: tokenError.message,
            status: tokenError.statusCode,
        });
        return;
    }

    // invalid token error
    if (err instanceof JsonWebTokenError) {
        const authError = new AuthenticationError('Invalid token');
        res.status(authError.statusCode).json({
            error: authError.error,
            message: authError.message,
            status: authError.statusCode,
        });
        return;
    }

    // unknown error
    logger.error('Unhandled Error:', err);

    res.status(500).json({
        error: 'Internal Error: ' + err.name,
        message: err.message ?? 'Something went wrong',
        status: 500,
    });
};