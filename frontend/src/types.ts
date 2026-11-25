export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
};

export interface Category {
    _id: string;
    name: string;
    slug: string
}

export interface Music {
    _id: string;
    name: string;
    artist: string
}

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
    error: string;
    details?: ApiErrorDetail[];
}

// any database row (MongoDB has _id field)
export type AnyRow = { _id: string } & Record<string, unknown>;