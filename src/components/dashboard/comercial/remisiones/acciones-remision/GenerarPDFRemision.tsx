'use client';

import * as React from 'react';
import {
    FilePdf,
    Printer
} from '@phosphor-icons/react/dist/ssr';
import {
    IconButton
} from '@mui/material';
import { VisualizarPDFRemision } from '@/services/comercial/remisiones/ObtenerPDFRemisionService';


interface Props {
    IdRemision: number;
    onMostrarCarga: (mostrar: boolean, mensaje?: string) => void;
    onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}


export function GenerarPDFRemision({ IdRemision, onMostrarCarga, onMostrarMensaje }: Props): React.JSX.Element {
    // Con vista directa de impresión en la misma pestaña
    const manejarImpresion = async () => {
        onMostrarCarga(true, `Generando pdf de remisión. Por favor espere`);
        try {
            const blob = await VisualizarPDFRemision(IdRemision);
            if (blob) {
                setTimeout(() => {
                    onMostrarCarga(false);
                    const blobURL = URL.createObjectURL(blob);
                    const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (esMovil) {
                        const link = document.createElement('a');
                        link.href = blobURL;
                        link.download = `remision-No${IdRemision}.pdf`;
                        link.click();
                    } else {
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = blobURL;
                        document.body.appendChild(iframe);

                        iframe.onload = () => {
                            iframe.contentWindow?.focus();
                            iframe.contentWindow?.print();
                        };
                    }

                    // onMostrarMensaje('PDF generado correctamente', 'success');
                }, 1000);
            }
        } catch (error) {
            onMostrarCarga(false);
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            onMostrarMensaje(`Error al generar el pdf de la remisión. ${mensaje}`, 'error');
            console.error("Error:", error);
        }
    };

    // Con PDF en nueva pestaña
    const manejarImpresionC = async () => {
        try {
            const blob = await VisualizarPDFRemision(IdRemision);
            const blobURL = URL.createObjectURL(blob);

            // Abrir el PDF en una nueva pestaña
            window.open(blobURL, '_blank');

        } catch (error) {
            console.error("Error al mostrar PDF:", error);
        }
    };

    return (
        <IconButton size="small" color="default" onClick={manejarImpresion}>
            <Printer size={20} weight="bold" />
        </IconButton>
    );
}
