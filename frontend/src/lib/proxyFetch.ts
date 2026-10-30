import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ProxyOptions = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string,
    body?: unknown
}

export async function proxyFetch({ method, path, body }: ProxyOptions) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader })
    };

    const options: RequestInit = {
        method,
        headers,
        cache: "no-store"
    };

    if (body && ["POST", "PATCH", "PUT"].includes(method)) {
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${BACKEND_URL}${path}`, options);
        const data = await res.json();
        const response = new NextResponse(JSON.stringify(data), {
            status: res.status,
            headers: { 'Content-Type': 'application/json' }
        });

        // set cookies for the response
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (e: unknown) {

    }
}