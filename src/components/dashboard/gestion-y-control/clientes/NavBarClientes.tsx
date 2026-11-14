'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver clientes',
        path: paths.dashboard.gestionycontrolclientesver,
        icon: Eye
    },
    {
        label: 'Crear cliente',
        path: paths.dashboard.gestionycontrolclientescrear,
        icon: Plus
    }
];

export function NavBarClientes(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} />;
}
