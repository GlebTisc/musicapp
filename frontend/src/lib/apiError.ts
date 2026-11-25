import { isAxiosError } from "axios";
import { ApiErrorDetail, ApiErrorPayload } from "@/types";
import { ProxyFailure } from "./proxyFetch";

// type guard for the details array of an error
export const isApiErrorDetail = (item: unknown): item is ApiErrorDetail => {
    return (
        typeof item === 'object' &&
        item !== null &&
        'field' in item && typeof item.field === 'string' &&
        'message' in item && typeof item.message === 'string'
    );
};

export const isApiErrorDetailPayload = (data: unknown): data is ApiErrorDetail[] => {
    return Array.isArray(data) && data.length > 0 && data.every(isApiErrorDetail);
}

// typeguard for API error payload
export const isApiErrorPayload = (payload: unknown): payload is ApiErrorPayload => {
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }

    const obj = payload as Record<string, unknown>;

    // error fields
    if (!('message' in obj) || typeof obj.message !== 'string' || !('error' in obj) || typeof obj.error !== 'string') {
        return false;
    }

    // optional field details
    if ('details' in obj && obj.details !== undefined && !Array.isArray(obj.details)) {
        return false;
    }

    return true;
};

/**
 * Typeguard to prove that response contains valid details
 * 
 * @param res 
 * @returns 
 */
export const hasApiErrorDetails = (
    res: ProxyFailure
): res is ProxyFailure & { details: ApiErrorDetail[] } => {
    return isApiErrorDetailPayload(res.details);
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
                ? rawDetails.filter(isApiErrorDetail)
                : undefined;

            return {
                message: data.message,
                error: 'error' in data && typeof data.error === 'string' ? data.error : "UnknownError",
                details: safeDetails,
            };
        }

        // connection error
        if (!error.response) {
            return { error: "ConnectionError", message: 'Server isn\'t available. Please check your Internet connection.' };
        }

        // other HTTP error
        return {
            error: "UnknownError",
            message: error.response.status === 401
                ? 'Session has expired. Please login again'
                : 'Internal server error',
        };
    }

    // JavaScript error
    if (error instanceof Error) {
        return { error: error.name, message: error.message };
    }

    return { error: "UnknownError", message: 'Unknown error has occured' };
}

export function detailsToFieldErrors(
    payload: { details?: ApiErrorDetail[]; message: string },
    formErrorKey = '_form',
    fallbackMessage = 'Validation error'
): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    const add = (key: string, message: string) => {
        (result[key] ??= []).push(message);
    };

    if (payload.details?.length) {
        for (const d of payload.details) {
            add(d.field || formErrorKey, d.message);
        }
    } else {
        add(formErrorKey, payload.message ?? fallbackMessage);
    }

    return result;
}