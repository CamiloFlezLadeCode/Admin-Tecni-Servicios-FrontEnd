/**
 * Deja en un select solo las opciones activas para operaciones nuevas, conservando el valor
 * ya seleccionado para que los registros existentes sigan mostrándolo aunque hoy esté inactivo.
 * Las opciones sin el campo `Activo` (p. ej. "Sin seleccionar") siempre se mantienen.
 */
export const FiltrarOpcionesActivas = <T extends { value: string | number; Activo?: boolean }>(
    opciones: T[],
    valorSeleccionado?: string | number
): T[] => opciones.filter((opcion) => opcion.Activo !== false || String(opcion.value) === String(valorSeleccionado));
