import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
// import { FormularioCrearCliente } from '@/components/dashboard/maestro/clientes/formulario-crear-cliente';
export const metadata = { title: `Ver devoluciones | ${config.site.name}` } satisfies Metadata;

export default function VerDevolucionesPage(): React.JSX.Element {
  // PARA ANEXAR VARIOS COMPONENTES
    return (
      <div>
            <h5>AQUÍ VAMOS A VER LA DEVOLUCIONES CREADAS</h5>
      </div>
    );
  }