'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver repuestos',
        path: paths.dashboard.gestionycontrolrepuestosver,
        icon: Eye
    },
    {
        label: 'Crear repuesto',
        path: paths.dashboard.gestionycontrolrepuestoscrear,
        icon: Plus
    }
];

export function NavBarRepuestos(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} altoAutomatico />;
}
