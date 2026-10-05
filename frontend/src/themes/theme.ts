import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
    components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              zIndex: 1300,
            },
          },
        },
    },
})