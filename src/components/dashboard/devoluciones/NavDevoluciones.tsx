'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNav = [
    {
        label: 'Ver devoluciones',
        path: paths.dashboard.devolucionesver,
        icon: Eye
    },
    {
        label: 'Crear devolución',
        path: paths.dashboard.devolucionescrear,
        icon: Plus
    }
];

export function NavDevoluciones(): React.JSX.Element {
    return (
        <NavBarLayout
            ItemsLayout={ItemsNav}
            altoAutomatico
            sxEncabezado={{ zIndex: 'var(--mui-zIndex-appBar)' }}
            sxBarra={{ minHeight: '64px' }}
        />
    );
}
