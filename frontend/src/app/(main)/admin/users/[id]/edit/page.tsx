import { notFound } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { UserItemApiResponse } from '@/schemas/admin';
import { proxyFetch } from '@/lib/proxyFetch';
import { updateUser } from '../../../actions';
import UserForm from '@/components/admin/UserForm';

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const result = await proxyFetch({
        method: 'GET',
        path: `/api/user/getOne/${id}`,
        schema: UserItemApiResponse,
    });

    if (!result.ok) {
        if (result.status === 404) notFound();
        throw new Error(result.message);
    }

    const user = result.data.data;
    const action = updateUser.bind(null, id);

    return (
        <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>
            <Typography variant="h5" color="text.primary" sx={{ mb: 2 }}>
                Edit: {user.username}
            </Typography>
            <UserForm
                action={action}
                mode="edit"
                initial={{ email: user.email, username: user.username, role: user.role }}
                editingId={id}
            />
        </Box>
    );
}