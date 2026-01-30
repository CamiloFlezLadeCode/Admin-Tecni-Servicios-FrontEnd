// 'use client';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { NavMovimientosGenerales } from '@/components/dashboard/comercial/movimientos-generales/NavMovimientosGenerales';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Movimientos generales</Typography>
            <NavMovimientosGenerales />
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}
