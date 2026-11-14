'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver usuarios generales',
        path: paths.dashboard.gestionycontrolusuariosgeneralesver,
        icon: Eye
    },
    {
        label: 'Crear usuario general',
        path: paths.dashboard.gestionycontrolusuariosgeneralescrear,
        icon: Plus
    },
    // {
    //     label: 'Editar usuario general',
    //     path: paths.dashboard.gestionycontrolusuariosgeneraleseditar,
    //     icon: PencilSimple
    // },
];

export function NavBarUsuariosGenerales(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} altoAutomatico />;
}
