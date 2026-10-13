import { AccountCircle } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Link from "next/link";

export default function ProfileButton()
{
    return (
        <IconButton LinkComponent={Link} href="/login">
            <AccountCircle />
        </IconButton>
    );
}