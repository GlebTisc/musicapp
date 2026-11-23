"use client"

import { Column, SectionKey } from "@/app/(main)/admin/_lib/sections";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Link from "next/link";

export default function AdminTable<T extends { _id: string }>({
    section, columns, rows
}: {
    section: SectionKey, columns: Column<T>[], rows: T[]
}) {
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
                {rows.map(row => (
                    <TableRow key={String(row._id)}>
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
                            {/* DELETE button should be here */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}