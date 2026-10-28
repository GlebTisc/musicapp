import { mainTheme } from "@/themes/theme";
import { alpha, Skeleton, type SkeletonProps } from "@mui/material";

export default function FieldSkeleton({ ...props }: SkeletonProps) {
    return <Skeleton height="32px" sx={{ bgcolor: alpha(mainTheme.palette.text.primary, 0.25) }} {...props} />
}