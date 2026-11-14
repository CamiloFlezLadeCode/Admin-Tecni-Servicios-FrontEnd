import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { PaginaNoEncontrada } from '@/components/core/pagina-no-encontrada';

export const metadata = { title: `Not found | Errors | ${config.site.name}` } satisfies Metadata;

export default function NotFound(): React.JSX.Element {
  return (
    <PaginaNoEncontrada
      titulo="404: The page you are looking for isn't here"
      descripcion="You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation"
      textoBoton="Go back to home"
    />
  );
}
