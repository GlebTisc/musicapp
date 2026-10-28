import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from 'src/utils/errors';

export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // check if user is authenticated
        if (!req.user) {
            throw next(new ForbiddenError('Authentication required'));
        }

        // check if role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You don\'t have permissions to perform this action'));
        }

        next();
    }
}