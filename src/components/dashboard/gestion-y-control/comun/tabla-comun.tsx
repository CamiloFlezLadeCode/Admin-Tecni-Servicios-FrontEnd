'use client';
import { Chip, type ChipProps } from '@mui/material';
import * as React from 'react';

type ColorChip = NonNullable<ChipProps['color']>;

/** Busca solo claves propias (evita que "constructor" & cía. lleguen del prototipo). */
function buscar<T>(mapa: Readonly<Record<string, T>>, clave: string): T | undefined {
    return Object.prototype.hasOwnProperty.call(mapa, clave) ? mapa[clave] : undefined;
}

/**
 * Recarga la tabla (conservando página y búsqueda) cuando el último evento
 * recibido por socket es uno de `eventos`.
 */
export function useRecargaPorEventos(
    messages: ReadonlyArray<{ tipo: string }>,
    eventos: readonly string[],
    recargar: () => void
): void {
    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];
            if (eventos.includes(ultimoMensaje.tipo)) {
                recargar();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- solo reacciona a mensajes nuevos
    }, [messages]);
}

export const COLORES_ACTIVO_INACTIVO: Readonly<Record<string, ColorChip>> = {
    Activo: 'success',
    Inactivo: 'error',
};

/** Muestra el estado tal como llega, con color según `colores` (gris si no está). */
export function ChipEstadoTexto({ estado, colores = COLORES_ACTIVO_INACTIVO }: {
    readonly estado: string;
    readonly colores?: Readonly<Record<string, ColorChip>>;
}): React.JSX.Element {
    return <Chip label={estado} color={buscar(colores, estado) ?? 'default'} size="small" sx={{ minWidth: 100 }} />;
}

/** "activo"/"inactivo" sin importar mayúsculas; cualquier otro valor se muestra como Inactivo. */
export function ChipActivoInactivo({ estado }: { readonly estado: string }): React.JSX.Element {
    const activo = estado.toLowerCase() === 'activo';
    return (
        <Chip
            label={activo ? 'Activo' : 'Inactivo'}
            color={activo ? 'success' : 'error'}
            size="small"
            sx={{ width: 90, justifyContent: 'center' }}
        />
    );
}

const DISPONIBILIDAD: Readonly<Record<string, { label: string; color: ColorChip }>> = {
    'disponible': { label: 'Disponible', color: 'success' },
    'no disponible': { label: 'No disponible', color: 'error' },
    'reparación': { label: 'En reparación', color: 'warning' },
};

/** Estado de equipos y repuestos: Disponible / No disponible / En reparación. */
export function ChipDisponibilidad({ estado }: { readonly estado: string | null | undefined }): React.JSX.Element {
    const conocido = typeof estado === 'string' ? buscar(DISPONIBILIDAD, estado.trim().toLowerCase()) : undefined;
    return (
        <Chip
            label={conocido ? conocido.label : estado}
            color={conocido ? conocido.color : 'default'}
            size="small"
            sx={{ width: 120, justifyContent: 'center' }}
        />
    );
}
