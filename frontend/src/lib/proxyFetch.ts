import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from "zod";
import { isApiErrorDetail } from "./apiError";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ProxyOptions<T extends z.ZodType | undefined = undefined> = {
    method: HTTPMethod;
    path: string;
    body?: unknown;
    searchParams?: Record<string, unknown>;
    schema?: T;
    revalidate?: string | string[];
    headers?: Record<string, string>;
}

type ProxySuccess<T> = { ok: true, data: T, status: number };
export type ProxyFailure = { ok: false, error: string, status: number, message: string, details?: unknown };
type ProxyResult<T> = ProxySuccess<T> | ProxyFailure;

type Inferred<T extends z.ZodType | undefined> = T extends z.ZodType ? z.infer<T> : unknown;

export async function proxyFetch<TSchema extends z.ZodType | undefined = undefined>(
    options: ProxyOptions<TSchema>,
): Promise<ProxyResult<Inferred<TSchema>>> {
    const { method = 'GET', path, body, searchParams, schema, revalidate, headers } = options;

    const url = new URL(`${BACKEND_URL}${path}`);
    if (searchParams) {
        for (const [k, v] of Object.entries(searchParams)) {
            if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
        }
    }

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const reqHeaders: Record<string, string> = {
        Accept: 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
        ...headers,
    };

    const init: RequestInit = { method, headers: reqHeaders, cache: 'no-store' };
    if (body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
        reqHeaders['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
    }

    let res: Response;
    try {
        res = await fetch(url.toString(), init);
    } catch (e) {
        return {
            ok: false,
            status: 0,
            error: 'NetworkError',
            message: 'Couldn\'t connect to the API',
            details: undefined,
        };
    }

    let json: unknown;
    try {
        json = await res.json();
    } catch {
        return {
            ok: false,
            status: res.status,
            error: 'InvalidJson',
            message: 'Invalid json',
        };
    }

    console.error(json)

    if (!res.ok) {
        return { ok: false, ...parseApiError(json, res.status) };
    }

    if (schema) {
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
            return {
                ok: false,
                status: res.status,
                error: 'SchemaMismatch',
                message: 'Invalid content type',
            };
        }

        revalidateIfNeeded(revalidate);
        return { ok: true, data: parsed.data as Inferred<TSchema>, status: res.status };
    }

    revalidateIfNeeded(revalidate);
    return { ok: true, data: json as Inferred<TSchema>, status: res.status };
}

function revalidateIfNeeded(revalidate: string | string[] | undefined): void {
    if (!revalidate) return;
    for (const p of Array.isArray(revalidate) ? revalidate : [revalidate]) revalidatePath(p);
}

function parseApiError(json: unknown, fallbackStatus: number) {
    if (
        typeof json === 'object' && json !== null &&
        'error' in json && typeof json.error === 'string' &&
        'message' in json && typeof json.message === 'string'
    ) {
        const rawDetails = 'details' in json ? json.details : undefined;
        const details = Array.isArray(rawDetails)
            ? rawDetails.filter(isApiErrorDetail)
            : undefined;

        const status =
            'status' in json && typeof json.status === 'number'
                ? json.status
                : fallbackStatus;

        return { status, error: json.error, message: json.message, details };
    }
    return { status: fallbackStatus, error: 'UnknownError', message: `HTTP ${fallbackStatus}`, details: undefined };
}