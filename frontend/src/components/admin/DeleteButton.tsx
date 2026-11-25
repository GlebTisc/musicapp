"use client"

import { useTransition } from 'react';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import { deleteItem } from '@/app/(main)/admin/actions';
import type { SectionKey } from '@/app/(main)/admin/_lib/sections';

export function DeleteButton({ section, id }: { section: SectionKey; id: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <IconButton
            color="error"
            disabled={isPending}
            aria-label="Delete"
            onClick={() => {
                startTransition(async () => {
                    const res = await deleteItem(section, id);
                    if ('error' in res) alert(res.error);
                });
            }}
        >
            <Delete />
        </IconButton>
    );
}