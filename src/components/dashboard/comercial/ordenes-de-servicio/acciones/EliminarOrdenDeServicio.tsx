'use client';
import { useState } from 'react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { ModalEliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/eliminar_registro/EliminarRegistro';
import { IconButton } from '@mui/material';
import { EliminarOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/EliminarOrdenDeServicioService';

interface BotonEliminarOrdenDeServicioProps {
    IdOrdenDeServicio: number;
    NoOrdenDeServicio: string;
    sendMessage: (event: string, payload: any) => void;
    mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function BotonEliminarOrdenDeServicio({ IdOrdenDeServicio, NoOrdenDeServicio, sendMessage, mostrarMensaje }: Readonly<BotonEliminarOrdenDeServicioProps>): JSX.Element {
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleEliminar = async () => {
        try {
            const respuesta = await EliminarOrdenDeServicio(IdOrdenDeServicio);

            // Emitir evento de WebSocket
            sendMessage('orden-de-servicio-eliminada', {
                id: IdOrdenDeServicio,
                numero: NoOrdenDeServicio,
                timestamp: new Date().toISOString()
            });

            if (respuesta.message.includes('eliminada')) {
                mostrarMensaje('Orden de servicio eliminada correctamente', 'success');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            mostrarMensaje(`Error al eliminar orden de servicio: ${errorMessage}`, 'error');
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
                aria-label={`Eliminar remisión ${NoOrdenDeServicio}`}
            >
                <Trash size={20} weight="bold" />
            </IconButton>

            <ModalEliminarRegistro
                abrir={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo={`¿Realmente quieres eliminar la orden de servicio ${NoOrdenDeServicio}?`}
                onConfirmar={handleEliminar}
                colorBotonConfirmar="error"
                icono={<Trash size={24} />}
            />
        </>
    )
};