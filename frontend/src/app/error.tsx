"use client"

import { ErrorPage } from "@/components/ErrorPage";

export default function MainErrorPage({
    error,
    reset
}: {
    error: Error & { digest: string },
    reset: () => void
}) {
    return <ErrorPage error={error} reset={reset} backHref="/" backLabel="To the main page" />;
}