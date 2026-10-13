"use client"

import { TextField, InputAdornment, IconButton, TextFieldProps } from "@mui/material";
import { Lock, VisibilityOff, Visibility } from "@mui/icons-material";
import { useState } from "react";

export default function InputPassword(props: TextFieldProps)
{
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <TextField
            {...props}
            type={showPassword ? "text" : "password"}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Lock />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(prevState => !prevState)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}