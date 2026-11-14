'use client';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { PencilSimple, X } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

/** Caja centrada de los modales de edición; cada formulario puede ajustar posición o ancho. */
const SX_BASE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '95%',
        sm: '90%',
        md: '80%',
        lg: '70%',
    },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
} as const;

interface ModalFormularioProps {
    readonly abierto: boolean;
    readonly onCerrar: () => void;
    readonly titulo: React.ReactNode;
    /** Ajustes sobre la caja base (posición, ancho, colores). */
    readonly sx?: Record<string, unknown>;
    readonly children: React.ReactNode;
}

/**
 * Modal con botón de cerrar y título. No se cierra con clic fuera ni con Escape,
 * para no perder lo que se está editando.
 */
export function ModalFormulario({ abierto, onCerrar, titulo, sx, children }: ModalFormularioProps): React.JSX.Element {
    return (
        <Modal
            open={abierto}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    onCerrar();
                }
            }}
        >
            <Box sx={{ ...SX_BASE, ...sx } as SxProps<Theme>}>
                <IconButton
                    onClick={onCerrar}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                    }}
                >
                    <X />
                </IconButton>
                <Typography variant="subtitle1" mb={1}>
                    {titulo}
                </Typography>
                {children}
            </Box>
        </Modal>
    );
}

/** Lápiz que abre el modal de edición de una fila. */
export function BotonEditar({ onClick }: { readonly onClick: () => void }): React.JSX.Element {
    return (
        <IconButton size="small" color="primary" onClick={onClick} title='Editar'>
            <PencilSimple size={20} weight="bold" />
        </IconButton>
    );
}
