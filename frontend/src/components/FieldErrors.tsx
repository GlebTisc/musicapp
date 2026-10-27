import { Box } from "@mui/material";

export default function FieldErrors({ errors }: { errors: string[] }) {
    // if no errors given - return
    if (!errors?.length) return null;

    // if array contains only 1 error - show it
    if (errors.length === 1) {
        return <> {errors[0]} </>
    }

    return (
        <Box
            component="ul"
            sx={{
                m: 0,
                pl: 2,
                fontSize: "0.75rem",
                lineHeight: 1.4,
            }}
        >
            {errors.map((error, index) => (
                <li key={index}>{error}</li>
            ))}
        </Box>
    );
}