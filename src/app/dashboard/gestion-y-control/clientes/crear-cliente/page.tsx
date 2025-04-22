import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearCliente } from '@/components/dashboard/gestion-y-control/clientes/crear/FormularioCrearCliente';

export const metadata = { title: `Crear cliente | ${config.site.name}` } satisfies Metadata;

export default function CrearClientePage(): React.JSX.Element {
    return <FormularioCrearCliente />;
}