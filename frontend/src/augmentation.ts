export {};

declare module "@mui/material/styles" {
    interface Theme {
        layout: {
            drawer: {
                width: {
                    mobile: number;
                    desktop: number;
            };
          };
        };
    }

    interface ThemeOptions {
        layout?: {
            drawer?: {
                width?: {
                    mobile?: number;
                    desktop?: number;
                };
            };
        };
    }
}