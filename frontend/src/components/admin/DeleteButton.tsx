"use client"

import { useTransition } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import { deleteItem } from '@/app/(main)/admin/actions';
import type { SectionKey } from '@/app/(main)/admin/_lib/sections';

export function DeleteButton({ 
    section, id, disabled, title 
}: { 
    section: SectionKey; id: string, disabled?: boolean, title?: string
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <IconButton
            color="error"
            disabled={disabled || isPending}
            title={title}
            aria-label={title ?? "Delete"}
            onClick={() => {
                if (disabled) return;
                
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