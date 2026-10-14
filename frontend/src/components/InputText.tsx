import { SvgIconComponent } from "@mui/icons-material";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material"

type InputTextProps = TextFieldProps & {
    startIcon?: SvgIconComponent,
    endIcon?: SvgIconComponent
};

export default function InputText({startIcon: StartIcon, endIcon: EndIcon, ...props}: InputTextProps)
{
    return (
        <TextField 
            {...props}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            {StartIcon && <StartIcon />}
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            {EndIcon && <EndIcon />}
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}