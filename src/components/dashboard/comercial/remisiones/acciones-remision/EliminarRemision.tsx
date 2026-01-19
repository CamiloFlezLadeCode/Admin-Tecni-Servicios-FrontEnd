'use client';

import { useState } from 'react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { ModalEliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/eliminar_registro/EliminarRegistro';
import { EliminarRemision } from '@/services/comercial/remisiones/EliminarRemisionService';
import { IconButton, Tooltip } from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr';

interface BotonEliminarRemisionProps {
    IdRemision: number;
    NoRemision: string;
    sendMessage: (event: string, payload: any) => void;
    mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function BotonEliminarRemision({
    IdRemision,
    NoRemision,
    sendMessage,
    mostrarMensaje
}: BotonEliminarRemisionProps): JSX.Element {
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleEliminar = async () => {
        try {
            const respuesta = await EliminarRemision(IdRemision);

            // Emitir evento de WebSocket
            sendMessage('remision-eliminada', {
                id: IdRemision,
                numero: NoRemision,
                timestamp: new Date().toISOString()
            });

            if (respuesta.message.includes('eliminada')) {
                mostrarMensaje('Remisión eliminada correctamente', 'success');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            mostrarMensaje(`Error al eliminar remisión: ${errorMessage}`, 'error');
        } finally {
            setModalAbierto(false);
        }
    };

    return (
        <>
            <Tooltip title="Eliminar remisión" disableInteractive={false}>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => setModalAbierto(true)}
                // aria-label={`Eliminar remisión ${NoRemision}`}
                >
                    {/* <Trash size={20} weight="bold" /> */}
                    <PencilSimple size={20} weight="bold" />
                </IconButton>
            </Tooltip>

            <ModalEliminarRegistro
                abrir={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo={`¿Realmente quieres eliminar la remisión ${NoRemision}?`}
                onConfirmar={handleEliminar}
                colorBotonConfirmar="error"
                icono={<Trash size={24} />}
            />
        </>
    );
}