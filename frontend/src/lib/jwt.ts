import { NextRequest } from "next/server";
import { jwtVerify, importSPKI, JWTPayload } from 'jose';

export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
export const REFRESH_ENDPOINT = 'api/auth/refresh';

// endpoints that shouldn't trigger token refresh
export const SKIP_REFRESH_PATHS = [REFRESH_ENDPOINT, 'api/auth/login', 'api/auth/register'];

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

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const key = await getPublicKey();
        const { payload } = await jwtVerify(token, key, { algorithms: ['RS256'] });
        return payload;
    } catch (error) {
        return null;
    }
}

export function applySetCookies(cookieHeader: string, setCookies: string[]): string {
    const cookies = new Map<string, string>();

    for (const pair of cookieHeader.split(';')) {
        const trimmed = pair.trim();
        if (!trimmed) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        cookies.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
    }

    for (const sc of setCookies) {
        const firstPart = sc.split(';')[0];
        const eq = firstPart.indexOf('=');

        if (eq === -1) continue;

        const name = firstPart.slice(0, eq).trim();
        const value = firstPart.slice(eq + 1);

        // remove expired cookies, otherwise - set
        if (!value || /Max-Age=0\b/i.test(sc) || /Expires=Thu, 01 Jan 1970/i.test(sc)) {
            cookies.delete(name);
        } else {
            cookies.set(name, value);
        }
    }

    return Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
}

/**
 * Try to update token via refresh endpoint
 */
export async function tryRefreshToken(request: NextRequest): Promise<{
    setCookies: string[];
    cookieHeader: string;
} | null> {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) return null;

    try {
        const refreshResponse = await fetch(`${BACKEND_URL}/${REFRESH_ENDPOINT}`, {
            method: 'POST',
            headers: { Cookie: `refreshToken=${refreshToken}`, Accept: 'application/json' },
        });

        if (!refreshResponse.ok) return null;

        const setCookies = refreshResponse.headers.getSetCookie?.() ?? [];
        if (setCookies.length === 0) return null;

        const originalCookieHeader = request.cookies.getAll()
            .map((c) => `${c.name}=${c.value}`).join('; ');
        const cookieHeader = applySetCookies(originalCookieHeader, setCookies);

        return { setCookies, cookieHeader };
    } catch (e) {
        console.error('Token refresh failed:', e);
        return null;
    }
}