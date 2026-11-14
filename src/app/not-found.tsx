import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { PaginaNoEncontrada } from '@/components/core/pagina-no-encontrada';

export const metadata = { title: `Not found | ${config.site.name}` } satisfies Metadata;

export default function NotFound(): React.JSX.Element {
  return <PaginaNoEncontrada titulo="404: Página no encontrada" textoBoton="Regresar" />;
}
