import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';

export const metadata = { title: `Sin permisos | ${config.site.name}` } satisfies Metadata;

export default function SinPermisos(): React.JSX.Element {
    return (
        <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
            <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
                <Box>
                    <Box
                        component="img"
                        alt="Under development"
                        src="/assets/error-401.png"
                        sx={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
                    />
                </Box>
                <Typography variant="h3" sx={{ textAlign: 'center' }}>
                    401: No tienes permisos para acceder a esta página
                </Typography>
                <Button
                    component={RouterLink}
                    href={paths.home}
                    startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
                    variant="contained"
                >
                    Regresar
                </Button>
            </Stack>
        </Box>
    );
}
