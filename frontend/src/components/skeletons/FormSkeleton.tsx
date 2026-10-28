import { mainTheme } from "@/themes/theme";
import { Stack } from "@mui/material";
import FieldSkeleton from "./FieldSkeleton";

export default function FormSkeleton() {
    return (<Stack spacing={3} component="div">
        <FieldSkeleton variant="text" />
        <FieldSkeleton variant="text" />
        <FieldSkeleton variant="text" />
        <FieldSkeleton variant="text" />
        <FieldSkeleton variant="rectangular" height="64px" />
    </Stack>);
}