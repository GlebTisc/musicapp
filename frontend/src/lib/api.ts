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
        'Accept': 'application/json'
    }
})


/**
 * Request interceptor.
 * 
 * Adds necessary headers to the request (including CSRF protection)
 */
api.interceptors.request.use(request => {
    const method = (request.method ?? 'get').toLowerCase();

    // add Content-Type application/json by default
    if (!(request.data instanceof FormData) && !request.headers['Content-Type']) {
        request.headers['Content-Type'] = 'application/json;'
    }

    // add custom header on state changing requests
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        request.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    return request;
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