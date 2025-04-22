import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';


export const metadata = { title: `Maestro | Mecánicos | ${config.site.name}` } satisfies Metadata;

export default function MecanicosPage(): React.JSX.Element {
    return (
      <div>
        <h1>Gestión de Mecanicos</h1>
        <p>Aquí va el contenido para mecanicos.</p>
      </div>
    );
  }