import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, importSPKI, JWTPayload } from 'jose';

const protectedPaths = ['/profile'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register'];

const matches = (pathname: string, paths: string[]) =>
    paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

let publicKey: CryptoKey | undefined;

/**
 * Get base64 encoded key 
 * 
 * @returns 
 */
async function getPublicKey(): Promise<CryptoKey> {
    if (!publicKey) {
        const pem = atob(process.env.JWT_PUBLIC_KEY!);
        publicKey = await importSPKI(pem, 'RS256');
    }
    return publicKey;
}

/**
 * Verify token
 * 
 * @param token 
 * @returns 
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const key = await getPublicKey();
        const { payload } = await jwtVerify(token, key, { algorithms: ['RS256'] });
        return payload;
    } catch (error) {
        console.warn('verifyToken failed:', error);
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = matches(pathname, protectedPaths);
    const isAdmin = matches(pathname, adminPaths);
    const isAuth = matches(pathname, authPaths);
    const needsAuth = isProtected || isAdmin;

    const token = request.cookies.get('accessToken')?.value;
    const payload = token ? await verifyToken(token) : null;

    if (needsAuth && !payload) {
        return NextResponse.redirect(new URL('/login', request.url));
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