import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearDevolucion } from '@/components/dashboard/comercial/devoluciones/crear/FormularioCrearDevolucion';
export const metadata = { title: `Stock equipos | ${config.site.name}` } satisfies Metadata;

export default function CrearDevolucionPage(): React.JSX.Element {
    return <FormularioCrearDevolucion />;
}