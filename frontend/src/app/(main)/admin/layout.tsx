"use client"

import ButtonLink from "@/components/ButtonLink";
import { People } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Users", href: "/admin", icon: <People /> },
];

function MenuListContent({ pathname }: { pathname: string }) {
    return (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
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

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Box>
                <MenuListContent pathname={pathname} />
            </Box>
            <Box>
                {children}
            </Box>
        </Box>
    );
}