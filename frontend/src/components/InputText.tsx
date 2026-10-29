import { SvgIconComponent } from "@mui/icons-material";
import { TextField, TextFieldProps, InputAdornment, IconButton } from "@mui/material"

type InputTextProps = TextFieldProps & {
    startIcon?: SvgIconComponent,
    endIcon?: SvgIconComponent,
    onStartClick?: () => void,
    onEndClick?: () => void
};

export default function InputText({
    startIcon: StartIcon,
    endIcon: EndIcon,
    onStartClick,
    onEndClick,
    ...props
}: InputTextProps) {
    return (
        <TextField
            {...props}
            slotProps={{
                input: {
                    startAdornment: StartIcon && (
                        <InputAdornment position="start">
                            {onStartClick
                                ? (<IconButton onClick={onStartClick} type="button">
                                    <StartIcon />
                                </IconButton>
                                )
                                : <StartIcon />
                            }
                        </InputAdornment>
                    ),
                    endAdornment: EndIcon && (
                        <InputAdornment position="end">
                            {onEndClick
                                ? (<IconButton onClick={onEndClick} type="button">
                                    <EndIcon />
                                </IconButton>
                                )
                                : <EndIcon />
                            }
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}