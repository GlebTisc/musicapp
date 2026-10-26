import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// protected routes
const protectedPaths = ['/profile'];

// routes for unauthenticated users
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // check if route is protected
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

    // check accessToken cookie
    const accessToken = request.cookies.get('accessToken');

    // if token doesn't exist - redirect on the dashboard
    if (isProtectedPath && !accessToken) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // if user is authorized - redired on the dashboard
    if (isAuthPath && accessToken) {
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