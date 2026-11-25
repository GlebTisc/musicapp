"use client"

import { usePathname } from "next/navigation";
import { Pagination as MuiPagination, PaginationItem, type PaginationProps } from "@mui/material";
import RouterLink from "./RouterLink";

type CustomPaginationProps = PaginationProps & {
    count: number,
    page: number,
    search?: string
};

export default function Pagination({ count, page, search, ...props }: CustomPaginationProps) {
    const pathname = usePathname();

    const createPageURL = (page: number | string | null) => {
        const params = new URLSearchParams();

        // if search is set - add it to params
        if (search) {
            params.set('search', search);
        }

        // if page = 1 (by default) - remove from params
        if (Number(page) === 1) {
            params.delete('page');
        } else {
            params.set('page', String(page));
        }

        const queryString = params.toString();
        return queryString ? `${pathname}?${queryString}` : pathname;
    }

    return (<MuiPagination
        count={count}
        page={page}
        renderItem={(item) => (
            <PaginationItem
                {...item}
                component={RouterLink}
                href={createPageURL(item.page)}
            />
        )}
        {...props}
    />);
}