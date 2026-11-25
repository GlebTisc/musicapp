"use client"

import { useActionState } from 'react';
import { Alert, Box, Button, MenuItem, Stack } from '@mui/material';
import type { FormState } from '@/app/(main)/admin/actions';
import InputText from '../InputText';
import { Email, TextFormat } from '@mui/icons-material';
import FieldErrors from '../FieldErrors';
import InputPassword from '../auth/InputPassword';

type Props = {
    action: (prev: FormState, formData: FormData) => Promise<FormState>;
    mode: 'create' | 'edit';
    initial?: { email?: string; username?: string; role?: 'user' | 'admin' };
};

export default function UserForm({ action, mode, initial }: Props) {
    const [state, formAction, isPending] = useActionState(action, null);

    return (
        <Box component="form" action={formAction} sx={{ width: '100%', maxWidth: 480, p: 2 }}>
            <Stack spacing={2}>
                {state?.formError && <Alert severity="error">{state.formError}</Alert>}

                <InputText
                    label="Username"
                    name="username"
                    defaultValue={initial?.username}
                    startIcon={TextFormat}
                    error={!!state?.fieldErrors?.username?.length}
                    helperText={<FieldErrors errors={state?.fieldErrors?.username} />}
                    required
                />
                <InputText
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={initial?.email}
                    startIcon={Email}
                    error={!!state?.fieldErrors?.email?.length}
                    helperText={<FieldErrors errors={state?.fieldErrors?.email} />}
                    fullWidth
                    required
                />
                {mode === 'create' && (
                    <InputPassword
                        label="Password"
                        name="password"
                        error={!!state?.fieldErrors?.password?.length}
                        helperText={<FieldErrors errors={state?.fieldErrors?.password} />}
                        fullWidth
                        required
                    />
                )}
                <InputText
                    name="role"
                    label="Role"
                    select
                    defaultValue={initial?.role ?? 'user'}
                    error={!!state?.fieldErrors?.role?.length}
                    helperText={<FieldErrors errors={state?.fieldErrors?.role} />}
                    fullWidth
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </InputText>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {isPending ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
                </Button>
            </Stack>
        </Box>
    );
}