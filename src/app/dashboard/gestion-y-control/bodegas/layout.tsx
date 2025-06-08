import * as React from 'react';
import { NavBarBodegas } from '@/components/dashboard/gestion-y-control/bodegas/NavBarBodegas';
import Typography from '@mui/material/Typography';

interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Bodegas</Typography>
            <NavBarBodegas />
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    )
};