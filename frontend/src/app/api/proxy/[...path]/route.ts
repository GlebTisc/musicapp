import { checkCsrf } from '@/lib/csrf';
import { BACKEND_URL, SKIP_REFRESH_PATHS, tryRefreshToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

function pathMatches(apiPath: string, prefix: string): boolean {
    return apiPath === prefix || apiPath.startsWith(`${prefix}/`);
}

/**
 * Extracts cookies from request and generates Cookie header
 */
function buildCookieHeader(request: NextRequest): string {
    const cookieList = request.cookies.getAll();
    return cookieList.map(c => `${c.name}=${c.value}`).join('; ');
}

/**
 * Create response, proxy headers and cookies
 */
async function createProxyResponse(
    backendResponse: Response,
    refreshSetCookies: string[] = [],
): Promise<NextResponse> {
    const body = await backendResponse.text();
    const response = new NextResponse(body, {
        status: backendResponse.status,
        headers: { 'Content-Type': backendResponse.headers.get('content-type') ?? 'application/json' },
    });

    // add Set-Cookie — from response and refresh
    for (const c of backendResponse.headers.getSetCookie?.() ?? []) {
        response.headers.append('Set-Cookie', c);
    }
    for (const c of refreshSetCookies) {
        response.headers.append('Set-Cookie', c);
    }
    return response;
}

/**
 * Main request proxy function
 */
async function handleProxy(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
    // check csrf
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    const { path } = await context.params;
    const apiPath = path.join('/');
    const url = `${BACKEND_URL}/${apiPath}${request.nextUrl.search}`;
    const method = request.method;

    const shouldSkipRefresh = SKIP_REFRESH_PATHS.some((p) => pathMatches(apiPath, p));

    let body: string | undefined;
    if (!['GET', 'HEAD'].includes(method)) {
        body = await request.text();
    }

    const cookieHeader = buildCookieHeader(request);
    const headers: Record<string, string> = {
        'Content-Type': request.headers.get('Content-Type') ?? 'application/json',
        Accept: 'application/json',
    };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    let backendResponse: Response;
    try {
        backendResponse = await fetch(url, { method, headers, body });
    } catch (error) {
        console.error('Backend request failed:', error);
        return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
    }

    if (backendResponse.status === 401 && !shouldSkipRefresh) {
        const refreshResult = await tryRefreshToken(request);

        if (refreshResult) {
            try {
                const retryResponse = await fetch(url, {
                    method,
                    headers: { ...headers, Cookie: refreshResult.cookieHeader },
                    body,
                });

                // clear cookies if retry is 401
                if (retryResponse.status === 401) {
                    const response = await createProxyResponse(retryResponse, refreshResult.setCookies);
                    response.cookies.delete('accessToken');
                    response.cookies.delete('refreshToken');
                    return response;
                }

                return createProxyResponse(retryResponse, refreshResult.setCookies);
            } catch (error) {
                return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
            }
        }

        // refresh is failed - clear tokens
        const response = await createProxyResponse(backendResponse);
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }

    return createProxyResponse(backendResponse);
}

// Export all HTTP methods
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;