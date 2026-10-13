import { Box, Container, Paper, Stack } from "@mui/material";

export default function LoginLayout({ children }: LayoutProps<"/">) {
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