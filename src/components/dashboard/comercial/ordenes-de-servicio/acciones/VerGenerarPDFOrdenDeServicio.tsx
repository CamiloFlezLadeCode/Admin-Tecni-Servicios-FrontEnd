'use client';
import * as React from 'react';
import {
    Printer
} from '@phosphor-icons/react';
import { IconButton } from '@mui/material';
import { ObtenerPDFOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ObtenerPDFOrdenDeServicioService';

interface Orden {
    IdOrdenDeServicio: number;
}

export function VerGenerarPDFOrdenDeServicio({ IdOrdenDeServicio }: Orden): React.JSX.Element {

    const HandleManejarImpresion = async () => {
        try {
            const blob = await ObtenerPDFOrdenDeServicio(IdOrdenDeServicio);
            const blobURL = URL.createObjectURL(blob);

            const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (esMovil) {
                const link = document.createElement('a');
                link.href = blobURL;
                link.download = `remision-No${IdOrdenDeServicio}.pdf`;
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
        }
    }
    return (
        <IconButton size="small" color="default" onClick={HandleManejarImpresion}>
            <Printer size={20} weight="bold" />
        </IconButton>
    )
}