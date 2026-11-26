import { Box } from "@mui/material";

const errorStyle = {
    fontSize: "0.75rem",
    lineHeight: 1.4,
    color: "error.main"
};

export default function FieldErrors({ errors }: { errors?: string[] }) {
    // if no errors given - return
    if (!errors?.length) return null;

    return (
        <Box
            component="span"
            sx={{
                m: 0,
                pl: 2,
                display: "block",
                ...errorStyle
            }}
        >
            {errors.map((error, index) => (
                <Box key={`${index}~${error}`} component="span" sx={{ display: "block" }}>{error}</Box>
            ))}
        </Box>
    );
}