export interface ValidationError {
    field: string;
    message: string
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly error: string;
    public readonly details?: ValidationError[];

    constructor(
        message: string,
        statusCode: number,
        error: string = 'Error',
        details?: ValidationError[]
    ) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}