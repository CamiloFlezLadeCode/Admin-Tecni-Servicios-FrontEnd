import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';

export const metadata = { title: `Crear bodega | ${config.site.name}` } satisfies Metadata;
export default function CrearBodegaPage(): React.JSX.Element {
    return <h5>Acá va el formulariop para crear la bodega</h5>
};