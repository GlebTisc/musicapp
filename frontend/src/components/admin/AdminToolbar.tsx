"use client";

import { Box } from "@mui/material";
import ButtonLink from "../ButtonLink";
import PaginationWrapper from "../Pagination";
import InputText from "../InputText";
import { Search } from "@mui/icons-material";

export default function AdminToolbar({
    createHref, searchValue, page, totalPages
}: {
    createHref: string, searchValue: string, page: number, totalPages: number
}) {
    return (<Box
        component="div"
        sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly"
        }}
    >
        <ButtonLink href={createHref} variant="outlined">Create</ButtonLink>
        <PaginationWrapper page={page} count={totalPages} color="secondary" />
        <InputText
            name="search"
            value={searchValue}
            placeholder="Search the user"
            endIcon={Search}
            sx={{
                '& .MuiInputBase-input': {
                    padding: "10px"
                }
            }}
        />
    </Box>);
}