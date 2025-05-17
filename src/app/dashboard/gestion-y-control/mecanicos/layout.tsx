import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NavBarMecanicos } from '@/components/dashboard/gestion-y-control/mecanicos/NavBarMecanicos';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
        <Typography variant="h6" style={{fontWeight: 'bold'}}>Mecánicos</Typography>
      <NavBarMecanicos />
      {/* <main style={{ padding: '1rem' }}>{children}</main> */}
      <main style={{marginTop: '0.5rem'}}>{children}</main>
    </div>
  );
}