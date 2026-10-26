import { isAxiosError } from "axios";
import { ApiErrorDetail, ApiErrorPayload } from "@/types/auth";

// type guard for the details array of an error
const isValidDetail = (item: unknown): item is ApiErrorDetail => {
    return (
        typeof item === 'object' &&
        item !== null &&
        'field' in item && typeof item.field === 'string' &&
        'message' in item && typeof item.message === 'string'
    );
};

// typeguard for API error payload
export const isApiErrorPayload = (payload: unknown): payload is ApiErrorPayload => {
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }

    const obj = payload as Record<string, unknown>;

    // field message
    if (!('message' in obj) || typeof obj.message !== 'string') {
        return false;
    }

    // field error
    if ('error' in obj && obj.error !== undefined && typeof obj.error !== 'string') {
        return false;
    }

    // optional field details
    if ('details' in obj && obj.details !== undefined && !Array.isArray(obj.details)) {
        return false;
    }

    return true;
};

export function toApiError(error: unknown): ApiErrorPayload {
    // check if it's API error or connection error
    if (isAxiosError(error)) {
        const data = error.response?.data;

        // check the error format
        if (
            typeof data === 'object' &&
            data !== null &&
            'message' in data &&
            typeof data.message === 'string'
        ) {
            // extract details
            const rawDetails = 'details' in data ? data.details : undefined;
            const safeDetails = Array.isArray(rawDetails)
                ? rawDetails.filter(isValidDetail)
                : undefined;

            return {
                message: data.message,
                error: 'error' in data && typeof data.error === 'string' ? data.error : undefined,
                details: safeDetails,
            };
        }

        // connection error
        if (!error.response) {
            return { message: 'Server isn\'t available. Please check your Internet connection.' };
        }

        // other HTTP error
        return {
            message: error.response.status === 401
                ? 'Session has expired. Please login again'
                : 'Internal server error',
        };
    }

    // JavaScript error
    if (error instanceof Error) {
        return { message: error.message };
    }

    return { message: 'Unknown error' };
}