import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
    layout: {
        drawer: {
            width: {
                mobile: 240,
                desktop: 280
            }
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    zIndex: 99,
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: "#3d0066"
                }
            }
        }
    },
    palette: {
        primary: {
            main: "#b6ccfe",
            light: "#ccdbfd",
            dark: "#abc4ff"
        },
        secondary: {
            main: "#5c0099",
            light: "#c86bfa",
            dark: "#3d0066"
        },
        text: {
            primary: "#5c0099",
            secondary: "#c86bfa",
            disabled: "#020344"
        }
    },
})