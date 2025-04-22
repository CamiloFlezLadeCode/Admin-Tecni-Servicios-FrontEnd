import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarProyectos } from '@/components/dashboard/gestion-y-control/proyectos/ver/TablaVisualizarProyectos';

export const metadata = { title: `Visualizar proyectos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarProyectos />;
}