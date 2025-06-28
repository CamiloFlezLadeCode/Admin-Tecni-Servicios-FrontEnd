import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarDevoluciones } from '@/components/dashboard/comercial/devoluciones/ver/TablaVisualizarDevoluciones';
export const metadata = { title: `Ver devoluciones | ${config.site.name}` } satisfies Metadata;

export default function VerDevolucionesPage(): React.JSX.Element {
  return <TablaVisualizarDevoluciones />;
}