"use client"

import { Stack, FormControlLabel, Checkbox, Button, Divider, Typography } from "@mui/material";
import { TextFormat } from "@mui/icons-material";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import InputPassword from "@/components/auth/InputPassword";
import InputText from "@/components/InputText";
import RouterLink from "@/components/RouterLink";
import { useState } from "react";

export default function LoginPage()
{
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    return (
        <Stack spacing={3} component="form">
            <AuthFormHeader header="Log in into account" />
            <InputText label="Username" value={username} onChange={(e) => setUsername(e.target.value)} startIcon={TextFormat}/>
            <InputPassword label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={rememberMe}
                        onChange={(_, checked) => {setRememberMe(checked)}}
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