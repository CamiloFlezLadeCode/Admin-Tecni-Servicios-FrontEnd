'use client';

import * as React from 'react';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple, X } from '@phosphor-icons/react/dist/ssr';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Modal,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ConsultarEquipoPorId } from '@/services/gestionycontrol/equipos/ConsultarEquipoPorIdService';
import { ActualizarEquipo } from '@/services/gestionycontrol/equipos/ActualizarEquipoService';

export function FormularioEditarEquipo({ IdEquipo, sendMessage }: { IdEquipo: number; sendMessage: (event: string, payload: any) => void; }): React.JSX.Element {
    //Para cargar los datos de la bd para las listas desplegables
    const [Categorias, setCategorias] = React.useState<{ value: string | number; label: string }[]>([]);
    const [Subarrendatarios, setSubarrendatarios] = React.useState<{ value: string | number; label: string }[]>([]);
    const [Estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);
    //Se maneja el estado para todos los campos del formulario
    const [datos, setDatos] = React.useState({
        NombreEquipo: '',
        CategoriaEquipo: '1',
        PrecioVenta: '',
        PrecioAlquiler: '',
        PrecioReparacion: '',
        EstadoEquipo: '3',
        Cantidad: 1,
        DocumentoSubarrendatario: '',
        IdEquipo: IdEquipo
    });
    //...
    const CargarDatosIniciales = async () => {
        try {
            const [
                categorias,
                subarrendatarios,
                estados,
                infoequipo
            ] = await Promise.all([
                ListarCategorias(),
                ListarSubarrendatarios(),
                ListarEstados(),
                ConsultarEquipoPorId(IdEquipo)
            ]);
            setCategorias(categorias);
            setSubarrendatarios(subarrendatarios);
            setEstados(estados);
            // Se pasan los datos que vienen de la bd
            setDatos({
                NombreEquipo: infoequipo[0].Nombre,
                CategoriaEquipo: infoequipo[0].IdCategoria,
                PrecioVenta: infoequipo[0].PrecioVenta,
                PrecioAlquiler: infoequipo[0].PrecioAlquiler,
                PrecioReparacion: infoequipo[0].PrecioReparacion,
                EstadoEquipo: infoequipo[0].IdEstado,
                Cantidad: infoequipo[0].Cantidad,
                DocumentoSubarrendatario: infoequipo[0].DocumentoSubarrendatario,
                IdEquipo: IdEquipo
            });
            //...
        } catch (error) {
            console.error(`Error al cargar datos: ${error}`);
        }
    };
    //...

    //Para el tema del modal
    const theme = useTheme();
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

    //Para abrir el modal para actualizar el equipo
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const EditarEquipo = async () => {
        try {
            setModalAbierto(true);
            CargarDatosIniciales();
        } catch (error) {
            mostrarMensaje(`Error al cargar los datos del equipo: ${error}`, 'error');
        }
    };
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

    //Función para actualizar el equipo
    const HandleActualizarEquipo = async () => {
        try {
            await ActualizarEquipo(datos);
            sendMessage('equipo-actualizado', {});
            mostrarMensaje(`Equipo actualizado correctamente`, 'success');
        } catch (error) {
            mostrarMensaje(`Error al actualizar el equipo: ${error}`, 'error');
        }
    };
    //...
    return (
        <>
            <IconButton
                size="small"
                color="primary"
                onClick={EditarEquipo}
                title='Editar'
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
                        Actualizar Equipo
                    </Typography>
                    <Card>
                        <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                            <Grid container spacing={1}>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <InputSelect
                                        label='Referencia'
                                        value={datos.CategoriaEquipo}
                                        options={Categorias}
                                        size='small'
                                        onChange={handleChange}
                                        valorname='CategoriaEquipo'
                                    />
                                </Grid>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <Input
                                        label='Nombre'
                                        value={datos.NombreEquipo}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='NombreEquipo'
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <Input
                                        label='Cantidad'
                                        value={datos.Cantidad}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='number'
                                        valorname='Cantidad'
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <InputSelect
                                        label='Subarrendatario'
                                        value={datos.DocumentoSubarrendatario}
                                        options={Subarrendatarios}
                                        size='small'
                                        onChange={handleChange}
                                        valorname='DocumentoSubarrendatario'
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <Input
                                        label='Precio Venta'
                                        value={datos.PrecioVenta}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='number'
                                        valorname='PrecioVenta'
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <Input
                                        label='Precio Alquiler'
                                        value={datos.PrecioAlquiler}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='number'
                                        valorname='PrecioAlquiler'
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <Input
                                        label='Precio Reparación'
                                        value={datos.PrecioReparacion}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='number'
                                        valorname='PrecioReparacion'
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <InputSelect
                                        label='Estado'
                                        value={datos.EstadoEquipo}
                                        options={Estados}
                                        size='small'
                                        onChange={handleChange}
                                        valorname='EstadoEquipo'
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={HandleActualizarEquipo}>
                                Guardar cambios
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal>
        </>
    );
};
