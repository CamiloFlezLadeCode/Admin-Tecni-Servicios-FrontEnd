'use client';

import axios from "axios";
import { EliminarVehiculo } from '@/services/gestionycontrol/vehiculos/EliminarVehiculoService';
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
import {
    TrashSimple,
    Trash,
    X
} from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

export default function AlertaEliminarVehiculo({ IdVehiculo, NombrePlacaVehiculo, sendMessage, mostrarMensaje }: { IdVehiculo: number; NombrePlacaVehiculo: string; sendMessage: (event: string, payload: any) => void; mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void; }): React.JSX.Element {
    // Se maneja el estado para abrir el modal de alerta
    const [modalAbierto, setModalAbierto] = React.useState(false);
    // ...

    // Para asignar el tema al modal de alerta
    const theme = useTheme();
    // ...

    // Funcionalidad para eliminar vehiculo
    const HandleEliminarVehiculo = async () => {
        try {
            // 1. Se ejecuta eliminación
            const Respuesta = await EliminarVehiculo(IdVehiculo);
            // 2. Se no tifica al servidor
            sendMessage('vehiculo-eliminado', {});
            // 3. Se muestra mensaje de confirmación
            if (Respuesta.mensaje.includes('eliminado')) {
                mostrarMensaje('Vehículo eliminado correctamente.', 'success');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                // console.log('STATUS:', status);
                if (status === 409) {
                    mostrarMensaje('No se puede eliminar el vehículo porque tiene remisiones asociadas.', 'error');
                } else {
                    mostrarMensaje(`Error al eliminar el vehículo (status ${status}). (error ${JSON.stringify(error)})`, 'error');
                }
            } else {
                mostrarMensaje('Error inesperado al eliminar el vehículo.', 'error');
            }
        }
    };
    // ...

    // Se maneja texto conteniendo el NombrePlaca del vehículo
    const Pregunta = `¿Realmente quieres eliminar el vehículo ${NombrePlacaVehiculo}?`;
    // ...
    return (
        <>
            <IconButton
                size="small"
                color="error"
                onClick={() => { setModalAbierto(true) }}
            >
                <Trash size={20} weight="bold" />
            </IconButton>
            <Modal
                open={modalAbierto}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setModalAbierto(false);
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // width: '90%',
                        // maxWidth: 1000,
                        // width: '50%',
                        width: { xs: '80%', md: '40%' },
                        [theme.breakpoints.down('xl')]: {
                            // width: 700,
                        },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <IconButton
                        onClick={() => setModalAbierto(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <X />
                    </IconButton>
                    <Card sx={{ mt: 4 }}>
                        <CardHeader
                            title={Pregunta}
                            sx={{ textAlign: 'center' }}
                        />
                        <CardContent
                            sx={{
                                // p: 0,
                                // display: 'flex',
                                // flexDirection: { xs: 'column', sm: 'row' },
                                // justifyContent: 'space-evenly',
                                // alignItems: 'center',
                                // gap: 2,
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
                                onClick={() => { setModalAbierto(false) }}
                            >
                                No
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ fontWeight: 'bold', width: { xs: '80%', sm: 'auto' } }}
                                color='error'
                                onClick={HandleEliminarVehiculo}
                            >
                                Sí
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>
    )
};