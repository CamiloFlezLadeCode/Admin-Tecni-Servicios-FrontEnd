import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarStockRepuestos } from '@/components/dashboard/inventario/repuestos/TablaVisualizarStockRepuestos';

export const metadata = { title: `Stock repuestos | ${config.site.name}` } satisfies Metadata;

export default function StockRepuestosPage(): React.JSX.Element {
  return <TablaVisualizarStockRepuestos />;
}