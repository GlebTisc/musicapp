import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/profile'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register'];

type JwtPayload = { role?: string };

/**
 * Parse JWT payload WITHOUT VERIFYING!!!; backend checks token
 * 
 * @param token 
 * @returns 
 */
function getRole(token: string): string | undefined {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return undefined;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload;

        return payload.role;
    } catch {
        return undefined;
    }
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
    const isAdmin = adminPaths.some((p) => pathname.startsWith(p));
    const isAuth = authPaths.some((p) => pathname.startsWith(p));

    // check accessToken cookie
    const token = request.cookies.get('accessToken')?.value;

    // if token doesn't exist and route is protected / admin - redirect on the homepage
    if ((isProtected || isAdmin) && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // if user is authenticated and route requires guest - redirect
    if (isAuth && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // if user is authorized - redired on the dashboard
    if (isAdmin && token && getRole(token) !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};