"use client"

import { Stack, FormControlLabel, Checkbox, Button, Divider, Typography } from "@mui/material";
import { TextFormat, Email } from "@mui/icons-material";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import InputPassword from "@/components/auth/InputPassword";
import InputText from "@/components/InputText";
import RouterLink from "@/components/RouterLink";
import { useState } from "react";

export default function RegisterPage()
{
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    return (
        <Stack spacing={3} component="form">
            <AuthFormHeader header="Register" />
            <InputText label="Username" value={username} onChange={(e) => setUsername(e.target.value)} startIcon={TextFormat}/>
            <InputText label="Email" value={email} onChange={(e) => setEmail(e.target.value)} startIcon={Email}/>
            <InputPassword label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <InputPassword label="Confirm password" value={password} onChange={(e) => setPassword(e.target.value)}/>
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