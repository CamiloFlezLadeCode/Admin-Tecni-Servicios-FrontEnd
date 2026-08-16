import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { InitColorScheme } from '@/components/core/theme-provider/init-color-scheme';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    // `suppressHydrationWarning` es obligatorio: <InitColorScheme /> escribe el
    // atributo de tema en <html> antes de que React hidrate, así que el markup
    // del cliente difiere del servidor a propósito.
    <html lang="es" suppressHydrationWarning>
      <body>
        {/* Debe ir como primer hijo de <body> para aplicar el tema sin parpadeo. */}
        <InitColorScheme />
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
