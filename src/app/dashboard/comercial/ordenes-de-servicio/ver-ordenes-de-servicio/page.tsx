import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarOrdenesDeServicio } from '@/components/dashboard/comercial/ordenes-de-servicio/ver/TablaVisualizarOrdenesDeServicio';
export const metadata = { title: `Ver ordenes de servicio | ${config.site.name}` } satisfies Metadata;

export default function VerRemisionesPage(): React.JSX.Element {
    return <TablaVisualizarOrdenesDeServicio />;
}