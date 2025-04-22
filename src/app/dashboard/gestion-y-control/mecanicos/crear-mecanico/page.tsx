import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearMecanico } from '@/components/dashboard/gestion-y-control/mecanicos/crear/FormularioCrearMecanico';

export const metadata = { title: `Crear mecánico | ${config.site.name}` } satisfies Metadata;

export default function CrearMecanicoPage(): React.JSX.Element {
    return <FormularioCrearMecanico />;
}