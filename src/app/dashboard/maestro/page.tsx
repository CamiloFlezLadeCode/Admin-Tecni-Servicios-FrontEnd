// app/dashboard/maestro/page.tsx
// 'use client';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';


export const metadata = { title: `Mestro | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <div>
      {/* <Typography variant="h4">Bienvenido al Panel del Maestro</Typography> */}
    </div>
  );
}
