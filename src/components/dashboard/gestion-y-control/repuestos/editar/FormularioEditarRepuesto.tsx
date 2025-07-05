'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ActualizarRepuesto } from '@/services/gestionycontrol/repuestos/ActualizarRepuestoService';
import { ConsultarRepuestoPorId } from '@/services/gestionycontrol/repuestos/ConsultarRepuestoPorIdService';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Modal,
    SelectChangeEvent,
    Typography,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple, X } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

export function FormularioEditarRepuesto({ IdRepuesto, sendMessage }: { IdRepuesto: number; sendMessage: (event: string, payload: any) => void; }): React.JSX.Element {
    // Se implementa estado para todos los campos del formulario
    const [datos, setDatos] = React.useState({
        NuevoNombreRepuesto: '',
        NuevaCantidadRepuesto: 0,
        NuevoEstadoRepuesto: '',
        IdRepuesto: IdRepuesto
    })
    // ...

    // Se traen todos los estados de la bd y se seleccionan
    const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);

    const CargarDatosIniciales = async () => {
        try {
            const [
                Estados,
                InfoRepuesto
            ] = await Promise.all([
                ListarEstados(),
                ConsultarRepuestoPorId(IdRepuesto)
            ]);
            const EstadosSeleccionados = [];
            for (const element of Estados) {
                if (element.label.includes('Disponible') || element.label.includes('No disponible')) {
                    EstadosSeleccionados.push(element);
                }
            }
            setEstados(EstadosSeleccionados);
            setDatos({
                NuevoNombreRepuesto: InfoRepuesto[0].Nombre,
                NuevaCantidadRepuesto: InfoRepuesto[0].Cantidad,
                NuevoEstadoRepuesto: InfoRepuesto[0].Estado,
                IdRepuesto: IdRepuesto
            });
        } catch (error) {
            console.error(`Error al cargar los estados: ${error}`);
        }
    };
    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [
    //                 Estados,
    //                 InfoRepuesto
    //             ] = await Promise.all([
    //                 ListarEstados(),
    //                 ConsultarRepuestoPorId(IdRepuesto)
    //             ]);
    //             const EstadosSeleccionados = [];
    //             for (const element of Estados) {
    //                 if (element.label.includes('Disponible') || element.label.includes('No disponible')) {
    //                     EstadosSeleccionados.push(element);
    //                 }
    //             }
    //             setEstados(EstadosSeleccionados);
    //             setDatos({
    //                 NuevoNombreRepuesto: InfoRepuesto[0].Nombre,
    //                 NuevaCantidadRepuesto: InfoRepuesto[0].Cantidad,
    //                 NuevoEstadoRepuesto: InfoRepuesto[0].Estado,
    //                 IdRepuesto: IdRepuesto
    //             });
    //         } catch (error) {
    //             console.error(`Error al cargar los estados: ${error}`);
    //         }
    //         console.log("HOLISSS");
    //     };
    //     fetchData();
    // }, []);
    // ...

    // Se implementa el estado para el modal
    const [modalAbierto, setModalAbierto] = React.useState(false);
    // ...

    //Para el tema del modal
    const theme = useTheme();
    //...

    //Se maneja el cambio para todos los campos
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };
    //...

    //Para el manejo de las notificiones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //...

    // Se implementa la actualización del repuesto
    const HandleActualizarRepuesto = async () => {
        try {
            await ActualizarRepuesto(datos);
            sendMessage('repuesto-actualizado', {});
            mostrarMensaje('Repuesto actualizado correctamente.', 'success');
        } catch (error) {
            mostrarMensaje(`Error al actualizar el repuesto: ${error}`, 'error');
        }
    };
    // ...

    //Para abrir el modal para actualizar el equipo
    const EditarRepuesto = async () => {
        try {
            setModalAbierto(true);
            CargarDatosIniciales();
        } catch (error) {
            mostrarMensaje(`Error al cargar los datos del equipo: ${error}`, 'error');
        }
    };
    //...
    return (
        <>
            <IconButton
                size="small"
                color="primary"
                onClick={EditarRepuesto}
            // title='Editar'
            >
                <PencilSimple size={20} weight="bold" />
            </IconButton>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
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
                        // width: '80%',
                        width: {
                            xs: '95%',
                            sm: '90%',
                            md: '80%',
                            lg: '70%',
                        },
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
                    <Typography variant="subtitle1" mb={1}>
                        Actualizar repuesto
                    </Typography>
                    <Card>
                        <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                            <Grid container spacing={1}>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <Input
                                        label='Nombre'
                                        value={datos.NuevoNombreRepuesto}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='NuevoNombreRepuesto'
                                    />
                                </Grid>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <Input
                                        label='Cantidad'
                                        value={datos.NuevaCantidadRepuesto}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='number'
                                        valorname='NuevaCantidadRepuesto'
                                    />
                                </Grid>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <InputSelect
                                        label='Estado'
                                        value={datos.NuevoEstadoRepuesto}
                                        options={estados}
                                        size='small'
                                        onChange={handleChange}
                                        valorname='NuevoEstadoRepuesto'
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={HandleActualizarRepuesto}>Guardar cambios</Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal >
        </>
    )
};