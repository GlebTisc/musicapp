import { AppError, ValidationError } from "./AppError";

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication failed", details?: ValidationError[]) {
        super(message, 401, 'AuthenticationError', details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Access denied", details?: ValidationError[]) {
        super(message, 403, 'ForbiddenError', details);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found", details?: ValidationError[]) {
        super(message, 404, 'NotFoundError', details);
    }
}

export class TokenExpiredError extends AppError {
    constructor(message: string = "Token has expired", details?: ValidationError[]) {
        super(message, 401, 'TokenExpiredError', details);
    }
}

export class ValidationFailedError extends AppError {
    constructor(message: string = "Validation failed", details?: ValidationError[]) {
        super(message, 400, 'ValidationFailedError', details);
    }
}