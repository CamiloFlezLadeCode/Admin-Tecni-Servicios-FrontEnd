'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';
import { Moon as MoonIcon } from '@phosphor-icons/react/dist/ssr/Moon';
import { Sun as SunIcon } from '@phosphor-icons/react/dist/ssr/Sun';

/**
 * Botón para alternar entre modo claro y oscuro.
 *
 * `useColorScheme` sólo conoce el modo real después de hidratar (antes de eso
 * el servidor no sabe qué eligió la persona ni qué prefiere su sistema). Si
 * pintáramos el icono definitivo en el primer render, React marcaría un
 * desajuste de hidratación y podría verse el icono equivocado por un instante.
 * Por eso `mounted` mantiene un placeholder del mismo tamaño hasta que el
 * modo es confiable: el layout no salta y no hay parpadeo.
 */
export function ColorSchemeToggle(): React.JSX.Element {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Con mode === 'system' el modo efectivo lo dicta el sistema operativo.
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const isDark = resolvedMode === 'dark';

  const handleToggle = React.useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  const sharedSx = {
    width: 40,
    height: 40,
    borderRadius: '12px',
    border: '1px solid var(--mui-palette-divider)',
    backgroundColor: 'var(--mui-palette-background-level1)',
  } as const;

  if (!mounted) {
    return <IconButton disabled aria-hidden sx={sharedSx} />;
  }

  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={handleToggle}
        aria-label={label}
        sx={{
          ...sharedSx,
          color: isDark ? 'var(--mui-palette-warning-main)' : 'var(--mui-palette-primary-main)',
          transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
          '&:hover': {
            backgroundColor: 'var(--mui-palette-background-level2)',
            borderColor: 'var(--mui-palette-neutral-400)',
          },
          // El icono gira levemente al entrar: da la sensación de conmutador
          // físico sin recurrir a una animación cara.
          '& svg': { transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)' },
          '&:hover svg': { transform: 'rotate(-18deg) scale(1.06)' },
        }}
      >
        {isDark ? <SunIcon size={20} weight="fill" /> : <MoonIcon size={20} weight="fill" />}
      </IconButton>
    </Tooltip>
  );
}
