'use client';

import * as React from 'react';
import {
    Printer
} from '@phosphor-icons/react';
import { IconButton } from '@mui/material';
import { ObtenerPDFDevolucion } from '@/services/comercial/devoluciones/ObtenerPDFDevolucionService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface Devolucion {
    IdDevolucion: number;
}
export function GenerarPDFDevolucion({ IdDevolucion }: Devolucion): React.JSX.Element {
    //Estados para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error' | 'warning' | 'info'>('success');
    //...

    //Función para abrir la alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //....

    const HandleManejarImpresion = async () => {
        try {
            const blob = await ObtenerPDFDevolucion(IdDevolucion);
            const blobURL = URL.createObjectURL(blob);

            const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (esMovil) {
                const link = document.createElement('a');
                link.href = blobURL;
                link.download = `Devolucion-No${IdDevolucion}.pdf`;
                link.click();
                return;
            }

            // Desktop: imprimir
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobURL;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();

                // setTimeout(() => {
                //   URL.revokeObjectURL(blobURL);
                //   document.body.removeChild(iframe);
                // }, 1000);
            };
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            mostrarMensaje(`No se pudo generar el pdf - ${mensaje}`, 'error');
        }
    }
    return (
        <>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />

            <IconButton size="small" color="default" onClick={HandleManejarImpresion}>
                <Printer size={20} weight="bold" />
            </IconButton>
        </>
    )
};