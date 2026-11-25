"use client"

import { Stack, Button, Divider, Typography, Alert } from "@mui/material";
import { TextFormat, Email } from "@mui/icons-material";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import InputPassword from "@/components/auth/InputPassword";
import InputText from "@/components/InputText";
import RouterLink from "@/components/RouterLink";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";
import { detailsToFieldErrors, isApiErrorPayload } from "@/lib/apiError";
import FieldErrors from "@/components/FieldErrors";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { RegisterDTO, RegisterSchema } from "@/schemas/auth";

// key for form exceptions
const FORM_ERROR_KEY = "_form";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<{ username: string, password: string, confirmPassword: string, email: string }>(
        { username: '', password: '', confirmPassword: '', email: '' }
    );
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

        // if password was changed - clear confirm password error
        if (name === "password" && fieldErrors.confirmPassword) {
            setFieldErrors((prev) => ({ ...prev, confirmPassword: [] }));
        }

        // clear form errors if any field was changed
        if (fieldErrors[FORM_ERROR_KEY]?.length) {
            setFieldErrors((prev) => ({ ...prev, [FORM_ERROR_KEY]: [] }));
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({});

        const validation = RegisterSchema.safeParse(formData);

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

        // create body for the register request
        const payload: Omit<RegisterDTO, 'confirmPassword'> = {
            username: validation.data.username,
            email: validation.data.email,
            password: validation.data.password,
        };

        setIsSubmitting(true);

        // try to register
        try {
            await dispatch(registerUser(payload)).unwrap();
            router.replace('/');
        } catch (error: unknown) {
            setFieldErrors(
                isApiErrorPayload(error)
                    ? detailsToFieldErrors(error)
                    : { FORM_ERROR_KEY: ['Unknown error occured. Please try again later...'] }
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (isLoading && user === undefined)
        ? <FormSkeleton />
        : (
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                <AuthFormHeader header="Register" />
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
                <InputText
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    startIcon={Email}
                    disabled={isDisabled}
                    error={!!fieldErrors.email?.length}
                    helperText={<FieldErrors errors={fieldErrors.email} />}
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
                <InputPassword
                    label="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isDisabled}
                    error={!!fieldErrors.confirmPassword?.length}
                    helperText={<FieldErrors errors={fieldErrors.confirmPassword} />}
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
                    Register
                </Button>
                <Divider>
                    <Typography variant="body2">
                        OR
                    </Typography>
                </Divider>
                <Typography component="span" variant="body2">
                    Already have an account?{" "}
                    <RouterLink href="/login">
                        Log in
                    </RouterLink>
                </Typography>
            </Stack>
        );
}