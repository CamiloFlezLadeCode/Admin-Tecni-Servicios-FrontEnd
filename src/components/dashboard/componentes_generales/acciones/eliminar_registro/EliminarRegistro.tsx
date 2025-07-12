'use client';

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Modal,
    useTheme
} from '@mui/material';
import { X } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

interface ModalConfirmacionProps {
    // Configuración del modal
    abrir: boolean;
    onCerrar: () => void;

    // Contenido personalizable
    titulo: string;
    textoBotonConfirmar?: string;
    textoBotonCancelar?: string;
    colorBotonConfirmar?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning';

    // Acciones
    onConfirmar: () => Promise<void> | void;

    // Opciones adicionales
    deshabilitarCierreExterno?: boolean;
    tamaño?: 'pequeno' | 'mediano' | 'grande';
    icono?: React.ReactNode;
}

export function ModalEliminarRegistro({
    abrir,
    onCerrar,
    titulo,
    textoBotonConfirmar = 'Sí',
    textoBotonCancelar = 'No',
    colorBotonConfirmar = 'error',
    onConfirmar,
    deshabilitarCierreExterno = true,
    tamaño = 'mediano',
    icono
}: ModalConfirmacionProps): React.JSX.Element {
    const theme = useTheme();
    const [cargando, setCargando] = React.useState(false);

    const handleConfirmar = async () => {
        setCargando(true);
        try {
            await onConfirmar();
            onCerrar();
        } finally {
            setCargando(false);
        }
    };

    const getTamañoModal = () => {
        switch (tamaño) {
            case 'pequeno': return { xs: '90%', md: '30%' };
            case 'grande': return { xs: '90%', md: '60%' };
            default: return { xs: '90%', md: '40%' };
        }
    };

    return (
        <Modal
            open={abrir}
            onClose={(_, reason) => {
                if (deshabilitarCierreExterno && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
                    return;
                }
                onCerrar();
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: getTamañoModal(),
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <IconButton
                    onClick={onCerrar}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                    }}
                    disabled={cargando}
                >
                    <X />
                </IconButton>
                <Card sx={{ mt: 4 }}>
                    <CardHeader
                        title={titulo}
                        avatar={icono}
                        sx={{ textAlign: 'center' }}
                    />
                    <CardContent
                        sx={{
                            p: 0,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{ fontWeight: 'bold', width: { xs: '80%', sm: 'auto' } }}
                            onClick={onCerrar}
                            disabled={cargando}
                        >
                            {textoBotonCancelar}
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ fontWeight: 'bold', width: { xs: '80%', sm: 'auto' } }}
                            color={colorBotonConfirmar}
                            onClick={handleConfirmar}
                            disabled={cargando}
                        >
                            {textoBotonConfirmar}
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
}