"use client"

import { useAuth } from "@/hooks/auth";
import { Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginLayout({ children }: LayoutProps<"/">) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    // redirect if user is authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main"
            }}
        >
            <Paper elevation={10} sx={{
                maxWidth: "400px",
                width: "100%",
                p: 4
            }}>
                {children}
            </Paper>
        </Box>
    );
}