"use client"

import { usePathname, useSearchParams } from "next/navigation";
import { Pagination as MuiPagination, PaginationItem, type PaginationProps } from "@mui/material";
import RouterLink from "./RouterLink";
import { Suspense } from "react";
import PaginationSkeleton from "./skeletons/PaginationSkeleton";

type CustomPaginationProps = PaginationProps & {
    count: number
};

function Pagination({ count, ...props }: CustomPaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (page: number | string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        // if page = 1 (by default) - remove from params
        if (Number(page) === 1) {
            params.delete('page');
        } else {
            params.set('page', String(page));
        }

        const queryString = params.toString();
        return queryString && page ? `${pathname}?${queryString}` : pathname;
    }

    return (<MuiPagination
        count={count}
        page={currentPage}
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

export default function PaginationWrapper({ count, ...props }: CustomPaginationProps) {
    return (
        <Suspense fallback={<PaginationSkeleton count={3} />}>
            <Pagination count={count} {...props} />
        </Suspense>
    );
}