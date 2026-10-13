"use client"

import { Stack } from "@mui/material";
import { TextFormat } from "@mui/icons-material";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import InputPassword from "@/components/auth/InputPassword";
import InputText from "@/components/auth/InputText";
import { useState } from "react";

export default function Login()
{
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    return (
        <Stack spacing={3} component="form">
            <AuthFormHeader header="Log in into account" />
            <InputText label="Username" value={username} onChange={(e) => setUsername(e.target.value)} startIcon={TextFormat}/>
            <InputPassword label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </Stack> 
    );
}