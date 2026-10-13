"use client"

import { Stack, Typography } from "@mui/material";

export default function AuthFormHeader({header}: {header: string})
{
    return (
        <Stack spacing={1} sx={{alignItems: "center"}}>
            <Typography variant="h4">
                {header}
            </Typography>
        </Stack>
    );
}