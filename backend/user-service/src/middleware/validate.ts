import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import type { ValidationError } from '../utils/AppError';
import { ValidationFailedError } from '../utils/errors';

type RequestSource = 'body' | 'query' | 'params';
type ValidatedKey = 'validated' | 'validatedQuery' | 'validatedParams';

const SOURCE_MAP: Record<RequestSource, ValidatedKey> = {
    body: 'validated',
    query: 'validatedQuery',
    params: 'validatedParams',
};

const handleError = (error: unknown, next: NextFunction): void => {
    if (error instanceof ZodError) {
        const details: ValidationError[] = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        }));
        next(new ValidationFailedError(undefined, details));
        return;
    }
    next(error);
};

const createValidator = (schema: z.ZodType, source: RequestSource) => {
    const key = SOURCE_MAP[source];
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            req[key] = schema.parse(req[source]);
            next();
        } catch (error) {
            handleError(error, next);
        }
    };
};

export const validate = {
    body: (schema: z.ZodType) => createValidator(schema, 'body'),
    query: (schema: z.ZodType) => createValidator(schema, 'query'),
    params: (schema: z.ZodType) => createValidator(schema, 'params'),
} as const;

export const getValidated = {
    body: <T>(req: Request): T => req.validated as T,
    query: <T>(req: Request): T => req.validatedQuery as T,
    params: <T>(req: Request): T => req.validatedParams as T,
};