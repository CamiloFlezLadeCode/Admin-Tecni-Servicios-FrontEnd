import { config } from '@/config';
import type { Metadata } from 'next';
import * as React from 'react';

export const metadata = { title: `Vehiculos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <></>;
};