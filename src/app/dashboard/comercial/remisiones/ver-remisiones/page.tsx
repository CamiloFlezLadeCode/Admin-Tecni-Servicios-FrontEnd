import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
// import { FormularioCrearCliente } from '@/components/dashboard/maestro/clientes/formulario-crear-cliente';
import { TablaVisualizarRemisiones } from '@/components/dashboard/comercial/remisiones/ver/TablaVisualizarRemisiones';
export const metadata = { title: `Ver remisiones | ${config.site.name}` } satisfies Metadata;

export default function VerRemisionesPage(): React.JSX.Element {
  return <TablaVisualizarRemisiones />;
}