'use client';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';

interface MensajeAlertaProps {
    open: boolean;
    tipo: AlertColor; // 'success' | 'error' | 'info' | 'warning'
    mensaje: string;
    onClose: () => void;
    duracion?: number; // Opcional, duración en ms
}

const MensajeAlerta: React.FC<MensajeAlertaProps> = ({
    open,
    tipo,
    mensaje,
    onClose,
    duracion = 3000,
}) => {
    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={duracion}
            onClose={onClose}
        >
            <Alert
                severity={tipo}
                sx={{ width: '100%' }}
                onClose={onClose}
            >
                {/* Sin color propio: hereda el tono semántico de la alerta */}
                <strong>{mensaje}</strong>
            </Alert>
        </Snackbar>
    );
};

export default MensajeAlerta;
