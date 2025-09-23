'use client';

import * as React from 'react';
import { FilePdf, Printer } from '@phosphor-icons/react/dist/ssr';
import { IconButton } from '@mui/material';

interface GenerarPDFProps<T = any> {
    // Función que retorna el blob del PDF (puede ser cualquier servicio)
    servicioPDF: (id: number | string) => Promise<Blob>;
    // Identificador del recurso (puede ser número o string)
    idRecurso: number | string;
    // Nombre del archivo para descarga
    nombreArchivo: string;
    // Mensajes personalizables
    mensajes: {
        generando: string;
        exito?: string;
        error: string;
    };
    // Callbacks
    onMostrarCarga?: (mostrar: boolean, mensaje?: string) => void;
    onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
    // Comportamiento
    comportamiento?: 'impresion' | 'descarga' | 'nuevaPestana' | 'automatico';
    // Icono personalizable (opcional)
    icono?: React.ReactNode;
    // Tamaño del icono
    tamañoIcono?: number;
    // Color del botón
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export function GenerarPDF<T>({
    servicioPDF,
    idRecurso,
    nombreArchivo,
    mensajes,
    onMostrarCarga,
    onMostrarMensaje,
    comportamiento = 'automatico',
    icono,
    tamañoIcono = 20,
    color = 'default'
}: GenerarPDFProps<T>): React.JSX.Element {

    const detectarDispositivo = (): 'escritorio' | 'movil' => {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'movil' : 'escritorio';
    };

    const manejarGeneracionPDF = async (tipo: 'impresion' | 'descarga' | 'nuevaPestana' | 'automatico' = comportamiento) => {
        // Mostrar carga si hay callback
        onMostrarCarga?.(true, mensajes.generando);

        try {
            const blob = await servicioPDF(idRecurso);

            if (!blob) {
                throw new Error('No se pudo generar el PDF');
            }

            setTimeout(() => {
                const blobURL = URL.createObjectURL(blob);
                const dispositivo = detectarDispositivo();

                // Si hay callback de carga, lo ocultamos después de un breve delay
                // setTimeout(() => {
                //     onMostrarCarga?.(false);
                // }, 1000);

                onMostrarCarga?.(false);
                // Ejecutar según el comportamiento seleccionado
                switch (tipo) {
                    case 'impresion':
                        if (dispositivo === 'movil') {
                            // En móvil, forzar descarga
                            forzarDescarga(blobURL, nombreArchivo);
                        } else {
                            imprimirPDF(blobURL);
                        }
                        break;

                    case 'descarga':
                        forzarDescarga(blobURL, nombreArchivo);
                        break;

                    case 'nuevaPestana':
                        abrirNuevaPestana(blobURL);
                        break;

                    case 'automatico':
                    default:
                        if (dispositivo === 'movil') {
                            forzarDescarga(blobURL, nombreArchivo);
                        } else {
                            imprimirPDF(blobURL);
                        }
                        break;
                }

                // Mostrar mensaje de éxito si está configurado
                if (mensajes.exito) {
                    // onMostrarMensaje?.(mensajes.exito, 'success');
                }
            }, 1000);

        } catch (error) {
            onMostrarCarga?.(false);
            const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
            onMostrarMensaje?.(`${mensajes.error} ${mensajeError}`, 'error');
            console.error("Error al generar PDF:", error);
        }
    };

    // Función para imprimir PDF
    const imprimirPDF = (blobURL: string) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobURL;
        document.body.appendChild(iframe);

        iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            // Limpiar después de imprimir
            // setTimeout(() => {
            //     document.body.removeChild(iframe);
            //     URL.revokeObjectURL(blobURL);
            // }, 1000);
        };
    };

    // Función para forzar descarga
    const forzarDescarga = (blobURL: string, filename: string) => {
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
    };

    // Función para abrir en nueva pestaña
    const abrirNuevaPestana = (blobURL: string) => {
        window.open(blobURL, '_blank');
        // No revocamos la URL inmediatamente para permitir que el usuario interactúe con la pestaña
    };

    // Icono por defecto si no se proporciona uno
    const iconoPorDefecto = icono || <Printer size={tamañoIcono} weight="bold" />;

    return (
        <IconButton
            size="small"
            color={color}
            onClick={() => manejarGeneracionPDF()}
            title={`Generar PDF: ${nombreArchivo}`}
        >
            {iconoPorDefecto}
        </IconButton>
    );
}