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
    onMostrarCarga: (mostrar: boolean, mensaje?: string) => void;
    onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}
export function GenerarPDFDevolucion({ IdDevolucion, onMostrarCarga, onMostrarMensaje }: Devolucion): React.JSX.Element {

    const HandleManejarImpresion = async () => {
        onMostrarCarga(true, 'Generando pdf de devolución. Por favor espere');
        try {
            const blob = await ObtenerPDFDevolucion(IdDevolucion);
            if (blob) {
                setTimeout(() => {
                    onMostrarCarga(false);
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
                }, 1000);
            }
        } catch (error) {
            onMostrarCarga(false);
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            onMostrarMensaje(`Error al generar el pdf de la devolución. ${mensaje}`, 'error');
            console.error("Error:", error);
        }
    }
    return (
        <IconButton size="small" color="default" onClick={HandleManejarImpresion}>
            <Printer size={20} weight="bold" />
        </IconButton>
    )
};