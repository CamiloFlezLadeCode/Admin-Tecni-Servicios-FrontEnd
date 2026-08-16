/**
 * Claves de persistencia del modo de color.
 *
 * Viven en su propio módulo (sin `'use client'`) porque las consumen tanto el
 * proveedor de cliente como el script de arranque. Deben coincidir EXACTAMENTE
 * en ambos sitios: si divergen, el script escribiría un tema y el proveedor
 * leería otro, y la página parpadearía al hidratar.
 */
export const COLOR_MODE_STORAGE_KEY = 'tecniservicios-color-mode';
export const COLOR_SCHEME_STORAGE_KEY = `${COLOR_MODE_STORAGE_KEY}-scheme`;

/** Sin elección previa se respeta la preferencia del sistema operativo. */
export const DEFAULT_COLOR_MODE = 'system' as const;
