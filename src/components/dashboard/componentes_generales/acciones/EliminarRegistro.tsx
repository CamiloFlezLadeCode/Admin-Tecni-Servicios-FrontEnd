'use client';
import React, { useState } from 'react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { ModalEliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/eliminar_registro/EliminarRegistro';
import { IconButton } from '@mui/material';

interface Eliminar {
    servicioEliminarRegistro: (id: number | string) => Promise<string>;
    idRecurso: number | string;
    sendMessage: (event: string, payload: any) => void;
    mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
    mensajes: {
        ariaLabel: string;
        socket: string;
        info: string;
        exito?: string;
        error: string;
    }
}

export function EliminarRegistro({ servicioEliminarRegistro, sendMessage, mostrarMensaje, mensajes, idRecurso }: Eliminar): React.JSX.Element {
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleEliminar = async () => {
        try {
            const Respuesta = await servicioEliminarRegistro(idRecurso);
            if (!Respuesta) {
                throw new Error('No se pudo eliminar el registro');
            }
            sendMessage(mensajes.socket, {});
            mostrarMensaje(`${mensajes.exito}`, 'success');
        } catch (error) {
            const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
            mostrarMensaje(`${mensajes.error} ${mensajeError}`, 'error');
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
                aria-label={mensajes.ariaLabel}
            >
                <Trash size={20} weight="bold" />
            </IconButton>

            <ModalEliminarRegistro
                abrir={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo={`${mensajes.info}`}
                onConfirmar={handleEliminar}
                colorBotonConfirmar="error"
                icono={<Trash size={24} />}
            />
        </>
    )
}