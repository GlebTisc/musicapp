import { UserListSchema } from "@/schemas/admin";
import { Category, Music, User } from "@/types";

export type Column<T> = {
    key: keyof T & string;
    label: string;
    format?: (value: unknown) => string;
};

export const adminSections = {
    users: {
        label: "Users",
        endpoint: "/api/user",
        schema: UserListSchema,
        columns: [
            { key: "email", label: "Email" },
            { key: "username", label: "Username" },
            { key: "role", label: "Role" }
        ] satisfies Column<User>[]
    },
    categories: {
        label: "Categories",
        endpoint: "/api/category",
        schema: undefined,
        columns: [
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" }
        ] satisfies Column<Category>[]
    },
    music: {
        label: "Music",
        endpoint: "/api/music",
        schema: undefined,
        columns: [
            { key: "name", label: "Name" },
            { key: "artist", label: "Artist" },
        ] satisfies Column<Music>[]
    }
};

export type SectionKey = keyof typeof adminSections;
export const isSection = (section: string): section is SectionKey => section in adminSections;