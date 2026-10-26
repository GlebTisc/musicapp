export interface User {
    id: string;
    username: string;
    password: string;
    role: 'user' | 'admin';
};

export interface AuthState {
    user: User | null | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials { email: string; }

export interface AuthResponse {
    status: "success";
    data: {
        user: User
    };
}

export interface ApiErrorDetail {
    field: string;
    message: string;
}

export interface ApiErrorPayload {
    message: string;
    error?: string;
    details?: ApiErrorDetail[];
}