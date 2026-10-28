import { AuthState } from "@/types/auth";
import { createSlice, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../typedThunk";
import * as authApi from "@/lib/auth";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { isApiErrorPayload, toApiError } from "@/lib/apiError";
import { isAxiosError } from "axios";

const initialState: AuthState = {
    user: undefined,
    isAuthenticated: false,
    isLoading: true,
    error: null
}

export const checkAuth = createAppAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authApi.checkAuthStatus();
            return user;
        } catch (error: unknown) {
            // check if it's an authentication error
            if (isAxiosError(error) && error.response?.status === 401) {
                return rejectWithValue('Guest')
            }

            return rejectWithValue(toApiError(error));
        }
    }
);

export const loginUser = createAppAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const user = await authApi.login(credentials);
            return user;
        } catch (error: unknown) {
            return rejectWithValue(toApiError(error));
        }
    }
);

export const registerUser = createAppAsyncThunk(
    'auth/register',
    async (data: RegisterCredentials, { rejectWithValue }) => {
        try {
            const user = await authApi.register(data);
            return user;
        } catch (error: unknown) {
            return rejectWithValue(toApiError(error));
        }
    }
);

export const logout = createAppAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
            return null;
        } catch (error: unknown) {
            return rejectWithValue(toApiError(error));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // check auth
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;

                // check if it's an authentication error 
                if (action.payload === 'Guest') {
                    state.error = null;
                } else if (isApiErrorPayload(action.payload)) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || 'Unknown error';
                }
            });

        // login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = isApiErrorPayload(action.payload)
                    ? action.payload.message
                    : action.error.message || "Unknown error"
                ;
            });

        // register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = isApiErrorPayload(action.payload)
                    ? action.payload.message
                    : action.error.message || "Unknown error"
                ;
            });

        // logout
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = isApiErrorPayload(action.payload)
                    ? action.payload.message
                    : "Logout failed, but you have been logged out locally"
                ;
            });
    }
});

export default authSlice.reducer;