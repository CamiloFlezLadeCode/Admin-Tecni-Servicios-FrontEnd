import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarEntradasRepuestos } from '@/components/dashboard/inventario/repuestos/TablaVisualizarEntradasRepuestos';
export const metadata = { title: `Entradas repuestos | ${config.site.name}` } satisfies Metadata;

export default function CrearDevolucionPage(): React.JSX.Element {
    return <TablaVisualizarEntradasRepuestos />;
}