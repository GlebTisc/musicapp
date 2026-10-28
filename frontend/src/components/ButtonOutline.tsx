import { mainTheme } from "@/themes/theme";
import { alpha, Button, type ButtonProps } from "@mui/material";

interface ButtonOutlineProps extends ButtonProps {
    children: React.ReactNode
}

export default function ButtonOutline({ children, ...props }: ButtonOutlineProps) {
    return (
        <Button
            {...props}
            variant="outlined"
            sx={{
                borderColor: mainTheme.palette.text.primary,
                color: mainTheme.palette.text.primary,
                '&:hover': {
                    bgcolor: mainTheme.palette.primary.light,
                }
            }}
        >
            {children}
        </Button>
    );
}