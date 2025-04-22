import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarProyectos } from '@/components/dashboard/gestion-y-control/repuestos/ver/TablaVisualizarRepuestos';

export const metadata = { title: `Visualizar repuestos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarProyectos />;
}