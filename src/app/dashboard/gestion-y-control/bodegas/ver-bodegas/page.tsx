import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';

export const metadata = { title: `Visualizar bodegas | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <h5>Acá va la tabla para visualizar las bodegas creadas</h5>
};