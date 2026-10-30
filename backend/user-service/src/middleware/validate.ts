import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../utils/AppError';
import { ValidationFailedError } from '../utils/errors';

type RequestSource = 'body' | 'query';
type ValidatedKey = 'validated' | 'validatedQuery';

const SOURCE_MAP: Record<RequestSource, ValidatedKey> = {
    'body': 'validated',
    'query': 'validatedQuery'
}

const createValidator = <T>(schema: z.ZodType<T>, source: RequestSource) => {
    const key = SOURCE_MAP[source];

    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            req[key] = schema.parse(req[source]);
            next();
        } catch (error: unknown) {
            handleError(error, next);
        }
    }
}

export const validateBody = <T>(schema: z.ZodType<T>) => createValidator(schema, 'body');

export const getValidated = <T>(req: Request): T => req.validated as T;

export const validateQuery = <T>(schema: z.ZodType<T>) => createValidator(schema, 'query');

export const getValidatedQuery = <T>(req: Request): T => req.validatedQuery as T;


const handleError = (error: unknown, next: NextFunction) => {
    // check type of an error
    if (error instanceof ZodError) {
        const details: ValidationError[] = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
        }))

        next(new ValidationFailedError(undefined, details));
    } else {
        next(error)
    }
}