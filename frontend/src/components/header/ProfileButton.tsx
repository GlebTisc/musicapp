import { useAuth } from "@/hooks/auth";
import { AccountCircle } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import ButtonOutline from "../ButtonOutline";
import Link from "next/link";

export default function ProfileButton() {
    const { user, isAuthenticated } = useAuth();

    return isAuthenticated
        ? (
            <Stack spacing={1} direction="row" sx={{alignItems: "center"}}>
                <AccountCircle />
                <Typography component="h6">
                    {user?.username}
                </Typography>
            </Stack>
        )
        : (
            <ButtonOutline component={Link} href="/login">
                Login
            </ButtonOutline>
        );
}