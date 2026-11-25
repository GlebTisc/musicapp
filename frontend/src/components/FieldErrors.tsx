import { Box, colors } from "@mui/material";

const errorStyle = {
    fontSize: "0.75rem",
    lineHeight: 1.4,
    color: "error.main"
};

export default function FieldErrors({ errors }: { errors?: string[] }) {
    // if no errors given - return
    if (!errors?.length) return null;

    // if array contains only 1 error - show it
    if (errors.length === 1) {
        return <Box sx={errorStyle}> {errors[0]} </Box>
    }

    return (
        <Box
            component="ul"
            sx={{
                m: 0,
                pl: 2,
                ...errorStyle
            }}
        >
            {errors.map((error, index) => (
                <li key={index}>{error}</li>
            ))}
        </Box>
    );
}