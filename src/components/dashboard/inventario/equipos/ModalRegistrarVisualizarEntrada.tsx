'use client';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
import { SiguienteNoEntradaEquipos } from '@/services/inventario/equipos/ConsultarSiguienteNoEntradaEquiposService';
import { GuardarEntradaEquipos } from '@/services/inventario/equipos/GuardarEntradaEquiposService';
import { ListarEquiposPropios } from '@/services/inventario/equipos/ListarEquiposPropiosService';
import { VisualizarEntradaEquipos } from '@/services/inventario/equipos/VisualizarEntradaEquiposService';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Modal,
    Paper,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    X
} from '@phosphor-icons/react/dist/ssr';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import SelectConBuscador from '../../componentes_generales/formulario/SelectConBuscador';

// INTERFACES
interface Equipo {
    IdEquipo: number;
    Cantidad: number;
    IdUnidadMedida: number;
    IdEstado: number;
    Observacion: string;
}

interface EntradaEquipo {
    FechaEntrada: Dayjs;
    DocumentoResponsable: string;
    Observaciones: string;
    NoEntradaEquipos: number | null;
    Equipos: Equipo[];
    UsuarioCreacion: string | null | undefined;
}

interface EntradaEquipoModal {
    FechaEntrada: Dayjs | string;
    DocumentoResponsable?: string;
    Observaciones: string;
    NoEntradaEquipos: number | null;
    Equipos?: Equipo[];
    UsuarioCreacion?: string | null;
    Responsable?: string;
    CreadoPor?: string;
    FechaCreacion?: string;
}

interface OpcionesSelectTexto {
    value: string;
    label: string;
}

interface OpcionesSelectNumero {
    value: number;
    label: string;
}

// PROPS
interface ModalRegistrarEntradaEquipoProps {
    modo?: 'crear' | 'visualizar';
    noEntradaEquipos?: number;
    onClose?: () => void;
    readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly sendMessage?: (event: string, payload: any) => void;
    readonly mensajesSocket?: any[];
}

