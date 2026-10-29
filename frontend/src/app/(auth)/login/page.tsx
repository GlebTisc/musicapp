"use client"

import { Stack, Button, Divider, Typography, Alert } from "@mui/material";
import { z } from 'zod';
import { TextFormat } from "@mui/icons-material";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import InputPassword from "@/components/auth/InputPassword";
import InputText from "@/components/InputText";
import RouterLink from "@/components/RouterLink";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/hooks/auth";
import { loginUser } from "@/store/slices/authSlice";
import { isApiErrorPayload } from "@/lib/apiError";
import FieldErrors from "@/components/FieldErrors";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

// key for form exceptions
const FORM_ERROR_KEY = "_form";

const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required').max(50),
    password: z.string().min(1, 'Password is required').max(128),
});

type LoginDTO = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<{ username: string, password: string }>({ username: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const isDisabled = isSubmitting || (isLoading && user === undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // clear field errors on input change
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: [] }));
        }

        // clear form errors if any field was changed
        if (fieldErrors[FORM_ERROR_KEY]?.length) {
            setFieldErrors((prev) => ({ ...prev, [FORM_ERROR_KEY]: [] }));
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({});

        const validation = LoginSchema.safeParse(formData);

        if (!validation.success) {
            const newErrors: Record<string, string[]> = {};

            validation.error.issues.forEach((issue) => {
                const key = issue.path.length > 0 ? (issue.path[0] as string) : FORM_ERROR_KEY;

                if (!newErrors[key]) {
                    newErrors[key] = [];
                }
                newErrors[key].push(issue.message);
            });

            setFieldErrors(newErrors);
            return;
        }

        // create body for the login request
        const payload: LoginDTO = {
            username: validation.data.username,
            password: validation.data.password,
        };

        setIsSubmitting(true);

        // try log in
        try {
            await dispatch(loginUser(formData)).unwrap();
            router.push('/');
        } catch (error: unknown) {
            const newErrors: Record<string, string[]> = {};

            const addError = (key: string, message: string) => {
                if (!newErrors[key]) {
                    newErrors[key] = [];
                }
                newErrors[key].push(message);
            };

            // check if it's known error
            if (isApiErrorPayload(error)) {
                if (error.details && error.details.length > 0) {
                    error.details.forEach((detail) => {
                        const key = detail.field || FORM_ERROR_KEY;
                        addError(key, detail.message);
                    });
                } else {
                    addError(FORM_ERROR_KEY, error.message);
                }
            } else {
                addError(FORM_ERROR_KEY, 'Unknown error occured. Please try again later...');
            }

            setFieldErrors(newErrors);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (isLoading && user === undefined)
        ? <FormSkeleton />
        : (
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                <AuthFormHeader header="Log in into account" />
                <InputText
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    startIcon={TextFormat}
                    disabled={isDisabled}
                    error={!!fieldErrors.username?.length}
                    helperText={<FieldErrors errors={fieldErrors.username} />}
                />
                <InputPassword
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isDisabled}
                    error={!!fieldErrors.password?.length}
                    helperText={<FieldErrors errors={fieldErrors.password} />}
                />

                {fieldErrors[FORM_ERROR_KEY]?.length > 0 && (
                    <Stack spacing={1}>
                        {fieldErrors[FORM_ERROR_KEY].map((error, index) => (
                            <Alert key={index} severity="error">
                                {error}
                            </Alert>
                        ))}
                    </Stack>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2 }}
                    disabled={isDisabled}
                >
                    Log in
                </Button>
                <Divider>
                    <Typography variant="body2">
                        OR
                    </Typography>
                </Divider>
                <Typography component="span" variant="body2">
                    Don't have an account?{" "}
                    <RouterLink href="/register">
                        Register
                    </RouterLink>
                </Typography>
            </Stack>
        );
}