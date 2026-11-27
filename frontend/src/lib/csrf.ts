import { NextRequest, NextResponse } from "next/server";

const STATE_CHANGING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

function csrfReject(reason: string): NextResponse {
    return NextResponse.json(
        { error: 'ForbiddenError', message: `CSRF protection: ${reason}`, status: 403 },
        { status: 403 }
    );
}

export function checkCsrf(request: NextRequest): NextResponse | null {
    if (!STATE_CHANGING.has(request.method)) return null;

    // Sec-Fetch-Site
    const secFetchSite = request.headers.get('sec-fetch-site');
    if (secFetchSite === 'cross-site') {
        return csrfReject('cross-site request blocked');
    }

    // check origin
    const origin = request.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        return csrfReject('origin mismatch');
    }

    // custom header
    if (request.headers.get('x-requested-with') !== 'XMLHttpRequest') {
        return csrfReject('missing X-Requested-With');
    }

    return null;
}