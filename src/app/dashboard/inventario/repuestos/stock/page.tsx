import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
export const metadata = { title: `Stock repuestos | ${config.site.name}` } satisfies Metadata;

export default function CrearDevolucionPage(): React.JSX.Element {
    return <h4>En desarrollo, proximamente en producción...</h4>;
}