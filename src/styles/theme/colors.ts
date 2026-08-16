import type { PaletteRange } from '@mui/material/styles/createPalette';

/**
 * ESCALAS DE COLOR — TecniServicios
 *
 * Cada escala va de 50 (más claro) a 950 (más oscuro) y está construida con
 * pasos de luminancia perceptualmente uniformes, de modo que un mismo "peso"
 * (p. ej. 500) tenga un contraste comparable entre familias distintas.
 *
 * Regla de uso por modo:
 *   - Modo claro  → el tono principal es el 500/600 sobre fondos claros.
 *   - Modo oscuro → el tono principal es el 300/400, porque un color saturado
 *     oscuro sobre fondo oscuro no alcanza el 4.5:1 exigido por WCAG AA.
 *
 * No agregues colores sueltos en los componentes: si necesitas un tono nuevo,
 * añádelo aquí y expónlo como token en `color-schemes.ts`.
 */

/** Ámbar — advertencias. Cálido, alto brillo, legible en ambos modos. */
export const california = {
  50: '#fffaea',
  100: '#fff3c6',
  200: '#ffe587',
  300: '#ffd049',
  400: '#ffbb1f',
  500: '#f79009',
  600: '#dc6803',
  700: '#b54708',
  800: '#93370d',
  900: '#7a2e0e',
  950: '#471701',
} satisfies PaletteRange;

/** Verde azulado — éxito. Evita el verde puro para no chocar con el índigo. */
export const kepple = {
  50: '#f0fdfa',
  100: '#ccfbef',
  200: '#9af5e1',
  300: '#5fe9ce',
  400: '#2ed3b8',
  500: '#15b79f',
  600: '#0e9382',
  700: '#107569',
  800: '#115e56',
  900: '#134e48',
  950: '#042f2c',
} satisfies PaletteRange;

/** Índigo — color de marca / primario. Base de toda la identidad visual. */
export const neonBlue = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#8b8cff',
  500: '#635bff',
  600: '#4e36f5',
  700: '#432ad8',
  800: '#3725ae',
  900: '#302689',
  950: '#1e1650',
} satisfies PaletteRange;

/** Gris cálido neutro — usado como secundario en modo claro. */
export const nevada = {
  50: '#fbfcfe',
  100: '#f0f4f8',
  200: '#dde7ee',
  300: '#cdd7e1',
  400: '#9fa6ad',
  500: '#636b74',
  600: '#555e68',
  700: '#32383e',
  800: '#202427',
  900: '#121517',
  950: '#090a0b',
} satisfies PaletteRange;

/** Rojo anaranjado — errores y acciones destructivas. */
export const redOrange = {
  50: '#fef3f2',
  100: '#fee4e2',
  200: '#ffcdc9',
  300: '#fdaaa4',
  400: '#f97970',
  500: '#f04438',
  600: '#de3024',
  700: '#bb241a',
  800: '#9a221a',
  900: '#80231c',
  950: '#460d09',
} satisfies PaletteRange;

/** Cian — información. Suficientemente distinto del índigo primario. */
export const shakespeare = {
  50: '#ecfdff',
  100: '#cff7fe',
  200: '#a4eefd',
  300: '#66e0fa',
  400: '#22ccee',
  500: '#06aed4',
  600: '#088ab2',
  700: '#0e7090',
  800: '#155b75',
  900: '#164c63',
  950: '#082f44',
} satisfies PaletteRange;

/** Gris azulado — neutro del modo CLARO. Frío, combina con el índigo. */
export const stormGrey = {
  50: '#f9fafb',
  100: '#f1f1f4',
  200: '#dcdfe4',
  300: '#b3b9c6',
  400: '#8a94a6',
  500: '#667085',
  600: '#565e73',
  700: '#434a60',
  800: '#313749',
  900: '#212636',
  950: '#121621',
} satisfies PaletteRange;

/**
 * Pizarra fría — neutro del modo OSCURO.
 *
 * Se usa en lugar de negro puro: un fondo #000 con tarjetas #111 produce
 * "smearing" en pantallas OLED y elimina la percepción de elevación. Esta
 * escala mantiene un leve tinte azul (mismo matiz que el índigo primario),
 * lo que hace que las superficies oscuras se lean como parte del sistema y
 * no como un gris sucio.
 *
 * Superficies: 950 = fondo de página, 900 = tarjeta, 800/700 = elevaciones.
 */
export const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} satisfies PaletteRange;
