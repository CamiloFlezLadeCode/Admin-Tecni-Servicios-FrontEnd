import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearRepuesto } from '@/components/dashboard/gestion-y-control/repuestos/crear/FormularioCrearRepuesto';

export const metadata = { title: `Crear repuesto | ${config.site.name}` } satisfies Metadata;

export default function CrearMecanicoPage(): React.JSX.Element {
    return <FormularioCrearRepuesto />;
}