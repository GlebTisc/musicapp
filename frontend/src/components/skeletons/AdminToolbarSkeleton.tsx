import { Box } from '@mui/material';
import FieldSkeleton from '@/components/skeletons/FieldSkeleton';
import PaginationSkeleton from '@/components/skeletons/PaginationSkeleton';

export default function AdminToolbarSkeleton() {
    return (
        <Box
            component="div"
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 2,
            }}
        >
            <FieldSkeleton variant="rounded" width={110} height={40} />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PaginationSkeleton count={3} />
            </Box>

            <FieldSkeleton variant="rounded" width={240} height={40} />
        </Box>
    );
}