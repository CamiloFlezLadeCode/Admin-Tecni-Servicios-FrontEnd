import * as React from 'react';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';


export const metadata = { title: `Estado de cuenta | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return <></>;
}