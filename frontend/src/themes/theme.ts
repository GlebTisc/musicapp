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
            zIndex: 1300,
          },
        },
      },
  },
})