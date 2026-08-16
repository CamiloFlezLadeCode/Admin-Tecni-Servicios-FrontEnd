'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';

import { COLOR_MODE_STORAGE_KEY, COLOR_SCHEME_STORAGE_KEY, DEFAULT_COLOR_MODE } from './color-mode-config';
import EmotionCache from './emotion-cache';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  // El tema se memoiza: `extendTheme` recorre toda la paleta y generar uno
  // nuevo en cada render tira abajo la caché de estilos de Emotion.
  const theme = React.useMemo(() => createTheme(), []);

  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider
        theme={theme}
        // 'system' respeta la preferencia del sistema operativo hasta que la
        // persona elige explícitamente claro u oscuro. Las claves salen del
        // módulo compartido para no desincronizarse del script de arranque.
        defaultMode={DEFAULT_COLOR_MODE}
        modeStorageKey={COLOR_MODE_STORAGE_KEY}
        colorSchemeStorageKey={COLOR_SCHEME_STORAGE_KEY}
        // Evita que cada color con `transition` se anime al cambiar de modo:
        // sin esto el cambio se ve como un barrido sucio de cientos de nodos.
        disableTransitionOnChange
      >
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </EmotionCache>
  );
}