export function ModalRegistrarEntradaEquipos({
    modo = 'crear',
    noEntradaEquipos,
    onClose,
    onMostrarMensaje,
    sendMessage,
    mensajesSocket = []
}: Readonly<ModalRegistrarEntradaEquipoProps>): React.JSX.Element {
    // Hooks y contextos
    const isMobile = useMediaQuery('(max-width:600px)');
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const theme = useTheme();

    // Estados principales
    const [datos, setDatos] = React.useState<EntradaEquipo>({
        FechaEntrada: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        NoEntradaEquipos: null,
        Equipos: [],
        UsuarioCreacion: documentoUsuarioActivo
    });

    const [equipoItem, setEquipoItem] = React.useState<Equipo>({
        IdEquipo: OpcionPorDefectoNumber.value,
        Cantidad: 1,
        IdUnidadMedida: OpcionPorDefectoNumber.value,
        IdEstado: OpcionPorDefectoNumber.value,
        Observacion: ""
    });

    const [modalEquipoAbierto, setModalEquipoAbierto] = React.useState(false);
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const [habilitarDeshabilitarBotonAgregar, setHabilitarDeshabilitarBotonAgregar] = React.useState(true);
    const [habilitarDeshabilitarBotonGuardar, setHabilitarDeshabilitarBotonGuardar] = React.useState(true);
    const [cargandoVisualizacion, setCargandoVisualizacion] = React.useState(false);

    // Estados para datos
    const [responsables, setResponsables] = React.useState<OpcionesSelectTexto[]>([]);
    const [equipos, setEquipos] = React.useState<OpcionesSelectNumero[]>([]);
    const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<OpcionesSelectNumero[]>([]);
    const [estados, setEstados] = React.useState<OpcionesSelectNumero[]>([]);

    // EFFECTS
    // Cargar datos cuando se abre en modo visualizar
    React.useEffect(() => {
        if (modo === 'visualizar' && noEntradaEquipos) {
            cargarDatosEntrada(noEntradaEquipos);
        }
    }, [modo, noEntradaEquipos]);

    // Abrir modal automáticamente en modo visualizar
    React.useEffect(() => {
        if (modo === 'visualizar' && noEntradaEquipos) {
            setModalAbierto(true);
        }
    }, [modo, noEntradaEquipos]);

    // Resetear para modo crear
    React.useEffect(() => {
        if (modo === 'crear') {
            setDatos({
                FechaEntrada: dayjs(),
                DocumentoResponsable: OpcionPorDefecto.value,
                Observaciones: '',
                NoEntradaEquipos: null,
                Equipos: [],
                UsuarioCreacion: documentoUsuarioActivo
            });
            ConsultarSiguienteNoEntradaEquipo();
        }
    }, [modo]);

    React.useEffect(() => {
        if (mensajesSocket.length > 0) {
            const UltimoMensaje = mensajesSocket[mensajesSocket.length - 1];
            if (UltimoMensaje.tipo === 'entrada-equipos-creada') {
                ConsultarSiguienteNoEntradaEquipo();
            }
        }
    }, [mensajesSocket]);

    // Cargar datos iniciales
    React.useEffect(() => {
        const CargarResponsables = async () => {
            try {
                const Responsables = await ListarProfesionalesPertenecientes();
                Responsables.unshift(OpcionPorDefecto);
                setResponsables(Responsables);
            } catch (error) {
                console.error(`Error al listar los responsables: ${error}`);
            }
        };

        const CargarEquipos = async () => {
            try {
                const Equipos = await ListarEquiposPropios();
                Equipos.unshift(OpcionPorDefectoNumber);
                setEquipos(Equipos);
            } catch (error) {
                console.error(`Error al listar los equipos: ${error}`);
            }
        };

        const CargarUnidadesDeMedida = async () => {
            try {
                const UnidadesDeMedida = await ListarUnidadesDeMedida();
                UnidadesDeMedida.unshift(OpcionPorDefectoNumber);
                setUnidadesDeMedida(UnidadesDeMedida);
            } catch (error) {
                console.error(`Error al listar las unidades de medida: ${error}`);
            }
        };

        const CargarEstados = async () => {
            try {
                const Estados = await ListarEstados();
                Estados.unshift(OpcionPorDefectoNumber);
                setEstados([OpcionPorDefectoNumber, ...Estados.filter((e: any) =>
                    /nuevo|usado/i.test(e.label)
                )]);
            } catch (error) {
                console.error(`Error al listar los estados: ${error}`);
            }
        }

        CargarResponsables();
        CargarEquipos();
        CargarUnidadesDeMedida();
        CargarEstados();

        if (modo === 'crear') {
            ConsultarSiguienteNoEntradaEquipo();
        }
    }, [modo]);

    // Validaciones
    React.useEffect(() => {
        habilitarBotonAgregar();
    }, [equipoItem.IdEquipo, equipoItem.Cantidad, equipoItem.IdUnidadMedida, equipoItem.IdEstado]);

    React.useEffect(() => {
        habilitarBotonGuardar();
    }, [datos.DocumentoResponsable, datos.Equipos]);

    // FUNCIONES
    const cargarDatosEntrada = async (noEntrada: number) => {
        try {
            setCargandoVisualizacion(true);
            const respuestaArray = await VisualizarEntradaEquipos({ NoEntradaEquipos: noEntrada });
            const respuesta = respuestaArray[0];

            const datosTransformados: EntradaEquipoModal = {
                FechaEntrada: respuesta.FechaEntrada,
                DocumentoResponsable: respuesta.Responsable,
                Observaciones: respuesta.Observaciones || '',
                NoEntradaEquipos: respuesta.NoEntradaEquipos,
                Equipos: (respuesta.Equipos || []).map((equipo: Equipo) => ({
                    IdEquipo: equipo.IdEquipo,
                    Cantidad: equipo.Cantidad,
                    IdUnidadMedida: equipo.IdUnidadMedida,
                    IdEstado: equipo.IdEstado,
                    Observacion: equipo.Observacion || ''
                })),
                UsuarioCreacion: respuesta.UsuarioCreacion || '',
                Responsable: respuesta.NombreResponsable || '',
                CreadoPor: respuesta.CreadoPor || '',
                FechaCreacion: respuesta.FechaCreacion || ''
            };

            setDatos({
                FechaEntrada: dayjs(datosTransformados.FechaEntrada),
                DocumentoResponsable: datosTransformados.DocumentoResponsable || OpcionPorDefecto.value,
                Observaciones: datosTransformados.Observaciones,
                NoEntradaEquipos: datosTransformados.NoEntradaEquipos,
                Equipos: datosTransformados.Equipos || [],
                UsuarioCreacion: datosTransformados.UsuarioCreacion
            });

        } catch (error) {
            console.error('Error al cargar datos de visualización:', error);
            // mostrarMensaje(`Error al cargar los detalles de la entrada: ${error}`, 'error');
        } finally {
            setCargandoVisualizacion(false);
        }
    };

    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaEntrada: fecha || dayjs() }));
    };

    const agregarEquipo = () => {
        setDatos(prev => ({
            ...prev,
            Equipos: [...prev.Equipos, equipoItem]
        }));

        setEquipoItem({
            IdEquipo: OpcionPorDefectoNumber.value,
            Cantidad: 1,
            IdUnidadMedida: OpcionPorDefectoNumber.value,
            IdEstado: OpcionPorDefectoNumber.value,
            Observacion: ""
        });

        setModalEquipoAbierto(false);
    };

    const eliminarEquipo = (index: number) => {
        setDatos(prev => ({
            ...prev,
            Equipos: prev.Equipos.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const habilitarBotonAgregar = () => {
        const EsEquipoValido =
            equipoItem.IdEquipo > 0 &&
            equipoItem.Cantidad > 0 &&
            equipoItem.IdUnidadMedida > 0 &&
            equipoItem.IdEstado > 0;

        setHabilitarDeshabilitarBotonAgregar(!EsEquipoValido);
    };

    const habilitarBotonGuardar = () => {
        const EsEntradaValida =
            datos.DocumentoResponsable !== 'SinSeleccionar' &&
            datos.Equipos.length >= 1;

        setHabilitarDeshabilitarBotonGuardar(!EsEntradaValida);
    };

    const handleGuardarEntradaEquipo = async () => {
        try {
            const fechaEntradaFormateada = typeof datos.FechaEntrada === 'string'
                ? datos.FechaEntrada
                : datos.FechaEntrada.format('YYYY-MM-DD HH:mm:ss');

            const entradaEquipoCompleta = {
                ...datos,
                FechaEntrada: fechaEntradaFormateada
            };

            const response = await GuardarEntradaEquipos(entradaEquipoCompleta);
            console.log(response);

            setDatos({
                FechaEntrada: dayjs(),
                DocumentoResponsable: OpcionPorDefecto.value,
                Observaciones: '',
                NoEntradaEquipos: null,
                Equipos: [],
                UsuarioCreacion: documentoUsuarioActivo
            });

            setEquipoItem({
                IdEquipo: OpcionPorDefectoNumber.value,
                Cantidad: 1,
                IdUnidadMedida: OpcionPorDefectoNumber.value,
                IdEstado: OpcionPorDefectoNumber.value,
                Observacion: ""
            });

            sendMessage?.('usuario-actualizado', {});
            onMostrarMensaje?.('Entrada de equipos creada correctamente', 'success');
            // setModalAbierto(false);
        } catch (error) {
            onMostrarMensaje?.(`Hubo un error al crear la entrada de los equipos. ${error}`, 'error');
            console.error(`Hubo un error al guardar la entrada. Detalles: ${error}`);
        }
    };

    const obtenerNombreEquipo = (idEquipo: number): string => {
        const equipo = equipos.find(e => e.value === idEquipo);
        return equipo ? equipo.label : `Equipo #${idEquipo}`;
    };

    const obtenerNombreUnidadMedida = (idUnidad: number): string => {
        const unidad = unidadesDeMedida.find(u => u.value === idUnidad);
        return unidad ? unidad.label : `Unidad #${idUnidad}`;
    };

    const obtenerNombreEstado = (idEstado: number): string => {
        const estado = estados.find(e => e.value === idEstado);
        return estado ? estado.label : `Estado #${idEstado}`;
    };

    const ConsultarSiguienteNoEntradaEquipo = async () => {
        try {
            const SiguienteNoEntradaE = await SiguienteNoEntradaEquipos();
            setDatos(prev => ({
                ...prev,
                NoEntradaEquipos: Number(SiguienteNoEntradaE[0]?.SiguienteNoEntradaEquipo)
            }));
        } catch (error) {
            console.error(`Error al consultar el siguiente no de entrada de equipo: ${error}`);
        }
    };

    const handleCerrarModal = () => {
        if (onClose) {
            onClose();
        } else {
            setModalAbierto(false);
        }
    };

    return (
        <>
            {modo === 'crear' && (
                <Button variant="contained" onClick={() => { setModalAbierto(true) }}>
                    + Nueva Entrada
                </Button>
            )}

            <Modal
                open={modalAbierto}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleCerrarModal();
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
                        transform: 'translate(-50%)',
                        width: {
                            xs: '95%',
                            sm: '90%',
                            md: '80%',
                            lg: '60%',
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
                        onClick={handleCerrarModal}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <X />
                    </IconButton>

                    {cargandoVisualizacion && modo === 'visualizar' ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                            <Typography>Cargando detalles de la entrada...</Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="subtitle1" mb={1}>
                                {modo === 'crear' ? 'Nueva entrada equipo/s' : 'Detalles de entrada de equipos'}
                            </Typography>

                            <Divider />

                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid md={2} xs={12}>
                                        <Input
                                            label='No Entrada'
                                            value={datos.NoEntradaEquipos ?? ''}
                                            onChange={handleChange}
                                            tamano='small'
                                            tipo_input='number'
                                            bloqueado
                                        />
                                    </Grid>

                                    <Grid md={4} xs={12}>
                                        <FechayHora
                                            label="Fecha y hora"
                                            value={datos.FechaEntrada}
                                            onChange={handleFechaChange}
                                            disabled={modo === 'visualizar'}
                                        />
                                    </Grid>

                                    <Grid md={4} xs={12}>
                                        <InputSelect
                                            label="Responsable"
                                            value={datos.DocumentoResponsable}
                                            options={responsables}
                                            onChange={handleChange}
                                            valorname="DocumentoResponsable"
                                            required
                                            bloqueado={modo === 'visualizar'}
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
                                            bloqueado={modo === 'visualizar'}
                                        />
                                    </Grid>
                                </Grid>

                                {modo === 'crear' && (
                                    <Grid container spacing={2}>
                                        <Button variant='text' onClick={() => setModalEquipoAbierto(true)}>
                                            + Agregar equipo
                                        </Button>
                                    </Grid>
                                )}

                                <Grid container spacing={2}>
                                    {datos.Equipos.length > 0 && (
                                        <Grid md={12} xs={12}>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2">
                                                    Equipos {modo === 'crear' ? 'agregados' : 'de la entrada'}
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />

                                                <TableContainer component={Paper} variant="outlined">
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong># Equipo</strong></TableCell>
                                                                <TableCell><strong>Cantidad</strong></TableCell>
                                                                <TableCell><strong>Unidad Medida</strong></TableCell>
                                                                <TableCell><strong>Estado</strong></TableCell>
                                                                <TableCell><strong>Observación</strong></TableCell>
                                                                {modo === 'crear' && (
                                                                    <TableCell><strong>Acciones</strong></TableCell>
                                                                )}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {datos.Equipos.map((eq, idx) => (
                                                                <TableRow key={idx} hover>
                                                                    <TableCell>{idx + 1} - {obtenerNombreEquipo(eq.IdEquipo)}</TableCell>
                                                                    <TableCell>{eq.Cantidad}</TableCell>
                                                                    <TableCell>{obtenerNombreUnidadMedida(eq.IdUnidadMedida)}</TableCell>
                                                                    <TableCell>{obtenerNombreEstado(eq.IdEstado)}</TableCell>
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
                                                                    {modo === 'crear' && (
                                                                        <TableCell>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => eliminarEquipo(idx)}
                                                                                color="error"
                                                                            >
                                                                                <X />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    )}
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

                            {modo === 'crear' && (
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    <Button
                                        variant='contained'
                                        disabled={habilitarDeshabilitarBotonGuardar}
                                        onClick={handleGuardarEntradaEquipo}
                                    >
                                        Guardar
                                    </Button>
                                </CardActions>
                            )}
                        </>
                    )}
                </Box>
            </Modal>

            {modo === 'crear' && (
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
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 3,
                            borderRadius: 2,
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                    >
                        <Typography variant="subtitle1">Agregar equipo</Typography>
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
                                    label='Equipo'
                                    value={equipoItem.IdEquipo}
                                    onChange={(e) => setEquipoItem(prev => ({ ...prev, IdEquipo: Number(e.target.value) }))}
                                    options={equipos}
                                    size='small'
                                    valorname='Equipo'
                                    required
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <Input
                                    label="Cantidad"
                                    value={equipoItem.Cantidad}
                                    tipo_input="number"
                                    onChange={(e) => setEquipoItem(prev => ({ ...prev, Cantidad: Number(e.target.value) }))}
                                    tamano='small'
                                    required
                                />
                            </Grid>

                            <Grid md={6} xs={12} mt={0.5}>
                                <InputSelect
                                    label="Unidad de medida"
                                    value={equipoItem.IdUnidadMedida}
                                    options={unidadesDeMedida}
                                    size='small'
                                    onChange={(e) => setEquipoItem(prev => ({ ...prev, IdUnidadMedida: Number(e.target.value) }))}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <InputSelect
                                    label="Estado"
                                    value={equipoItem.IdEstado}
                                    options={estados}
                                    size='small'
                                    onChange={(e) => setEquipoItem(prev => ({ ...prev, IdEstado: Number(e.target.value) }))}
                                    required
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
                            <Button onClick={agregarEquipo} variant="text" disabled={habilitarDeshabilitarBotonAgregar}>
                                Agregar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}
        </>
    );
}