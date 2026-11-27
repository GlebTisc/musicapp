import { checkCsrf } from '@/lib/csrf';
import { BACKEND_URL } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

async function handleUpload(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    const { path } = await context.params;
    const apiPath = path.join('/');
    const url = `${BACKEND_URL}/${apiPath}${request.nextUrl.search}`;

    const headers = new Headers(request.headers);

    // read body as ArrayBuffer
    const bodyBuffer = !['GET', 'HEAD'].includes(request.method)
        ? await request.arrayBuffer()
        : undefined;

    // First attempt
    let upstreamResponse: Response;
    try {
        upstreamResponse = await fetch(url, {
            method: request.method,
            headers,
            body: bodyBuffer,
            cache: 'no-store',
        });
    } catch (error) {
        console.error('Upload request failed:', error);
        return NextResponse.json(
            { error: 'NetworkError', message: 'Backend service unavailable', status: 503 },
            { status: 503 }
        );
    }

    // pass through the response (including Set-Cookie if music-service sets any)
    const response = new NextResponse(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: {
            'Content-Type': upstreamResponse.headers.get('content-type') ?? 'application/json',
        },
    });

    // forward Set-Cookie headers from music-service
    upstreamResponse.headers.getSetCookie?.().forEach(cookie => {
        response.headers.append('Set-Cookie', cookie);
    });

    return response;
}

export const POST = handleUpload;
export const PUT = handleUpload;
export const PATCH = handleUpload;
export const DELETE = handleUpload;