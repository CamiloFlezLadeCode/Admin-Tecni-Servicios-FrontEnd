import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarBodegas } from '@/components/dashboard/gestion-y-control/bodegas/ver/TablaVisualizarBodegas';

export const metadata = { title: `Visualizar bodegas | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarBodegas />;
};