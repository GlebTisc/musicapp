import { Stack, Skeleton } from "@mui/material";

export default function FormSkeleton() {
    return (<Stack spacing={3} component="div">
        <Skeleton variant="text" height="32px" />
        <Skeleton variant="text" height="32px" />
        <Skeleton variant="text" height="32px" />
        <Skeleton variant="text" height="32px" />
        <Skeleton variant="rectangular" height="64px" />
    </Stack>);
}