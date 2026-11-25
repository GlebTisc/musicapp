import axios, { AxiosError, AxiosInstance } from "axios";

/**
 * API client.
 *
 * All request go through the Next.js API routes (/api/proxy), that handles token refreshes
 */
export const api: AxiosInstance = axios.create({
    // all requests proxy to the Next.js
    baseURL: '/api/proxy',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

/**
 * Response interceptor.
 *
 * Handles redirect when token refresh is failed
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // token refresh is failed
        if (error.response?.status === 401) {
            // check if it's auth endpoint
            const url = error.config?.url || '';
            const skipRedirect = url.includes('api/auth/login') ||
                url.includes('api/auth/register') ||
                url.includes('api/user/me');

            // redirect to the login page via window
            if (!skipRedirect && typeof window !== 'undefined') {
                const path = window.location.pathname;

                if (path !== '/login' && path !== '/register') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
)