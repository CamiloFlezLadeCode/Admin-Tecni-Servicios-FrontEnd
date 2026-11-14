'use client';
import type { ActionDefinition } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { getEstadoColor } from '@/utils/getEstadoColor';
import { Chip, IconButton, Stack, Typography } from '@mui/material';
import { Eye } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

/** Observaciones recortadas a una línea; el texto completo queda en el title. */
export function CeldaObservaciones({ texto }: { readonly texto?: string | null }): React.JSX.Element {
    return (
        <Typography
            variant="body2"
            sx={{
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
            title={texto ?? undefined}
        >
            {texto || 'Sin observaciones'}
        </Typography>
    );
}

/** Acción con el ojo que abre el detalle de un movimiento. */
export function accionVerDetalles<T>(abrir: (fila: T) => void): ActionDefinition<T> {
    return {
        render: (fila: T) => (
            <IconButton size="small" onClick={() => abrir(fila)} color="secondary">
                <Eye size={20} weight="bold" />
            </IconButton>
        ),
        tooltip: 'Ver detalles'
    };
}

/** Cantidad disponible con su semáforo: Agotado (≤0), Bajo (≤5) u OK. */
export function CeldaCantidadStock({ cantidad }: { readonly cantidad?: number | null }): React.JSX.Element {
    const qty = cantidad ?? 0;
    let color: 'error' | 'warning' | 'success' = 'success';
    let label = 'OK';
    if (qty <= 0) {
        color = 'error';
        label = 'Agotado';
    } else if (qty <= 5) {
        color = 'warning';
        label = 'Bajo';
    }
    return (
        <Stack alignItems="center" spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{qty}</Typography>
            <Chip size="small" color={color} label={label} />
        </Stack>
    );
}

/** Estado del ítem en stock con el color de `getEstadoColor`. */
export function ChipEstadoStock({ estado }: { readonly estado: string }): React.JSX.Element {
    return <Chip size="small" color={getEstadoColor(estado)} label={estado} />;
}
