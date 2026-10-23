import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: process.env.PUBLIC_API_URL || "http://localhost:8000",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // check if it's 401 error and not a retry
        if (error.response?.status === 401 && error.config && !error.config?.retry) {
            error.config.retry = true;

            // try to refresh token
            try {
                await api.post('/auth/refresh');

                // retry the initial request
                return api(error.config)
            } catch (refreshError: unknown) {

            }
        }
    }
)