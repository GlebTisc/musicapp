import { mainTheme } from "@/themes/theme";
import { alpha, Button } from "@mui/material";

export default function ButtonOutline({ children }: { children: React.ReactNode }) {
    return (
        <Button
            variant="outlined"
            sx={{
                borderColor: mainTheme.palette.text.primary,
                color: mainTheme.palette.text.primary,
                '&:hover': {
                    backgroundColor: alpha(mainTheme.palette.text.primary, 0.08),
                }
            }}
        >
            {children}
        </Button>
    );
}