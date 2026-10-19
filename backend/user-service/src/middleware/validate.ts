import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/AppError';

export const getValidated = <T>(req: Request): T => {
    return req.validated as T;
}

export const validate = <T>(schema: z.ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = schema.parse(req.body);
            next();
        } catch (error) {
            // check type of an error
            if (error instanceof ZodError) {
                const details: ValidationError[] = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))

                next(new AppError("Validation failed", 400, "Validation error", details));
            } else {
                next(error)
            }
        }
    }
}