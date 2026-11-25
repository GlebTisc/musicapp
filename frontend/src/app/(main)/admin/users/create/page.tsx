import { Box, Typography } from '@mui/material';
import { createUser } from '../../actions';
import UserForm from '@/components/admin/UserForm';

export default function CreateUserPage() {
    return (
        <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>
            <Typography variant="h5" color="text.primary" sx={{ mb: 2 }}>
                Create user
            </Typography>
            <UserForm action={createUser} mode="create" />
        </Box>
    );
}