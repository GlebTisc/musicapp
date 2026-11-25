import { Box } from '@mui/material';
import FieldSkeleton from '@/components/skeletons/FieldSkeleton';

export default function AdminTableSkeleton({
    rows = 10,
    columns = 4
}: {
    rows?: number;
    columns?: number;
}) {
    return (
        <Box sx={{ width: '100%', px: 2 }}>
            {Array.from({ length: rows }, (_, i) => (
                <Box
                    key={i}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columns}, 1fr) auto`,
                        alignItems: 'center',
                        gap: 2,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {Array.from({ length: columns }, (_, j) => (
                        <FieldSkeleton key={j} variant="text" height={24} />
                    ))}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FieldSkeleton variant="circular" width={24} height={24} />
                        <FieldSkeleton variant="circular" width={24} height={24} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}