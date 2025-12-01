import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarSalidasRepuestos } from '@/components/dashboard/inventario/repuestos/TablaVisualizarSalidasRepuestos';
export const metadata = { title: `Salidas repuestos | ${config.site.name}` } satisfies Metadata;

export default function SalidasRepuestosPage(): React.JSX.Element {
    return <TablaVisualizarSalidasRepuestos />;
}