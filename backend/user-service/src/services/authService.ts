import jwt from 'jsonwebtoken';
import { z } from 'zod';
import UserModel, { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { createTokenPair } from './refreshTokenService';
import config from '../config';
import type { ValidationError } from '../utils/AppError';
import { isTokenPayload } from '../utils/typeguards';
import {ValidationFailedError} from "../utils/errors";

export const RegisterSchema = z.object({
    email: z.email('Invalid email format'),
    username: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50)
        .regex(
            /^[a-zA-Z][a-zA-Z0-9]*([-_.][a-zA-Z0-9]+)?$/,
            'Username must start with a letter, contain letters, numbers and optionally 1 special symbol'
        )
    ,
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required').max(50),
    password: z.string().min(1, 'Password is required').max(128),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

export const extractUserFields = (user: User) => ({
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
});

const createTokens = (id: string) => createTokenPair(id);

/**
 * Register function
 * 
 * @param data 
 * @returns 
 */
export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
    let existingUser = await UserModel.findOne({ email: data.email });
    let details:ValidationError[] = [];

    if (existingUser) {
        details.push({ field: 'email', message: 'Email already registered' });
    }

    existingUser = await UserModel.findOne({ username: data.username });
    if (existingUser) {
        details.push({ field: 'username', message: 'Username already registered' });
    }

    // check if validation failed
    if (details.length > 0) {
        throw new ValidationFailedError(undefined, details);
    }

    const user = await UserModel.create(data);
    const tokens = await createTokens(user._id.toString());

    return { ...tokens, user: extractUserFields(user) };
};

/**
 * Login function
 * 
 * @param data 
 * @returns 
 */
export const login = async (data: LoginDTO): Promise<AuthResponse> => {
    const user = await UserModel.findOne({ username: data.username }).select('+password');

    if (!user || !(await user.comparePasswords(data.password))) {
        throw new AppError('Incorrect email or password', 401, 'Authentication Error');
    }

    const tokens = await createTokens(user._id.toString());
    return { ...tokens, user: extractUserFields(user) };
};

/**
 * Validate JWT access token
 * 
 * @param accessToken 
 * @returns 
 */
export const validateAccessToken = async (accessToken: string) => {
    const decoded = jwt.verify(accessToken, config.jwt.secret);

    // check if payload exists
    if (!decoded) {
        throw new AppError('Invalid payload data', 401, 'InvalidTokenError');
    }

    // check if token payload is valid
    if (!isTokenPayload(decoded)) {
        throw new AppError('Invalid payload data', 401, 'InvalidTokenError');
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
        throw new AppError('User not found', 401, 'Authentication Error');
    }

    return {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
    };
};
