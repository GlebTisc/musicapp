import { Box, Input, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar() {
    return (
        <Box component="div" sx={{
            display: "flex",
            justifyContent: "center",
            paddingInline: 2,
            width: {
                xs: "100%",
                md: "400px"
            }
        }}>
            <Input 
                placeholder="Type the name of a song..."
                sx={{
                    backgroundColor: "primary.light", 
                    borderRadius: "5px",
                    padding: "0 10px"
                }}
                fullWidth
            />
            <IconButton>
                <Search />
            </IconButton>
        </Box>
    )
}