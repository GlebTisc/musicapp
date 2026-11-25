import UserModel, { User } from '../models/User';
import { createTokenPair } from './refreshTokenService';
import type { ValidationError } from '../utils/AppError';
import { ValidationFailedError } from "../utils/errors";
import { LoginDTO, RegisterDTO } from 'src/utils/schemas';

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

const createTokens = (id: string, role: 'admin' | 'user') => createTokenPair(id, role);

/**
 * Register function
 * 
 * @param data 
 * @returns 
 */
export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
    let existingUser = await UserModel.findOne({ email: data.email });
    let details: ValidationError[] = [];

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
    const tokens = await createTokens(user._id.toString(), user.role);

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
        throw new ValidationFailedError('Incorrect email or password');
    }

    const tokens = await createTokens(user._id.toString(), user.role);
    return { ...tokens, user: extractUserFields(user) };
};
