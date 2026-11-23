import AdminToolbar from "@/components/admin/AdminToolbar";
import { adminSections, isSection } from "../_lib/sections";
import { notFound } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import { proxyFetch } from "@/lib/proxyFetch";
import { isAdminResponse } from "@/typeguards";
import { AnyRow } from "@/types";

type UserResponse = {
    status?: string | number,
    error?: string,
    message?: string,
    data?: {
        users: object[],
        total: number
    }
};

export default async function AdminUsersPage({
    params, searchParams
}: { params: Promise<{ section: string }>; searchParams: Promise<{ page?: string, search?: string }> }) {
    const { section } = await params;

    // check if section is valid
    if (!isSection(section)) {
        notFound();
    }

    const { page = 1, search = '' } = await searchParams;
    const config = adminSections[section];

    const res = await proxyFetch({
        method: "GET",
        path: `${config.endpoint}?page=${page}&search=${search}`
    });

    // handle an error
    if (!res?.ok) {
        throw new Error(`Couldn't load the section: HTTP ${res?.status}`)
    }

    let json: unknown;

    try {
        json = await res.json();
    } catch {
        throw new Error('API returned invalid data structure')
    }

    // check the body of the response
    if (!isAdminResponse(json)) {
        throw new Error('API returned unsupported json')
    }

    const items: AnyRow[] = json.data.items;

    return (
        <>
            <AdminToolbar
                createHref={`/admin/${section}`}
                searchValue={search}
                page={Number(page)}
                totalPages={0}
            />
        </>
    );
}