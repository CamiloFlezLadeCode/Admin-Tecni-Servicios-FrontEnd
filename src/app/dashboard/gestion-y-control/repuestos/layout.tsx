import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NavBarRepuestos } from '@/components/dashboard/gestion-y-control/repuestos/NavBarRepuestos';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>Repuestos</Typography>
            <NavBarRepuestos />
            {/* <main style={{ padding: '1rem' }}>{children}</main> */}
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}