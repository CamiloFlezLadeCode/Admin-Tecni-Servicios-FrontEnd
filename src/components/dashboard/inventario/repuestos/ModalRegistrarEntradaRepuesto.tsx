'use client';
import {
    Button,
    Modal,
    Card,
    CardContent,
    CardActions,
    Divider,
    useMediaQuery,
    useTheme,
    Box,
    IconButton,
    Typography,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import * as React from 'react';
import {
    X
} from '@phosphor-icons/react/dist/ssr';
import Grid from '@mui/material/Unstable_Grid2';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import SelectConBuscador from '../../componentes_generales/formulario/SelectConBuscador';
import { prepareCssVars } from '@mui/system';

// INTERFACES
interface EntradaEquipo {
    FechaEntrada: Dayjs;
    DocumentoResponsable: string;
    Observaciones: string;
    Equipos: Equipo[]
}

interface Equipo {
    IdEquipo: number;
    Cantidad: number;
    IdUnidadMedida: number;
    IdEstado: number;
    Observacion: string;

}

const clientes = [
    { value: '5', label: 'Prueba' }
]

export function ModalRegistrarEntradaRepuesto(): React.JSX.Element {
    //Para el manejo del tamaño de la pantalla del dispositivo
    const isMobile = useMediaQuery('(max-width:600px)');
    //...

    // ESTADOS
    // Estado para data general
    const [datos, setDatos] = React.useState<EntradaEquipo>({
        FechaEntrada: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        Equipos: [],
    });
    // ...

    // Estado para la lista de equipos agregados
    const [equipoItem, setEquipoItem] = React.useState<Equipo>({
        IdEquipo: OpcionPorDefectoNumber.value,
        Cantidad: 1,
        IdUnidadMedida: OpcionPorDefectoNumber.value,
        IdEstado: OpcionPorDefectoNumber.value,
        Observacion: ""
    });
    // ...

    // Estado para mostrar/ocultar submodal agregar equipo
    const [modalEquipoAbierto, setModalEquipoAbierto] = React.useState(false);
    // ...

    //Para menajar el estado del modal
    const [modalAbierto, setModalAbierto] = React.useState(false);
    //...

    //Para menejar el tema del modal
    const theme = useTheme();
    //...

    // Estado para habilitar y deshabilitar botón agregar
    const [habilitarDeshabilitarBotonAgregar, setHabilitarDeshabilitarBotonAgregar] = React.useState(true);
    // ...

    // Estado para habilitar y deshabilitar botón guardar
    const [habilitarDeshabilitarBotonGuardar, setHabilitarDeshabilitarBotonGuardar] = React.useState(true);
    // ...

    // USEEFFECT
    // useEffect para habilitar y deshabilitar botón agregar
    React.useEffect(() => {
        habilitarBotonAgregar();
    }, [equipoItem.IdEquipo, equipoItem.Cantidad, equipoItem.IdUnidadMedida, equipoItem.IdEstado]);
    // ...

    // useEffect para habilitar y deshabilitar botón guardar
    React.useEffect(() => {
        habilitarBotonGuardar();
    }, [datos.DocumentoResponsable, datos.Equipos]);
    // ...

    // FUNCIONES
    // Función para selección de la fecha
    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaDevolucion: fecha || dayjs() }));
    };
    // ...

    // Función para agregar equipo a la entrada
    const agregarEquipo = () => {
        setDatos(prev => ({
            ...prev,
            Equipos: [...prev.Equipos, equipoItem]
        }));

        // Reset
        setEquipoItem({
            IdEquipo: OpcionPorDefectoNumber.value,
            Cantidad: 1,
            IdUnidadMedida: OpcionPorDefectoNumber.value,
            IdEstado: OpcionPorDefectoNumber.value,
            Observacion: ""
        })

        // Se cierra submodal
        setModalEquipoAbierto(false);
    };
    // ...

    // Función para eliminar equipo
    const eliminarEquipo = (index: number) => {
        setDatos(prev => ({
            ...prev,
            Equipos: prev.Equipos.filter((_, i) => i !== index)
        }));
    };
    // ...

    // Función para capturar/valores los estados de los elementos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;


        // Para otros campos que son strings
        setDatos(prev => ({ ...prev, [name]: value }));
    };
    // ...

    // Función para habilitar botón si el formulario está correcto
    const habilitarBotonAgregar = () => {
        const EsEquipoValido =
            equipoItem.IdEquipo > 0 &&
            equipoItem.Cantidad > 0 &&
            equipoItem.IdUnidadMedida > 0 &&
            equipoItem.IdEstado > 0;

        if (EsEquipoValido) {
            setHabilitarDeshabilitarBotonAgregar(false);
        } else {
            setHabilitarDeshabilitarBotonAgregar(true);
        };
        return habilitarDeshabilitarBotonAgregar;
    };
    // ...

    // Función para habilitar botón de guardar si la información está completa
    const habilitarBotonGuardar = () => {
        const EsEntradaValida =
            datos.DocumentoResponsable !== '0' &&
            datos.Equipos.length >= 1;

        if (EsEntradaValida) {
            setHabilitarDeshabilitarBotonGuardar(false);
        } else {
            setHabilitarDeshabilitarBotonGuardar(true);
        }
        return habilitarDeshabilitarBotonGuardar;
    };
    // ...

    // Función para guardar entrada de equipo
    const handleGuardarEntradaEquipo = async () => {
        try {
            console.log(datos);
            alert("En desarrollo...");
            setDatos(prev => ({
                ...prev,
                FechaEntrada: dayjs(),
                DocumentoResponsable: OpcionPorDefecto.value,
                Observaciones: '',
                Equipos: [],
            }));
            setEquipoItem(prev => ({
                ...prev,
                IdEquipo: OpcionPorDefectoNumber.value,
                Cantidad: 1,
                IdUnidadMedida: OpcionPorDefectoNumber.value,
                IdEstado: OpcionPorDefectoNumber.value,
                Observacion: ""
            }));
        } catch (error) {
            console.error(`Hubo un error al guardar la entrada. Detalles: ${error}`);
        }
    };
    // ...

    return (
        <>
            <Button variant="contained" onClick={() => { setModalAbierto(true) }}>+ Nueva Entrada</Button>
            <Modal
                open={modalAbierto}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setModalAbierto(false);
                    }
                }}

                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '1%',
                        left: '50%',
                        transform: 'translate(-50%)', //Solo horizontalmente
                        // width: '90%',
                        // maxWidth: 1000,
                        // width: '80%',
                        width: {
                            xs: '95%',
                            sm: '90%',
                            md: '80%',
                            lg: '60%',
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
                        Nueva entrada repuesto/s
                    </Typography>
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid md={4} xs={12}>
                                <FechayHora
                                    label="Fecha y hora"
                                    value={datos.FechaEntrada}
                                    onChange={handleFechaChange}
                                />
                            </Grid>

                            <Grid md={4} xs={12}>
                                <InputSelect
                                    label="Responsable"
                                    value={datos.DocumentoResponsable}
                                    options={clientes}
                                    onChange={handleChange}
                                    valorname="DocumentoResponsable"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid md={12} xs={12}>
                                <Input
                                    label='Observaciones'
                                    value={datos.Observaciones}
                                    onChange={handleChange}
                                    tamano='small'
                                    tipo_input='textarea'
                                    valorname='Observaciones'
                                // bloqueado={todosItemsSinPendiente}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Button variant='text' onClick={() => setModalEquipoAbierto(true)}>
                                + Agregar repuesto
                            </Button>
                        </Grid>
                        {/* <Grid container spacing={2}>
                            {datos.Equipos.length > 0 && (
                                <Grid md={12} xs={12}>
                                    <Box mt={2}>
                                        <Typography variant="subtitle2">Equipos agregados</Typography>
                                        <Divider sx={{ mb: 1 }} />

                                        {datos.Equipos.map((eq, idx) => (
                                            <Box key={idx} display="flex" justifyContent="space-between" mb={1}>
                                                <Typography>Equipo #{eq.IdEquipo}</Typography>
                                                <Typography>Cantidad: {eq.Cantidad}</Typography>
                                                <Typography>Unidad Medida: {eq.IdUnidadMedida}</Typography>
                                                <Typography>Estado: {eq.IdEstado}</Typography>
                                                <Typography>Observacion: {eq.Observacion}</Typography>
                                                <IconButton onClick={() => eliminarEquipo(idx)}><X /></IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>

                            )}
                        </Grid> */}

                        <Grid container spacing={2}>
                            {datos.Equipos.length > 0 && (
                                <Grid md={12} xs={12}>
                                    <Box mt={2}>
                                        <Typography variant="subtitle2">Repuestos agregados</Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong># Repuesto</strong></TableCell>
                                                        <TableCell><strong>Cantidad</strong></TableCell>
                                                        <TableCell><strong>Unidad Medida</strong></TableCell>
                                                        <TableCell><strong>Estado</strong></TableCell>
                                                        <TableCell><strong>Observación</strong></TableCell>
                                                        <TableCell><strong>Acciones</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {datos.Equipos.map((eq, idx) => (
                                                        <TableRow key={idx} hover>
                                                            <TableCell>Equipo #{eq.IdEquipo}</TableCell>
                                                            <TableCell>{eq.Cantidad}</TableCell>
                                                            <TableCell>{eq.IdUnidadMedida}</TableCell>
                                                            <TableCell>{eq.IdEstado}</TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        maxWidth: '200px',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                    title={eq.Observacion}
                                                                >
                                                                    {eq.Observacion}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => eliminarEquipo(idx)}
                                                                    color="error"
                                                                >
                                                                    <X />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant='contained' disabled={habilitarDeshabilitarBotonGuardar} onClick={handleGuardarEntradaEquipo}>Guardar</Button>
                    </CardActions>
                </Box>
            </Modal>

            <Modal open={modalEquipoAbierto}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setModalEquipoAbierto(false);
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '1%',
                        left: '50%',
                        transform: 'translate(-50%)',
                        width: {
                            xs: '70%',
                            sm: '50%',
                            md: '50%',
                            lg: '50%',
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
                    <Typography variant="subtitle1">Agregar repuesto</Typography>
                    <IconButton
                        onClick={() => setModalEquipoAbierto(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <X />
                    </IconButton>
                    <Divider />

                    <Grid container spacing={2} mt={1}>
                        <Grid xs={12} md={6}>
                            <SelectConBuscador
                                label='Repuesto'
                                value={equipoItem.IdEquipo}
                                onChange={(e) => setEquipoItem(prev => ({ ...prev, IdEquipo: Number(e.target.value) }))}
                                options={clientes}
                                size='small'
                                valorname='Equipo'
                            />
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Input
                                label="Cantidad"
                                value={equipoItem.Cantidad}
                                tipo_input="number"
                                onChange={(e) => setEquipoItem(prev => ({ ...prev, Cantidad: Number(e.target.value) }))}
                                tamano='small'
                            />
                        </Grid>

                        <Grid md={6} xs={12} mt={0.5}>
                            <InputSelect
                                label="Unidad de medida"
                                value={equipoItem.IdUnidadMedida}
                                options={clientes}
                                size='small'
                                onChange={(e) => setEquipoItem(prev => ({ ...prev, IdUnidadMedida: Number(e.target.value) }))}
                            />
                        </Grid>

                        <Grid xs={12} md={6}>
                            <InputSelect
                                label="Estado"
                                value={equipoItem.IdEstado}
                                options={clientes}
                                size='small'
                                onChange={(e) => setEquipoItem(prev => ({ ...prev, IdEstado: Number(e.target.value) }))}
                            />
                        </Grid>

                        <Grid xs={12} md={12}>
                            <Input
                                label="Observación"
                                value={equipoItem.Observacion}
                                tipo_input="textarea"
                                onChange={(e) => setEquipoItem(prev => ({ ...prev, Observacion: e.target.value }))}
                                tamano='small'
                            />
                        </Grid>
                    </Grid>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button onClick={agregarEquipo} variant="text" disabled={habilitarDeshabilitarBotonAgregar}>Agregar</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}