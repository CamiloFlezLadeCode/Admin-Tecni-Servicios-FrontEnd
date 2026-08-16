import type { Shadows } from '@mui/material/styles/shadows';

/**
 * ESCALA DE SOMBRAS.
 *
 * En MUI v5 `shadows` vive a nivel de tema, no dentro de cada esquema de
 * color: la misma escala se usa en claro y en oscuro. Eso es un problema,
 * porque una sombra negra al 8% —perfecta sobre un fondo claro— es
 * literalmente invisible sobre una superficie oscura.
 *
 * La salida es delegar el COLOR de la sombra a una variable CSS que sí cambia
 * por esquema (definida en `styles/global.css`), y dejar aquí sólo la
 * geometría (desplazamiento y desenfoque). Así una única escala se comporta
 * correctamente en ambos modos:
 *   claro  → azul-gris muy tenue, para que la sombra no se vea sucia
 *   oscuro → negro mucho más opaco, que es lo único que se percibe
 */
const sombra = (offsetY: number, blur: number): string =>
  `0px ${offsetY}px ${blur}px rgba(var(--app-shadow-rgb) / var(--app-shadow-opacity))`;

export const shadows = [
  'none',
  sombra(1, 2),
  sombra(1, 5),
  sombra(1, 8),
  sombra(1, 10),
  sombra(1, 14),
  sombra(1, 18),
  sombra(2, 16),
  sombra(3, 14),
  sombra(3, 16),
  sombra(4, 18),
  sombra(4, 20),
  sombra(5, 22),
  sombra(5, 24),
  sombra(5, 26),
  sombra(6, 28),
  sombra(6, 30),
  sombra(6, 32),
  sombra(7, 34),
  sombra(7, 36),
  sombra(8, 38),
  sombra(8, 40),
  sombra(8, 42),
  sombra(9, 44),
  sombra(9, 46),
] satisfies Shadows;
