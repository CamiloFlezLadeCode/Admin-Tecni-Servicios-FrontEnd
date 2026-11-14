import type { AlertColor } from '@mui/material';
import * as React from 'react';

export interface PropsAlerta {
    open: boolean;
    tipo: AlertColor;
    mensaje: string;
    onClose: () => void;
}

/** Estado de la alerta flotante (`MensajeAlerta`) de un formulario o tabla. */
export function useMensajeAlerta() {
    const [abierta, setAbierta] = React.useState(false);
    const [mensaje, setMensaje] = React.useState('');
    const [tipo, setTipo] = React.useState<AlertColor>('success');

    const mostrarMensaje = React.useCallback((texto: string, nuevoTipo: AlertColor) => {
        setMensaje(texto);
        setTipo(nuevoTipo);
        setAbierta(true);
    }, []);

    const propsAlerta: PropsAlerta = { open: abierta, tipo, mensaje, onClose: () => setAbierta(false) };
    return { mostrarMensaje, propsAlerta };
}
