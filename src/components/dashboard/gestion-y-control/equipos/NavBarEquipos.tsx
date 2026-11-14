'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavEquipos = [
    {
        label: 'Ver equipos',
        path: paths.dashboard.gestionycontrolequiposver,
        icon: Eye
    },
    {
        label: 'Crear equipo',
        path: paths.dashboard.gestionycontrolequiposcrear,
        icon: Plus
    },
    {
        label: 'Estado de equipos',
        path: paths.dashboard.gestionycontrolequiposubicacion,
        icon: MapPin
    }
];

export function NavBarEquipos(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavEquipos} altoAutomatico />;
}
