import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarEquipos } from '@/components/dashboard/gestion-y-control/equipos/ver/TablaVisualizarEquipos';

export const metadata = { title: `Visualizar equipos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarEquipos />;
}