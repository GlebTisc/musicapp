import jwt from 'jsonwebtoken';
import { z } from 'zod';
import UserModel, { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { createTokenPair } from './refreshTokenService';
import config from '../config';
import type { ValidationError } from '../utils/AppError';
import { decode } from 'node:punycode';

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

export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
        const details: ValidationError[] = [
            { field: 'email', message: 'Email already registered' },
        ];
        throw new AppError('Email already registered', 400, 'Validation Error', details);
    }

    const user = await UserModel.create(data);
    const tokens = await createTokens(user._id.toString());

    return { ...tokens, user: extractUserFields(user) };
};

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
    const decoded = jwt.verify(accessToken, config.jwt.secret) as { id: string };

    // check if payload exists
    if (!decoded) {
        throw new AppError('Invalid payload data', 401, 'InvalidTokenError')
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
