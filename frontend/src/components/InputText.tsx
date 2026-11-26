import { SvgIconComponent } from "@mui/icons-material";
import { TextField, TextFieldProps, InputAdornment, IconButton, SlotProps } from "@mui/material"

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
    slotProps,
    ...props
}: InputTextProps) {
    // slot props can be function - return object instead
    const externalSlotProps = typeof slotProps?.input === 'function'
        ? {}
        : slotProps?.input;

    return (
        <TextField
            {...props}
            slotProps={{
                ...slotProps,
                input: {
                    ...externalSlotProps,
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
                },
                formHelperText: {
                    component: "div",
                    ...slotProps?.formHelperText
                }
            }}
        />
    );
}