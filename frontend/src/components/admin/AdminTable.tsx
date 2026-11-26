"use client"

import { Column, SectionKey } from "@/app/(main)/admin/_lib/sections";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";
import { useAuth } from "@/hooks/auth";
import AdminTableSkeleton from "../skeletons/AdminTableSkeleton";

export default function AdminTable<T extends { _id: string }>({
    section, columns, rows
}: {
    section: SectionKey, columns: Column<T>[], rows: T[]
}) {
    const { user, isLoading } = useAuth();
    const currentUserId = user?._id;

    // if rows are empty - return the warning
    if (rows.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    Nothing here...
                </Typography>
            </Box>
        );
    }

    // return skeleton if user haven't been loaded yet
    if (isLoading && user === undefined) {
        return <AdminTableSkeleton rows={10} columns={columns.length} />;
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map(column => (<TableCell key={column.key}>
                        <Typography variant="subtitle2" color="text.primary">
                            {column.label}
                        </Typography>
                    </TableCell>))}
                    <TableCell key="actions" align="right">
                        <Typography variant="subtitle2" color="text.primary">
                            Actions
                        </Typography>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(row => {
                    const isSelf = row._id === currentUserId;

                    return (<TableRow key={String(row._id)}>
                        {columns.map(column => (
                            <TableCell key={column.key}>
                                <Typography variant="body2">
                                    {String(row[column.key])}
                                </Typography>
                            </TableCell>
                        ))}
                        <TableCell align="right">
                            <IconButton LinkComponent={Link} href={`/admin/${section}/${String(row._id)}/edit`} color="secondary">
                                <Edit />
                            </IconButton>
                            {!isSelf && <DeleteButton
                                section={section}
                                id={row._id}
                                disabled={isSelf}
                                title={isSelf ? "You can't delete your own account" : undefined}
                            />}
                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
}