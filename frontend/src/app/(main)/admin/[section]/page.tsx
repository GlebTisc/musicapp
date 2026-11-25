import AdminToolbar from "@/components/admin/AdminToolbar";
import { adminSections, isSection } from "../_lib/sections";
import { notFound } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import { proxyFetch } from "@/lib/proxyFetch";
import { AnyRow } from "@/types";
import { Box } from "@mui/material";
import { Route } from "next";

const PER_PAGE = 10;

export default async function AdminSectionPage({
    params,
    searchParams,
}: {
    params: Promise<{ section: string }>;
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const { section } = await params;
    if (!isSection(section)) notFound();

    const { page: pageParam = '1', search = '' } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);
    const config = adminSections[section];

    const result = await proxyFetch({
        method: 'GET',
        path: config.endpoint,
        searchParams: { page, search: search || undefined },
        schema: config.schema,
    });

    if (!result.ok) throw new Error(result.message);

    const { items, total = items.length } = (result.data as {
        data: { items: AnyRow[]; total?: number };
    }).data;

    const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

    return (
        <Box sx={{ width: '100%' }}>
            <AdminToolbar
                createHref={`/admin/${section}/create` as Route}
                searchValue={search}
                page={page}
                totalPages={pageCount}
            />
            <AdminTable section={section} columns={config.columns} rows={items} />
        </Box>
    );
}