export interface TokenPayload {
    id: string;
    email?: string;
    role?: string;
};

export function isTokenPayload(payload: unknown): payload is TokenPayload {
    // check that payload is object
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }

    const obj = payload as Record<string, unknown>;
    return typeof obj.id === 'string';
}