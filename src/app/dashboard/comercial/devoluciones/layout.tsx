// app/dashboard/maestro/layout.tsx
import * as React from 'react';
import { MainNav } from '@/components/dashboard/maestro/AppBar';
import Typography from '@mui/material/Typography';
// import { NavDevoluciones } from '@/components/dashboard/devoluciones/NavDevoluciones';
import { NavDevoluciones } from '@/components/dashboard/comercial/devoluciones/NavDevoluciones';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
        <Typography variant="h6" style={{fontWeight: 'bold'}}>Devoluciones</Typography>
        <NavDevoluciones />
      {/* <main style={{ padding: '1rem' }}>{children}</main> */}
      <main style={{marginTop: '0.5rem'}}>{children}</main>
    </div>
  );
}
