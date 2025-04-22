// app/dashboard/maestro/layout.tsx
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NavRemisiones } from '@/components/dashboard/remisiones/NavRemisiones';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
        <Typography variant="h5" style={{fontWeight: 'bold'}}>Remisiones</Typography>
        <NavRemisiones />
      {/* <main style={{ padding: '1rem' }}>{children}</main> */}
      <main style={{marginTop: '0.5rem'}}>{children}</main>
    </div>
  );
}
