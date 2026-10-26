"use client"

import { Stack, FormControlLabel, Checkbox, Button, Divider, Typography } from "@mui/material";
import { TextFormat, Email } from "@mui/icons-material";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import InputPassword from "@/components/auth/InputPassword";
import InputText from "@/components/InputText";
import RouterLink from "@/components/RouterLink";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";
import { isApiErrorPayload } from "@/lib/apiError";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', email: '', rememberMe: false })
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string>('');
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // redirect if user is authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // clear field errors on input change
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setGlobalError('');
        setFieldErrors({});

        // try to register
        try {
            await dispatch(registerUser(formData)).unwrap();
            router.push('/');
        } catch (error: unknown) {
            // check if it's known error
            if (isApiErrorPayload(error)) {
                if (error.details && error.details.length > 0) {
                    const newFieldErrors: Record<string, string> = {};
                    error.details.forEach((detail) => {
                        newFieldErrors[detail.field] = detail.message;
                    });
                    setFieldErrors(newFieldErrors);
                } else {
                    setGlobalError(error.message);
                }
            } else {
                setGlobalError('Unknown error occured. Please try again later...')
            }
        }
    }

    return (
        <Stack spacing={3} component="form">
            <AuthFormHeader header="Register" />
            <InputText label="Username" name="username" value={formData.username} onChange={handleChange} startIcon={TextFormat} />
            <InputText label="Email" name="email" value={formData.email} onChange={handleChange} startIcon={Email} />
            <InputPassword label="Password" name="password" value={formData.password} onChange={handleChange} />
            <InputPassword label="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.rememberMe}
                        name="rememberMe"
                        onChange={handleChange}
                    />
                }
                label="Remember me"
            />
            <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
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