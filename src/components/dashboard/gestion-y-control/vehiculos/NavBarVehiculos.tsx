'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver vehículos',
        path: paths.dashboard.gestionycontrolvehiculosver,
        icon: Eye
    },
    {
        label: 'Crear vehículo',
        path: paths.dashboard.gestionycontrolvehiculoscrear,
        icon: Plus
    }
];

export function NavBarVehiculos(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} altoAutomatico />;
}
