import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Municipios } from '@/components/dashboard/municipios/Municipios';

export const metadata = { title: `Municipios | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <Municipios />
}