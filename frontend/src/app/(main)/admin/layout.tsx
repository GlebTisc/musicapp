"use client"

import ButtonLink from "@/components/ButtonLink";
import { useAuth } from "@/hooks/auth";
import { mainTheme } from "@/themes/theme";
import { People } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const menuItems = [
    { name: "Users", href: "/admin/users", icon: <People /> },
];

function MenuListContent({ pathname }: { pathname: string }) {
    return (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", width: "100%" }}>
            {menuItems.map(item => {
                const isActive = pathname === item.href;
                return (
                    <Box component="span" key={item.name} sx={{ p: 2 }}>
                        <ButtonLink
                            href="/admin/users"
                            startIcon={item.icon}
                            disabled={isActive}
                        >
                            <Typography variant="h6">{item.name}</Typography>
                        </ButtonLink>
                    </Box>
                );
            })}
        </Stack>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAdmin, isLoading } = useAuth();

    // if user is not admin - redirect on the home page
    useEffect(() => {
        if (!isLoading && !isAdmin) {
            router.replace('/');
        }
    }, [isAdmin, isLoading, router]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
            <Box sx={{
                borderBottomColor: mainTheme.palette.text.primary,
                borderBottomStyle: "solid",
                borderBottomWidth: 3
            }}>
                <MenuListContent pathname={pathname} />
            </Box>
            <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
                {children}
            </Box>
        </Box>
    );
}