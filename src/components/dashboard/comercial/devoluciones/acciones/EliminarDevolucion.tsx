'use client';
import { useState } from 'react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { ModalEliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/eliminar_registro/EliminarRegistro';
import { IconButton } from '@mui/material';
import { EliminarDevolucion } from '@/services/comercial/devoluciones/EliminarDevolucionService';

interface BotonEliminarDevolucionProps {
    IdDevolucion: number;
    NoDevolucion: string;
    sendMessage: (event: string, payload: any) => void;
    mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function BotonEliminarDevolucion({ IdDevolucion, NoDevolucion, sendMessage, mostrarMensaje }: BotonEliminarDevolucionProps): JSX.Element {
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleEliminar = async () => {
        try {
            const respuesta = await EliminarDevolucion(IdDevolucion);

            // Emitir evento de WebSocket
            sendMessage('remision-eliminada', {
                id: IdDevolucion,
                numero: NoDevolucion,
                timestamp: new Date().toISOString()
            });

            if (respuesta.message.includes('eliminada')) {
                mostrarMensaje('Devolución eliminada correctamente', 'success');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            mostrarMensaje(`Error al eliminar devolución: ${errorMessage}`, 'error');
        } finally {
            setModalAbierto(false);
        }
    };

    return (
        <>
            <IconButton
                size="small"
                color="error"
                onClick={() => setModalAbierto(true)}
                aria-label={`Eliminar remisión ${NoDevolucion}`}
            >
                <Trash size={20} weight="bold" />
            </IconButton>

            <ModalEliminarRegistro
                abrir={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo={`¿Realmente quieres eliminar la devolución ${NoDevolucion}?`}
                onConfirmar={handleEliminar}
                colorBotonConfirmar="error"
                icono={<Trash size={24} />}
            />
        </>
    )
}