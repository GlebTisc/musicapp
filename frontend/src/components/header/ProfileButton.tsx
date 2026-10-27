import { useAuth } from "@/hooks/auth";
import { AccountCircle } from "@mui/icons-material";
import { Icon, Typography } from "@mui/material";
import ButtonOutline from "../ButtonOutline";

export default function ProfileButton() {
    const { user, isAuthenticated } = useAuth();

    return isAuthenticated
        ? (
            <Icon>
                <AccountCircle />
                <Typography component="h6">
                    {user?.username}
                </Typography>
            </Icon >
        )
        : (
            <ButtonOutline>
                Login
            </ButtonOutline>
        );
}