import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, importSPKI, JWTPayload } from 'jose';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://api-gateway:8000';
const REFRESH_ENDPOINT = 'api/auth/refresh';

const protectedPaths = ['/profile'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register'];

const matches = (pathname: string, paths: string[]) =>
    paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

let publicKeyPromise: Promise<CryptoKey> | undefined;

function getPublicKey(): Promise<CryptoKey> {
    if (!publicKeyPromise) {
        const raw = process.env.JWT_PUBLIC_KEY;
        if (!raw) {
            return Promise.reject(new Error('JWT_PUBLIC_KEY is not set'));
        }

        publicKeyPromise = importSPKI(atob(raw), 'RS256');
    }

    return publicKeyPromise;
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const key = await getPublicKey();
        const { payload } = await jwtVerify(token, key, { algorithms: ['RS256'] });
        return payload;
    } catch (error) {
        return null;
    }
}

async function tryRefresh(request: NextRequest): Promise<string[] | null> {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${BACKEND_URL}/${REFRESH_ENDPOINT}`, {
            method: 'POST',
            headers: { Cookie: `refreshToken=${refreshToken}`, Accept: 'application/json' },
        });
        if (!res.ok) return null;

        const setCookies = res.headers.getSetCookie?.() ?? [];
        return setCookies.length > 0 ? setCookies : null;
    } catch {
        return null;
    }
}

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
        const setCookies = await tryRefresh(request);

        if (setCookies) {
            // retry the request with new cookies
            const response = NextResponse.redirect(request.url);
            for (const c of setCookies) {
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