"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';
import ButtonOutline from './ButtonOutline';
import type { Route } from 'next';

export function ErrorPage({
    error,
    reset,
    backHref,
    backLabel,
}: {
    error: Error & { digest?: string };
    reset: () => void;
    backHref: Route;
    backLabel: string;
}) {
    const router = useRouter();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                p: 3,
                width: '100%',
            }}
        >
            <Paper
                elevation={3}
                sx={{ maxWidth: 560, width: '100%', p: 4, textAlign: 'center', borderRadius: 2 }}
            >
                <Box
                    sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        color: 'error.contrastText',
                        mb: 2,
                    }}
                >
                    <ErrorOutlined fontSize="large" />
                </Box>

                <Typography variant="h4" color="text.primary" gutterBottom>
                    Something went wrong
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {error.message || 'Couldn\'t load the page. Please try again.'}
                </Typography>

                {error.digest && (
                    <>
                        <Button
                            size="small"
                            color="secondary"
                            onClick={() => setShowDetails((prev) => !prev)}
                            sx={{ mb: 2, textTransform: 'none' }}
                        >
                            {showDetails ? 'Hide details' : 'Show details'}
                        </Button>
                        <Collapse in={showDetails}>
                            <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ display: 'block', mb: 2, fontFamily: 'monospace' }}
                            >
                                {error.digest}
                            </Typography>
                        </Collapse>
                    </>
                )}

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                    <Button variant="contained" color="primary" onClick={reset}>
                        Retry
                    </Button>
                    <ButtonOutline
                        variant="outlined"
                        color="secondary"
                        onClick={() => router.push(backHref)}
                    >
                        {backLabel}
                    </ButtonOutline>
                </Stack>
            </Paper>
        </Box>
    );
}