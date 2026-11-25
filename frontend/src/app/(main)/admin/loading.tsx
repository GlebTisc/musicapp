import AdminTableSkeleton from "@/components/skeletons/AdminTableSkeleton";
import AdminToolbarSkeleton from "@/components/skeletons/AdminToolbarSkeleton";
import { Box } from "@mui/material";

export default function AdminLoading() {
    return (
        <Box sx={{ width: '100%' }}>
            <AdminToolbarSkeleton />
            <AdminTableSkeleton rows={10} columns={4} />
        </Box>
    );
}