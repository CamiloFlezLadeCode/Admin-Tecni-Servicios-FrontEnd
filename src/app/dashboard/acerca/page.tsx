import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Acerca } from '@/components/dashboard/acerca/Acerca';

export const metadata = { title: `Devoluciones | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <Acerca />
}