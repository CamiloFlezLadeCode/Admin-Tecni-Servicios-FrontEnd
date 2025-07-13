import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';
import { TablaVisualizarEstadoDeCuenta } from '@/components/dashboard/comercial/estado-de-cuenta/ver/TablaVisualizarEstadoDeCuenta';

export const metadata = { title: `Estado de cuenta | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return (
        <>
            <Typography variant="h6" style={{fontWeight: 'bold'}}>Estado de cuenta</Typography>
            <TablaVisualizarEstadoDeCuenta />
        </>
    );
}