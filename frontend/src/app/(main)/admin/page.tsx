import { redirect } from "next/navigation";
import { adminSections } from "./_lib/sections";

export default function AdminPage() {
    const firstSection = Object.keys(adminSections)[0];
    redirect(`/admin/${firstSection}`);
}