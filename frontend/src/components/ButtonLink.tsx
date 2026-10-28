import { mainTheme } from "@/themes/theme";
import { Button, type ButtonProps } from "@mui/material";
import Link from "next/link";

export default function ButtonLink({ children, ...props }: ButtonProps) {
    return (
        <Button
            LinkComponent={Link}
            sx={{
                color: mainTheme.palette.text.primary,
                textTransform: "none",
                '&:hover': {
                    bgcolor: mainTheme.palette.primary.light,
                },
                '&.Mui-disabled': {
                    bgcolor: mainTheme.palette.secondary.dark,
                    color: mainTheme.palette.primary.light,
                    '& .MuiSvgIcon-root': {
                        color: mainTheme.palette.primary.light
                    }
                }
            }}
            {...props}
        >
            {children}
        </Button>
    )
}