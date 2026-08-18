'use client';

import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';

/**
 * AVATAR POR DEFECTO SEGÚN EL MODO DE COLOR
 *
 * El avatar de reserva es un dibujo de línea sobre fondo transparente, así que
 * su color no lo aporta ninguna superficie: lo aporta el propio PNG. El
 * original es negro puro, perfecto sobre la tarjeta blanca del modo claro pero
 * prácticamente invisible sobre la pizarra oscura (#0f172a) del modo oscuro.
 *
 * Por eso hay dos archivos con el MISMO trazo y distinto color:
 *   AvatarDefault.png      → negro,  para modo claro
 *   AvatarDefaultDark.png  → slate[200] (#e2e8f0), para modo oscuro
 *
 * No se resuelve con CSS porque el color vive dentro de los píxeles de la
 * imagen, no en una propiedad; hay que cambiar el `src`.
 *
 * Ojo con la hidratación: `useColorScheme()` no conoce el modo real hasta
 * después de montar (el servidor no sabe qué eligió la persona ni qué prefiere
 * su sistema). Se devuelve la variante clara hasta entonces, que es el valor
 * que también renderiza el servidor, de modo que no hay desajuste.
 */

export const AVATAR_POR_DEFECTO_CLARO = '/assets/AvatarDefault.png';
export const AVATAR_POR_DEFECTO_OSCURO = '/assets/AvatarDefaultDark.png';

export function useAvatarPorDefecto(): string {
  const { mode, systemMode } = useColorScheme();
  const [montado, setMontado] = React.useState(false);

  React.useEffect(() => {
    setMontado(true);
  }, []);

  // Con mode === 'system' el modo efectivo lo dicta el sistema operativo.
  const modoResuelto = mode === 'system' ? systemMode : mode;

  return montado && modoResuelto === 'dark' ? AVATAR_POR_DEFECTO_OSCURO : AVATAR_POR_DEFECTO_CLARO;
}
