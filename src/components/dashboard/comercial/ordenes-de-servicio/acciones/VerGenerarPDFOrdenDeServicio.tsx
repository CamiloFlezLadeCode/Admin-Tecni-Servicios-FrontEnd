'use client';
import * as React from 'react';
import {
    Printer
} from '@phosphor-icons/react';
import { IconButton } from '@mui/material';
import { ObtenerPDFOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ObtenerPDFOrdenDeServicioService';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface VerGenerarPDFOrdenDeServicioProps {
    IdOrdenDeServicio: number;
    onMostrarCarga: (mostrar: boolean, mensaje?: string) => void;
    onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function VerGenerarPDFOrdenDeServicio({ 
    IdOrdenDeServicio, 
    onMostrarCarga, 
    onMostrarMensaje 
}: VerGenerarPDFOrdenDeServicioProps): React.JSX.Element {

    const HandleManejarImpresion = async () => {
        // Usar las funciones callback en lugar de estados locales
        onMostrarCarga(true, 'Generando pdf de orden de servicio. Por favor espere');

        try {
            const blob = await ObtenerPDFOrdenDeServicio(IdOrdenDeServicio);

            if (blob) {
                setTimeout(() => {
                    onMostrarCarga(false); // Ocultar carga

                    const blobURL = URL.createObjectURL(blob);
                    const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                    if (esMovil) {
                        const link = document.createElement('a');
                        link.href = blobURL;
                        link.download = `remision-No${IdOrdenDeServicio}.pdf`;
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
                    
                    onMostrarMensaje('PDF generado correctamente', 'success');
                }, 1000);
            }
        } catch (error) {
            console.error(`Error al generar PDF: ${error}`);
            onMostrarCarga(false); // Ocultar carga en caso de error
            onMostrarMensaje(`Error al generar PDF: ${error}`, 'error');
        }
    }

    return (
        <IconButton size="small" color="default" onClick={HandleManejarImpresion}>
            <Printer size={20} weight="bold" />
        </IconButton>
    );
}