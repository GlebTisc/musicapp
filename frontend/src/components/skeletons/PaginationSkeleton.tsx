import { Box } from "@mui/material";
import FieldSkeleton from "./FieldSkeleton";

export default function PaginationSkeleton({ count }: { count: number }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <FieldSkeleton variant="rectangular" width="32px" height="32px" />
            {Array.from({ length: count }, (_, index) => (
                <FieldSkeleton key={index} variant="circular" width="32px" height="32px" />
            ))}
            <FieldSkeleton variant="rectangular" width="32px" height="32px" />
        </Box>
    );
}