import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    // set headers for requests
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    return config;
})

// refresh block: only 1 request should be handled at a time
let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // check if it's 401 error and not a retry
        if (error.response?.status === 401 && error.config && !error.config?.retry) {
            // never refresh the refresh request
            if (error.config.url?.includes('api/auth/refresh')) {
                return Promise.reject(error);
            }

            error.config.retry = true;

            // check if refresh is already pending
            if (!refreshPromise) {
                refreshPromise = api.post('api/auth/refresh', {}).finally(() => {
                    refreshPromise = null;
                });
            }

            // try to refresh token
            try {
                await refreshPromise;

                // retry the initial request
                return api(error.config)
            } catch (refreshError: unknown) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)