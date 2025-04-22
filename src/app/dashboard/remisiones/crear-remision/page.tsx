import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearRemision } from '@/components/dashboard/remisiones/crear/FormularioCrearRemision';

export const metadata = { title: `Maestro | Clientes | ${config.site.name}` } satisfies Metadata;

export default function CrearRemisionPage(): React.JSX.Element {
  return <FormularioCrearRemision />;
}