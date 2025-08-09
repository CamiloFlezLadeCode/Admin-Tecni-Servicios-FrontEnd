import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import FormularioCrearBodega  from '@/components/dashboard/gestion-y-control/bodegas/crear/FormularioCrearBodega';

export const metadata = { title: `Crear bodega | ${config.site.name}` } satisfies Metadata;
export default function CrearBodegaPage(): React.JSX.Element {
    return <FormularioCrearBodega />
};