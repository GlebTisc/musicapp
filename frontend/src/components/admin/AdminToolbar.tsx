"use client";

import { Box } from "@mui/material";
import ButtonLink from "../ButtonLink";
import Pagination from "../Pagination";
import InputText from "../InputText";
import { Search } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Route } from "next";

export default function AdminToolbar({
    createHref, searchValue, page, totalPages
}: {
    createHref: string, searchValue: string, page: number, totalPages: number
}) {
    const [value, setValue] = useState(searchValue);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const submit = () => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmedValue = value.trim();

        // check if value isn't empty
        if (trimmedValue) {
            params.set('search', trimmedValue);
        } else {
            params.delete('search');
        }

        // start with the 1st page
        params.delete('page');

        const queryParams = params.toString();
        const route = queryParams ? `${pathname}?${queryParams}` : pathname;
        startTransition(() => router.push(route as Route));
    }

    return (<Box
        component="div"
        sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            pointerEvents: isPending ? 'none' : 'auto'
        }}
    >
        <ButtonLink href={createHref} variant="outlined">Create</ButtonLink>
        <Pagination page={page} count={totalPages} search={value} color="secondary" />
        <InputText
            name="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onEndClick={submit}
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