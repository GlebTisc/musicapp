import { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { api } from "./api";

export const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<AuthResponse>('api/auth/login', credentials);
    return response.data.data.user;
}

export const register = async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post<AuthResponse>('api/auth/register', credentials);
    return response.data.data.user;
}

export const checkAuthStatus = async (): Promise<User> => {
    const response = await api.get<AuthResponse>('api/user/me');
    return response.data.data.user;
}