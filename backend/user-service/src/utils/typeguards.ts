export function isTokenPayload(payload: unknown): payload is { id: string } {
    // check that payload is object
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }

    const obj = payload as Record<string, unknown>;
    return typeof obj.id === 'string';
}