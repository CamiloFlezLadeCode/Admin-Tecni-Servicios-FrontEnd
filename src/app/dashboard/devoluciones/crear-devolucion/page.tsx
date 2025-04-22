import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
// import { FormularioCrearCliente } from '@/components/dashboard/maestro/clientes/formulario-crear-cliente';
export const metadata = { title: `Maestro | Clientes | ${config.site.name}` } satisfies Metadata;

export default function CrearDevolucionPage(): React.JSX.Element {
  // PARA ANEXAR VARIOS COMPONENTES
    return (
      <div>
            <h5>AQUÍ VAMOS A CREAR LAS DEVOLUCIONES</h5>
      </div>
    );
  }