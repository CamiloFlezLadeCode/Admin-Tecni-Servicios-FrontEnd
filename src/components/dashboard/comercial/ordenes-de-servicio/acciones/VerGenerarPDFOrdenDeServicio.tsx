'use client';
import * as React from 'react';
import {
    Printer
} from '@phosphor-icons/react';
import { IconButton } from '@mui/material';
import { ObtenerPDFOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ObtenerPDFOrdenDeServicioService';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface Orden {
    IdOrdenDeServicio: number;
}

export function VerGenerarPDFOrdenDeServicio({ IdOrdenDeServicio }: Orden): React.JSX.Element {

    // Estados para mostrar mensaje de carga
    const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);
    const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');
    // ...
    //Para el manejo de la alerta
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // Función para abrir alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    // const HandleManejarImpresion = async () => {
    //     setMostrarMensajeDeCarga(true);
    //     setMensajeDeCarga('Generando pdf de orden de servicio. Por favor espere');
    //     try {
    //         const blob = await ObtenerPDFOrdenDeServicio(IdOrdenDeServicio);
    //         if (blob) {
    //             setTimeout(() => {
    //                 setMostrarMensajeDeCarga(false);
    //                 setMensajeDeCarga('');
    //                 mostrarMensaje('BackUp guardado correctamente', 'success');
    //             }, 3000);
    //         }
    //         const blobURL = URL.createObjectURL(blob);

    //         const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    //         if (esMovil) {
    //             const link = document.createElement('a');
    //             link.href = blobURL;
    //             link.download = `remision-No${IdOrdenDeServicio}.pdf`;
    //             link.click();
    //             return;
    //         }

    //         // Desktop: imprimir
    //         const iframe = document.createElement('iframe');
    //         iframe.style.display = 'none';
    //         iframe.src = blobURL;
    //         document.body.appendChild(iframe);

    //         iframe.onload = () => {
    //             iframe.contentWindow?.focus();
    //             iframe.contentWindow?.print();

    //             // setTimeout(() => {
    //             //   URL.revokeObjectURL(blobURL);
    //             //   document.body.removeChild(iframe);
    //             // }, 1000);
    //         };
    //     } catch (error) {
    //         console.error(`Error al describir la acción: ${error}`);
    //     }
    // }

    const HandleManejarImpresion = async () => {
        setMostrarMensajeDeCarga(true);
        setMensajeDeCarga('Generando pdf de orden de servicio. Por favor espere');

        try {
            const blob = await ObtenerPDFOrdenDeServicio(IdOrdenDeServicio);

            if (blob) {
                setTimeout(() => {
                    // Esto se ejecuta después de 3 segundos
                    setMostrarMensajeDeCarga(false);
                    setMensajeDeCarga('');

                    const blobURL = URL.createObjectURL(blob);
                    const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                    if (esMovil) {
                        // Lógica para móvil
                        const link = document.createElement('a');
                        link.href = blobURL;
                        link.download = `remision-No${IdOrdenDeServicio}.pdf`;
                        link.click();
                    } else {
                        // Lógica para desktop
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = blobURL;
                        document.body.appendChild(iframe);

                        iframe.onload = () => {
                            iframe.contentWindow?.focus();
                            iframe.contentWindow?.print();

                            // Limpieza opcional después de imprimir
                            // setTimeout(() => {
                            //   URL.revokeObjectURL(blobURL);
                            //   document.body.removeChild(iframe);
                            // }, 1000);
                        };
                    }
                }, 2000);
            }
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
            setMostrarMensajeDeCarga(false);
            setMensajeDeCarga('');
            mostrarMensaje(`Error al generar pdf de orden de servicio -> ${error}`, 'error');
        }
    }
    return (
        <>
            <MensajeDeCarga
                Mensaje={mensajeDeCarga}
                MostrarMensaje={mostrarMensajeDeCarga}
            />
            <IconButton size="small" color="default" onClick={HandleManejarImpresion}>
                <Printer size={20} weight="bold" />
            </IconButton>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </>
    )
}