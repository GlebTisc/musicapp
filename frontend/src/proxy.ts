import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { tryRefreshToken, verifyToken } from './lib/jwt';

const protectedPaths = ['/profile'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register'];

const matches = (pathname: string, paths: string[]) =>
    paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    const isProtected = matches(pathname, protectedPaths);
    const isAdmin = matches(pathname, adminPaths);
    const isAuth = matches(pathname, authPaths);
    const needsAuth = isProtected || isAdmin;

    const token = request.cookies.get('accessToken')?.value;
    const payload = token ? await verifyToken(token) : null;

    // if access token expired, but refresh token is ok - try to refresh
    if (!payload && needsAuth) {
        const refreshResult = await tryRefreshToken(request);

        if (refreshResult) {
            // retry the request with new cookies
            const response = NextResponse.redirect(request.url);
            for (const c of refreshResult.setCookies) {
                response.headers.append('Set-Cookie', c);
            }
            return response;
        }
    }

    if (needsAuth && !payload) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && payload?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isAuth && payload) {
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
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};