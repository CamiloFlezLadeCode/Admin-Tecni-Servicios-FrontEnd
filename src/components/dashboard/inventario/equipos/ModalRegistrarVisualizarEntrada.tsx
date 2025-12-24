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
import { ConsultarEquipoPorId } from '@/services/gestionycontrol/equipos/ConsultarEquipoPorIdService';
import {
    Box,
    Button,
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
    X,
    Trash
} from '@phosphor-icons/react/dist/ssr';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import SelectConBuscador from '../../componentes_generales/formulario/SelectConBuscador';
import { OpcionesSelectNumero, OpcionesSelectTexto } from '@/types/select_options';

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

    const [modalAbierto, setModalAbierto] = React.useState(false);
    const [habilitarDeshabilitarBotonAgregar, setHabilitarDeshabilitarBotonAgregar] = React.useState(true);
    const [habilitarDeshabilitarBotonGuardar, setHabilitarDeshabilitarBotonGuardar] = React.useState(true);
    const [cargandoVisualizacion, setCargandoVisualizacion] = React.useState(false);

    // Estados para datos
    const [responsables, setResponsables] = React.useState<OpcionesSelectTexto[]>([]);
    const [equipos, setEquipos] = React.useState<OpcionesSelectNumero[]>([]);
    const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<OpcionesSelectNumero[]>([]);
    const [estados, setEstados] = React.useState<OpcionesSelectNumero[]>([]);
    const [unidadPorEquipo, setUnidadPorEquipo] = React.useState<Map<number, number>>(new Map());

    // Diccionarios para visualización rápida
    const equiposDict = React.useMemo(() => {
        const m = new Map<number, string>();
        equipos.forEach((o) => { if (o?.value) m.set(Number(o.value), String(o.label ?? '')); });
        return m;
    }, [equipos]);
    const unidadesDict = React.useMemo(() => {
        const m = new Map<number, string>();
        unidadesDeMedida.forEach((o) => { if (o?.value) m.set(Number(o.value), String(o.label ?? '')); });
        return m;
    }, [unidadesDeMedida]);
    const estadosDict = React.useMemo(() => {
        const m = new Map<number, string>();
        estados.forEach((o) => { if (o?.value) m.set(Number(o.value), String(o.label ?? '')); });
        return m;
    }, [estados]);

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
                // Equipos.unshift(OpcionPorDefectoNumber); // SelectConBuscador maneja su propio default o placeholder
                const opcionesEquipos: { value: number; label: string }[] = [];
                const vistos = new Set<number>();
                (Array.isArray(Equipos) ? Equipos : []).forEach((r: any) => {
                    const hasValueLabel = r && 'value' in r && 'label' in r;
                    const id = hasValueLabel ? Number(r.value) : Number(r.IdEquipo);
                    if (!id || vistos.has(id)) return;
                    const etiqueta = hasValueLabel
                        ? String(r.label ?? String(id)).trim()
                        : (() => {
                            const codigo = String(r.CodigoEquipo ?? '').trim();
                            const nombre = String(r.NombreEquipo ?? '').trim();
                            return (codigo || nombre) ? `${codigo}${codigo && nombre ? ' ' : ''}${nombre}` : `Equipo ${id}`;
                        })();
                    opcionesEquipos.push({ value: id, label: etiqueta });
                    vistos.add(id);
                });
                setEquipos([OpcionPorDefectoNumber, ...opcionesEquipos]);

                const mapa = new Map<number, number>();
                (Array.isArray(Equipos) ? Equipos : []).forEach((r: any) => {
                    const id = Number((r && 'value' in r) ? r.value : r?.IdEquipo);
                    const um = Number(r?.IdUnidadMedida ?? r?.IdUnidadDeMedida ?? 0);
                    if (id && um) mapa.set(id, um);
                });
                setUnidadPorEquipo(mapa);
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

            if (!respuesta) {
                throw new Error('No se encontraron datos para esta entrada');
            }

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
            onMostrarMensaje?.(`Error al cargar los detalles de la entrada: ${error}`, 'error');
        } finally {
            setCargandoVisualizacion(false);
        }
    };

    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaEntrada: fecha || dayjs() }));
    };

    const asignarUnidadMedidaPorEquipo = async (idEquipo: number) => {
        try {
            const existente = unidadPorEquipo.get(idEquipo);
            if (existente) {
                setEquipoItem(prev => ({ ...prev, IdUnidadMedida: existente }));
                return;
            }
            const detalle = await ConsultarEquipoPorId(idEquipo);
            const um = Number(
                detalle?.[0]?.IdUnidadMedida ??
                detalle?.[0]?.IdUnidadDeMedida ??
                detalle?.IdUnidadMedida ??
                detalle?.IdUnidadDeMedida ??
                detalle?.UnidadMedidaId ??
                0
            );
            if (um > 0) {
                setUnidadPorEquipo(prev => new Map(prev).set(idEquipo, um));
                setEquipoItem(prev => ({ ...prev, IdUnidadMedida: um }));
            } else {
                setEquipoItem(prev => ({ ...prev, IdUnidadMedida: OpcionPorDefectoNumber.value }));
            }
        } catch {
            setEquipoItem(prev => ({ ...prev, IdUnidadMedida: OpcionPorDefectoNumber.value }));
        }
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

    const handleEquipoItemChange = (e: any) => {
        const { name, value } = e.target || {};
        if (!name) return;
        const numericos = new Set(['IdEquipo', 'Cantidad', 'IdUnidadMedida', 'IdEstado']);
        setEquipoItem(prev => ({
            ...prev,
            [name]: numericos.has(name) ? Number(value) : value
        }));
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

            sendMessage?.('entrada-equipos-creada', {});
            onMostrarMensaje?.('Entrada de equipos creada correctamente', 'success');
            ConsultarSiguienteNoEntradaEquipo();
        } catch (error) {
            onMostrarMensaje?.(`Hubo un error al crear la entrada de los equipos. ${error}`, 'error');
            console.error(`Hubo un error al guardar la entrada. Detalles: ${error}`);
        }
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
                <Box display="flex" justifyContent="flex-end" mb={1}>
                    <Button variant="contained" onClick={() => { setModalAbierto(true) }}>
                        + Nueva Entrada Equipos
                    </Button>
                </Box>
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
                            md: '78%',
                            lg: '78%',
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
                                {modo === 'crear' ? 'Nueva entrada equipos' : 'Detalles de entrada de equipos'}
                            </Typography>

                            <Divider />

                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid md={3} xs={12}>
                                        <Input
                                            label='No Entrada'
                                            value={datos.NoEntradaEquipos ?? ''}
                                            onChange={handleChange}
                                            tamano='small'
                                            tipo_input='number'
                                            bloqueado
                                        />
                                    </Grid>

                                    <Grid md={3} xs={12}>
                                        <FechayHora
                                            label="Fecha y hora"
                                            value={datos.FechaEntrada}
                                            onChange={handleFechaChange}
                                            disabled={modo === 'visualizar'}
                                        />
                                    </Grid>

                                    <Grid md={3} xs={12}>
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
                                    <>
                                        <Grid xs={12}>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Agregar equipos</Typography>
                                        </Grid>

                                        <Grid container spacing={2}>
                                            <Grid xs={12} md={3}>
                                                <SelectConBuscador label='Equipo' value={equipoItem.IdEquipo} onChange={(e) => { const id = Number((e as any).target?.value ?? 0); setEquipoItem(prev => ({ ...prev, IdEquipo: id })); asignarUnidadMedidaPorEquipo(id); }} options={equipos} valorname='IdEquipo' />
                                            </Grid>
                                            <Grid xs={12} md={3}>
                                                <Input label='Cantidad' value={equipoItem.Cantidad} onChange={handleEquipoItemChange} tamano='small' tipo_input='number' valorname='Cantidad' />
                                            </Grid>
                                            <Grid xs={12} md={3}>
                                                <Input label='Unidad de medida' value={unidadesDict.get(equipoItem.IdUnidadMedida) ?? ''} tamano='small' tipo_input='text' bloqueado />
                                            </Grid>
                                            <Grid xs={12} md={3}>
                                                <InputSelect label='Estado' value={equipoItem.IdEstado} onChange={handleEquipoItemChange} options={estados} valorname='IdEstado' />
                                            </Grid>
                                            <Grid xs={12} md={3}>
                                                <Input label='Observación' value={equipoItem.Observacion} onChange={handleEquipoItemChange} tamano='small' tipo_input='text' valorname='Observacion' />
                                            </Grid>

                                            <Grid xs={12}>
                                                <Box display='flex' justifyContent='flex-end'>
                                                    <Button variant='contained' disabled={habilitarDeshabilitarBotonAgregar} onClick={agregarEquipo}>Agregar</Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}

                                {datos.Equipos.length > 0 && (
                                    <Grid container spacing={2}>
                                        <Grid md={12} xs={12}>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2">
                                                    Equipos {modo === 'crear' ? 'agregados' : 'de la entrada'}
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <TableContainer component={Paper} variant="outlined">
                                                    <Table size='small'>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>Id</strong></TableCell>
                                                                <TableCell><strong>Equipo</strong></TableCell>
                                                                <TableCell><strong>Cantidad</strong></TableCell>
                                                                <TableCell><strong>Unidad</strong></TableCell>
                                                                <TableCell><strong>Estado</strong></TableCell>
                                                                <TableCell><strong>Observación</strong></TableCell>
                                                                {modo === 'crear' && <TableCell align='center'><strong>Acciones</strong></TableCell>}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {datos.Equipos.map((d, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{d.IdEquipo}</TableCell>
                                                                    <TableCell>{equiposDict.get(d.IdEquipo) ?? d.IdEquipo}</TableCell>
                                                                    <TableCell>{d.Cantidad}</TableCell>
                                                                    <TableCell>{unidadesDict.get(d.IdUnidadMedida) ?? d.IdUnidadMedida}</TableCell>
                                                                    <TableCell>{estadosDict.get(d.IdEstado) ?? d.IdEstado}</TableCell>
                                                                    <TableCell>{d.Observacion}</TableCell>
                                                                    {modo === 'crear' && (
                                                                        <TableCell align='center'>
                                                                            <IconButton size='small' color='error' onClick={() => eliminarEquipo(index)}>
                                                                                <Trash />
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
                                    </Grid>
                                )}

                                {modo === 'crear' && (
                                    <Grid container spacing={2}>
                                        <Grid xs={12}>
                                            <Box display='flex' justifyContent='flex-end' sx={{ mt: 2 }}>
                                                <Button variant='contained' color='primary' disabled={habilitarDeshabilitarBotonGuardar} onClick={handleGuardarEntradaEquipo}>
                                                    Guardar Entrada
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                            </CardContent>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}
