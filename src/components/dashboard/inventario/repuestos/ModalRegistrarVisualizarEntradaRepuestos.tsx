// 'use client';
// import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import { UserContext } from '@/contexts/user-context';
// import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
// import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
// import { ListarEstados } from '@/services/generales/ListarEstadosService';
// import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
// import { SiguienteNoEntradaEquipos } from '@/services/inventario/equipos/ConsultarSiguienteNoEntradaEquiposService';
// import { GuardarEntradaEquipos } from '@/services/inventario/equipos/GuardarEntradaEquiposService';
// import { ListarEquiposPropios } from '@/services/inventario/equipos/ListarEquiposPropiosService';
// import { VisualizarEntradaEquipos } from '@/services/inventario/equipos/VisualizarEntradaEquiposService';
// import {
//     Box,
//     Button,
//     CardActions,
//     CardContent,
//     Divider,
//     IconButton,
//     Modal,
//     Paper,
//     SelectChangeEvent,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     useMediaQuery,
//     useTheme
// } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// import {
//     X
// } from '@phosphor-icons/react/dist/ssr';
// import dayjs, { Dayjs } from 'dayjs';
// import * as React from 'react';
// import SelectConBuscador from '../../componentes_generales/formulario/SelectConBuscador';
// import { OpcionesSelectNumero, OpcionesSelectTexto } from '@/types/select_options';
// import { ListarRepuestos } from '@/services/inventario/repuestos/ListarRepuestosService';
// import { ConsultarEntradasRepuestos } from '@/services/inventario/repuestos/ConsultarEntradasRepuestosService';
// import { VisualizarEntradaRepuestos } from '@/services/inventario/repuestos/VisualizarEntradaRepuestosService';
// import { ConsultarSiguienteNoEntradaRepuestos } from '@/services/inventario/repuestos/ConsultarSiguienteNoEntradaRepuestosService';


// // INTERFACES
// interface Repuesto {
//     IdRepuesto: number;
//     Cantidad: number;
//     IdUnidadMedida: number;
//     IdEstado: number;
//     Observacion: string;
// }

// interface EntradaRepuesto {
//     FechaEntrada: Dayjs;
//     DocumentoResponsable: string;
//     Observaciones: string;
//     NoEntradaRepuestos: number | null;
//     Repuestos: Repuesto[];
//     UsuarioCreacion: string | null | undefined;
// }

// interface EntradaRepuestoModal {
//     FechaEntrada: Dayjs | string;
//     DocumentoResponsable?: string;
//     Observaciones: string;
//     NoEntradaRepuestos: number | null;
//     Repuestos?: Repuesto[];
//     UsuarioCreacion?: string | null;
//     Responsable?: string;
//     CreadoPor?: string;
//     FechaCreacion?: string;
// }

// // PROPS
// interface ModalRegistrarVisualizarEntradaRepuestosProps {
//     modo?: 'crear' | 'visualizar';
//     noEntradaRepuestos?: number;
//     onClose?: () => void;
//     readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
//     readonly sendMessage?: (event: string, payload: any) => void;
//     readonly mensajesSocket?: any[];
// }

// export function ModalRegistrarVisualizarEntradaRepuestos({
//     modo = 'crear',
//     noEntradaRepuestos,
//     onClose,
//     onMostrarMensaje,
//     sendMessage,
//     mensajesSocket = []
// }: Readonly<ModalRegistrarVisualizarEntradaRepuestosProps>): React.JSX.Element {
//     // Hooks y contextos
//     const isMobile = useMediaQuery('(max-width:600px)');
//     const { user } = React.useContext(UserContext) || { user: null };
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;
//     const theme = useTheme();

//     // Estados principales
//     const [datos, setDatos] = React.useState<EntradaRepuesto>({
//         FechaEntrada: dayjs(),
//         DocumentoResponsable: OpcionPorDefecto.value,
//         Observaciones: '',
//         NoEntradaRepuestos: null,
//         Repuestos: [],
//         UsuarioCreacion: documentoUsuarioActivo
//     });

//     const [repuestoItem, setRepuestoItem] = React.useState<Repuesto>({
//         IdRepuesto: OpcionPorDefectoNumber.value,
//         Cantidad: 1,
//         IdUnidadMedida: OpcionPorDefectoNumber.value,
//         IdEstado: OpcionPorDefectoNumber.value,
//         Observacion: ""
//     });

//     const [modalRepuestoAbierto, setModalRepuestoAbierto] = React.useState(false);
//     const [modalAbierto, setModalAbierto] = React.useState(false);
//     const [habilitarDeshabilitarBotonAgregar, setHabilitarDeshabilitarBotonAgregar] = React.useState(true);
//     const [habilitarDeshabilitarBotonGuardar, setHabilitarDeshabilitarBotonGuardar] = React.useState(true);
//     const [cargandoVisualizacion, setCargandoVisualizacion] = React.useState(false);

//     // Estados para datos
//     const [responsables, setResponsables] = React.useState<OpcionesSelectTexto[]>([]);
//     const [repuestos, setRepuestos] = React.useState<OpcionesSelectNumero[]>([]);
//     const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<OpcionesSelectNumero[]>([]);
//     const [estados, setEstados] = React.useState<OpcionesSelectNumero[]>([]);

//     // EFFECTS
//     // Cargar datos cuando se abre en modo visualizar
//     React.useEffect(() => {
//         if (modo === 'visualizar' && noEntradaRepuestos) {
//             cargarDatosEntrada(noEntradaRepuestos);
//         }
//     }, [modo, noEntradaRepuestos]);

//     // Abrir modal automáticamente en modo visualizar
//     React.useEffect(() => {
//         if (modo === 'visualizar' && noEntradaRepuestos) {
//             setModalAbierto(true);
//         }
//     }, [modo, noEntradaRepuestos]);

//     // Resetear para modo crear
//     React.useEffect(() => {
//         if (modo === 'crear') {
//             setDatos({
//                 FechaEntrada: dayjs(),
//                 DocumentoResponsable: OpcionPorDefecto.value,
//                 Observaciones: '',
//                 NoEntradaRepuestos: null,
//                 Repuestos: [],
//                 UsuarioCreacion: documentoUsuarioActivo
//             });
//             ConsultarSiguienteNoEntradaRepuestos();
//         }
//     }, [modo]);

//     React.useEffect(() => {
//         if (mensajesSocket.length > 0) {
//             const UltimoMensaje = mensajesSocket[mensajesSocket.length - 1];
//             if (UltimoMensaje.tipo === 'entrada-repuestos-creada') {
//                 ConsultarSiguienteNoEntradaRepuestos();
//             }
//         }
//     }, [mensajesSocket]);

//     // Cargar datos iniciales
//     React.useEffect(() => {
//         const CargarResponsables = async () => {
//             try {
//                 const Responsables = await ListarProfesionalesPertenecientes();
//                 Responsables.unshift(OpcionPorDefecto);
//                 setResponsables(Responsables);
//             } catch (error) {
//                 console.error(`Error al listar los responsables: ${error}`);
//             }
//         };

//         const CargarRepuestos = async () => {
//             try {
//                 const Repuestos = await ListarEquiposPropios();
//                 Repuestos.unshift(OpcionPorDefectoNumber);
//                 setRepuestos(Repuestos);
//             } catch (error) {
//                 console.error(`Error al listar los equipos: ${error}`);
//             }
//         };

//         const CargarUnidadesDeMedida = async () => {
//             try {
//                 const UnidadesDeMedida = await ListarUnidadesDeMedida();
//                 UnidadesDeMedida.unshift(OpcionPorDefectoNumber);
//                 setUnidadesDeMedida(UnidadesDeMedida);
//             } catch (error) {
//                 console.error(`Error al listar las unidades de medida: ${error}`);
//             }
//         };

//         const CargarEstados = async () => {
//             try {
//                 const Estados = await ListarEstados();
//                 Estados.unshift(OpcionPorDefectoNumber);
//                 setEstados([OpcionPorDefectoNumber, ...Estados.filter((e: any) =>
//                     /nuevo|usado/i.test(e.label)
//                 )]);
//             } catch (error) {
//                 console.error(`Error al listar los estados: ${error}`);
//             }
//         }

//         CargarResponsables();
//         CargarRepuestos();
//         CargarUnidadesDeMedida();
//         CargarEstados();

//         if (modo === 'crear') {
//             ConsultarSiguienteNoEntradaRepuestos();
//         }
//     }, [modo]);

//     // Validaciones
//     React.useEffect(() => {
//         habilitarBotonAgregar();
//     }, [repuestoItem.IdRepuesto, repuestoItem.Cantidad, repuestoItem.IdUnidadMedida, repuestoItem.IdEstado]);

//     React.useEffect(() => {
//         habilitarBotonGuardar();
//     }, [datos.DocumentoResponsable, datos.Repuestos]);

//     // FUNCIONES
//     const cargarDatosEntrada = async (noEntrada: number) => {
//         try {
//             setCargandoVisualizacion(true);
//             const respuesta = await VisualizarEntradaRepuestos({ NoEntradaRepuestos: noEntrada });
//             const datosTransformados: EntradaRepuestoModal = {
//                 FechaEntrada: respuesta.FechaEntrada,
//                 DocumentoResponsable: respuesta.Responsable,
//                 Observaciones: respuesta.Observaciones || '',
//                 NoEntradaRepuestos: respuesta.NoEntradaEquipos,
//                 Repuestos: (respuesta.Equipos || []).map((equipo: Repuesto) => ({
//                     IdEquipo: equipo.IdRepuesto,
//                     Cantidad: equipo.Cantidad,
//                     IdUnidadMedida: equipo.IdUnidadMedida,
//                     IdEstado: equipo.IdEstado,
//                     Observacion: equipo.Observacion || ''
//                 })),
//                 UsuarioCreacion: respuesta.UsuarioCreacion || '',
//                 Responsable: respuesta.NombreResponsable || '',
//                 CreadoPor: respuesta.CreadoPor || '',
//                 FechaCreacion: respuesta.FechaCreacion || ''
//             };

//             setDatos({
//                 FechaEntrada: dayjs(datosTransformados.FechaEntrada),
//                 DocumentoResponsable: datosTransformados.DocumentoResponsable || OpcionPorDefecto.value,
//                 Observaciones: datosTransformados.Observaciones,
//                 NoEntradaRepuestos: datosTransformados.NoEntradaRepuestos,
//                 Repuestos: datosTransformados.Repuestos || [],
//                 UsuarioCreacion: datosTransformados.UsuarioCreacion
//             });
//         } catch (error) {
//             console.error('Error al cargar datos de visualización:', error);
//         } finally {
//             setCargandoVisualizacion(false);
//         }
//     }

//     const handleFechaChange = (fecha: Dayjs | null) => {
//         setDatos(prev => ({ ...prev, FechaEntrada: fecha || dayjs() }));
//     };

//     const agregarRepuesto = () => {
//         setDatos(prev => ({
//             ...prev,
//             Equipos: [...prev.Repuestos, repuestoItem]
//         }));

//         setRepuestoItem({
//             IdRepuesto: OpcionPorDefectoNumber.value,
//             Cantidad: 1,
//             IdUnidadMedida: OpcionPorDefectoNumber.value,
//             IdEstado: OpcionPorDefectoNumber.value,
//             Observacion: ""
//         });

//         setModalEquipoAbierto(false);
//     };

//     const eliminarRepuesto = (index: number) => {
//         setDatos(prev => ({
//             ...prev,
//             Equipos: prev.Repuestos.filter((_, i) => i !== index)
//         }));
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
//         const { name, value } = e.target;
//         setDatos(prev => ({ ...prev, [name]: value }));
//     };

//         const habilitarBotonAgregar = () => {
//         const EsEquipoValido =
//             repuestoItem.IdRepuesto > 0 &&
//             repuestoItem.Cantidad > 0 &&
//             repuestoItem.IdUnidadMedida > 0 &&
//             repuestoItem.IdEstado > 0;

//         setHabilitarDeshabilitarBotonAgregar(!EsEquipoValido);
//     };

//     const habilitarBotonGuardar = () => {
//         const EsEntradaValida =
//             datos.DocumentoResponsable !== 'SinSeleccionar' &&
//             datos.Repuestos.length >= 1;

//         setHabilitarDeshabilitarBotonGuardar(!EsEntradaValida);
//     };

//     const handleGuardarEntradaRepuesto = async () => {
//             try {
//                 const fechaEntradaFormateada = typeof datos.FechaEntrada === 'string'
//                     ? datos.FechaEntrada
//                     : datos.FechaEntrada.format('YYYY-MM-DD HH:mm:ss');

//                 const entradaEquipoCompleta = {
//                     ...datos,
//                     FechaEntrada: fechaEntradaFormateada
//                 };

//                 const response = await GuardarEntradaEquipos(entradaEquipoCompleta);
//                 console.log(response);

//                 setDatos({
//                     FechaEntrada: dayjs(),
//                     DocumentoResponsable: OpcionPorDefecto.value,
//                     Observaciones: '',
//                     NoEntradaRepuestos: null,
//                     Repuestos: [],
//                     UsuarioCreacion: documentoUsuarioActivo
//                 });

//                 setRepuestoItem({
//                     IdRepuesto: OpcionPorDefectoNumber.value,
//                     Cantidad: 1,
//                     IdUnidadMedida: OpcionPorDefectoNumber.value,
//                     IdEstado: OpcionPorDefectoNumber.value,
//                     Observacion: ""
//                 });

//                 sendMessage?.('usuario-actualizado', {});
//                 onMostrarMensaje?.('Entrada de equipos creada correctamente', 'success');
//                 // setModalAbierto(false);
//             } catch (error) {
//                 onMostrarMensaje?.(`Hubo un error al crear la entrada de los equipos. ${error}`, 'error');
//                 console.error(`Hubo un error al guardar la entrada. Detalles: ${error}`);
//             }
//         };

//     return (
//         <></>
//     )
// };




'use client';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
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
import { OpcionesSelectNumero, OpcionesSelectTexto } from '@/types/select_options';
import { ListarRepuestos } from '@/services/inventario/repuestos/ListarRepuestosService';
import { VisualizarEntradaRepuestos } from '@/services/inventario/repuestos/VisualizarEntradaRepuestosService';
import { ConsultarSiguienteNoEntradaRepuestos } from '@/services/inventario/repuestos/ConsultarSiguienteNoEntradaRepuestosService';
import { GuardarEntradaRepuestos } from '@/services/inventario/repuestos/GuardarEntradaRepuestosService';

// INTERFACES
interface Repuesto {
    IdRepuesto: number;
    Cantidad: number;
    IdUnidadMedida: number;
    IdEstado: number;
    Observacion: string;
}

interface EntradaRepuesto {
    FechaEntrada: Dayjs;
    DocumentoResponsable: string;
    Observaciones: string;
    NoEntradaRepuestos: number | null;
    Repuestos: Repuesto[];
    UsuarioCreacion: string | null | undefined;
}

interface EntradaRepuestoModal {
    FechaEntrada: Dayjs | string;
    DocumentoResponsable?: string;
    Observaciones: string;
    NoEntradaRepuestos: number | null;
    Repuestos?: Repuesto[];
    UsuarioCreacion?: string | null;
    Responsable?: string;
    CreadoPor?: string;
    FechaCreacion?: string;
}

// PROPS
interface ModalRegistrarVisualizarEntradaRepuestosProps {
    modo?: 'crear' | 'visualizar';
    noEntradaRepuestos?: number;
    onClose?: () => void;
    readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly sendMessage?: (event: string, payload: any) => void;
    readonly mensajesSocket?: any[];
}

export function ModalRegistrarVisualizarEntradaRepuestos({
    modo = 'crear',
    noEntradaRepuestos,
    onClose,
    onMostrarMensaje,
    sendMessage,
    mensajesSocket = []
}: Readonly<ModalRegistrarVisualizarEntradaRepuestosProps>): React.JSX.Element {
    // Hooks y contextos
    const isMobile = useMediaQuery('(max-width:600px)');
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const theme = useTheme();

    // Estados principales
    const [datos, setDatos] = React.useState<EntradaRepuesto>({
        FechaEntrada: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        NoEntradaRepuestos: null,
        Repuestos: [],
        UsuarioCreacion: documentoUsuarioActivo
    });

    const [repuestoItem, setRepuestoItem] = React.useState<Repuesto>({
        IdRepuesto: OpcionPorDefectoNumber.value,
        Cantidad: 1,
        IdUnidadMedida: OpcionPorDefectoNumber.value,
        IdEstado: OpcionPorDefectoNumber.value,
        Observacion: ""
    });

    const [modalRepuestoAbierto, setModalRepuestoAbierto] = React.useState(false);
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const [habilitarDeshabilitarBotonAgregar, setHabilitarDeshabilitarBotonAgregar] = React.useState(true);
    const [habilitarDeshabilitarBotonGuardar, setHabilitarDeshabilitarBotonGuardar] = React.useState(true);
    const [cargandoVisualizacion, setCargandoVisualizacion] = React.useState(false);

    // Estados para datos
    const [responsables, setResponsables] = React.useState<OpcionesSelectTexto[]>([]);
    const [repuestos, setRepuestos] = React.useState<OpcionesSelectNumero[]>([]);
    const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<OpcionesSelectNumero[]>([]);
    const [estados, setEstados] = React.useState<OpcionesSelectNumero[]>([]);

    // EFFECTS
    // Cargar datos cuando se abre en modo visualizar
    React.useEffect(() => {
        if (modo === 'visualizar' && noEntradaRepuestos) {
            cargarDatosEntrada(noEntradaRepuestos);
        }
    }, [modo, noEntradaRepuestos]);

    // Abrir modal automáticamente en modo visualizar
    React.useEffect(() => {
        if (modo === 'visualizar' && noEntradaRepuestos) {
            setModalAbierto(true);
        }
    }, [modo, noEntradaRepuestos]);

    // Resetear para modo crear
    React.useEffect(() => {
        if (modo === 'crear') {
            setDatos({
                FechaEntrada: dayjs(),
                DocumentoResponsable: OpcionPorDefecto.value,
                Observaciones: '',
                NoEntradaRepuestos: null,
                Repuestos: [],
                UsuarioCreacion: documentoUsuarioActivo
            });
            ConsultarSiguienteNoEntradaRepuesto();
        }
    }, [modo]);

    React.useEffect(() => {
        if (mensajesSocket.length > 0) {
            const UltimoMensaje = mensajesSocket[mensajesSocket.length - 1];
            if (UltimoMensaje.tipo === 'entrada-repuestos-creada') {
                ConsultarSiguienteNoEntradaRepuesto();
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

        const CargarRepuestos = async () => {
            try {
                const Repuestos = await ListarRepuestos();
                Repuestos.unshift(OpcionPorDefectoNumber);
                setRepuestos(Repuestos);
            } catch (error) {
                console.error(`Error al listar los repuestos: ${error}`);
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
        CargarRepuestos();
        CargarUnidadesDeMedida();
        CargarEstados();

        if (modo === 'crear') {
            ConsultarSiguienteNoEntradaRepuesto();
        }
    }, [modo]);

    // Validaciones
    React.useEffect(() => {
        habilitarBotonAgregar();
    }, [repuestoItem.IdRepuesto, repuestoItem.Cantidad, repuestoItem.IdUnidadMedida, repuestoItem.IdEstado]);

    React.useEffect(() => {
        habilitarBotonGuardar();
    }, [datos.DocumentoResponsable, datos.Repuestos]);

    // FUNCIONES
    const cargarDatosEntrada = async (noEntrada: number) => {
        try {
            setCargandoVisualizacion(true);
            const respuesta = await VisualizarEntradaRepuestos({ NoEntradaRepuestos: noEntrada });
            // Verificar si la respuesta es un array o un objeto directo
            const datosRespuesta = Array.isArray(respuesta) ? respuesta[0] : respuesta;

            if (!datosRespuesta) {
                throw new Error('No se encontraron datos para esta entrada');
            }

            const datosTransformados: EntradaRepuestoModal = {
                FechaEntrada: respuesta.FechaEntrada,
                DocumentoResponsable: respuesta.Responsable,
                Observaciones: respuesta.Observaciones || '',
                NoEntradaRepuestos: respuesta.NoEntradaRepuestos,
                Repuestos: (respuesta.Repuestos || []).map((repuesto: Repuesto) => ({
                    IdRepuesto: repuesto.IdRepuesto,
                    Cantidad: repuesto.Cantidad,
                    IdUnidadMedida: repuesto.IdUnidadMedida,
                    IdEstado: repuesto.IdEstado,
                    Observacion: repuesto.Observacion || ''
                })),
                UsuarioCreacion: respuesta.UsuarioCreacion || '',
                Responsable: respuesta.Responsable || '',
                CreadoPor: respuesta.CreadoPor || '',
                FechaCreacion: respuesta.FechaCreacion || ''
            };

            setDatos({
                FechaEntrada: dayjs(datosTransformados.FechaEntrada),
                DocumentoResponsable: datosTransformados.DocumentoResponsable || OpcionPorDefecto.value,
                Observaciones: datosTransformados.Observaciones,
                NoEntradaRepuestos: datosTransformados.NoEntradaRepuestos,
                Repuestos: datosTransformados.Repuestos || [],
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

    const agregarRepuesto = () => {
        setDatos(prev => ({
            ...prev,
            Repuestos: [...prev.Repuestos, repuestoItem]
        }));

        setRepuestoItem({
            IdRepuesto: OpcionPorDefectoNumber.value,
            Cantidad: 1,
            IdUnidadMedida: OpcionPorDefectoNumber.value,
            IdEstado: OpcionPorDefectoNumber.value,
            Observacion: ""
        });

        setModalRepuestoAbierto(false);
    };

    const eliminarRepuesto = (index: number) => {
        setDatos(prev => ({
            ...prev,
            Repuestos: prev.Repuestos.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const habilitarBotonAgregar = () => {
        const EsRepuestoValido =
            repuestoItem.IdRepuesto > 0 &&
            repuestoItem.Cantidad > 0 &&
            repuestoItem.IdUnidadMedida > 0 &&
            repuestoItem.IdEstado > 0;

        setHabilitarDeshabilitarBotonAgregar(!EsRepuestoValido);
    };

    const habilitarBotonGuardar = () => {
        const EsEntradaValida =
            datos.DocumentoResponsable !== 'SinSeleccionar' &&
            datos.Repuestos.length >= 1;

        setHabilitarDeshabilitarBotonGuardar(!EsEntradaValida);
    };

    const handleGuardarEntradaRepuesto = async () => {
        try {
            const fechaEntradaFormateada = typeof datos.FechaEntrada === 'string'
                ? datos.FechaEntrada
                : datos.FechaEntrada.format('YYYY-MM-DD HH:mm:ss');

            const entradaRepuestoCompleta = {
                ...datos,
                FechaEntrada: fechaEntradaFormateada
            };

            const response = await GuardarEntradaRepuestos(entradaRepuestoCompleta);
            console.log(response);

            setDatos({
                FechaEntrada: dayjs(),
                DocumentoResponsable: OpcionPorDefecto.value,
                Observaciones: '',
                NoEntradaRepuestos: null,
                Repuestos: [],
                UsuarioCreacion: documentoUsuarioActivo
            });

            setRepuestoItem({
                IdRepuesto: OpcionPorDefectoNumber.value,
                Cantidad: 1,
                IdUnidadMedida: OpcionPorDefectoNumber.value,
                IdEstado: OpcionPorDefectoNumber.value,
                Observacion: ""
            });

            sendMessage?.('entrada-repuestos-creada', {});
            onMostrarMensaje?.('Entrada de repuestos creada correctamente', 'success');
            ConsultarSiguienteNoEntradaRepuesto();
        } catch (error) {
            onMostrarMensaje?.(`Hubo un error al crear la entrada de repuestos. ${error}`, 'error');
            console.error(`Hubo un error al guardar la entrada. Detalles: ${error}`);
        }
    };

    const obtenerNombreRepuesto = (idRepuesto: number): string => {
        const repuesto = repuestos.find(r => r.value === idRepuesto);
        return repuesto ? repuesto.label : `Repuesto #${idRepuesto}`;
    };

    const obtenerNombreUnidadMedida = (idUnidad: number): string => {
        const unidad = unidadesDeMedida.find(u => u.value === idUnidad);
        return unidad ? unidad.label : `Unidad #${idUnidad}`;
    };

    const obtenerNombreEstado = (idEstado: number): string => {
        const estado = estados.find(e => e.value === idEstado);
        return estado ? estado.label : `Estado #${idEstado}`;
    };

    const ConsultarSiguienteNoEntradaRepuesto = async () => {
        try {
            const SiguienteNoEntradaR = await ConsultarSiguienteNoEntradaRepuestos();
            setDatos(prev => ({
                ...prev,
                NoEntradaRepuestos: Number(SiguienteNoEntradaR[0]?.SiguienteNoEntradaRepuestos)
            }));
        } catch (error) {
            console.error(`Error al consultar el siguiente no de entrada de repuestos: ${error}`);
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
                    + Nueva Entrada Repuestos
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
                                {modo === 'crear' ? 'Nueva entrada repuestos' : 'Detalles de entrada de repuestos'}
                            </Typography>

                            <Divider />

                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid md={2} xs={12}>
                                        <Input
                                            label='No Entrada'
                                            value={datos.NoEntradaRepuestos ?? ''}
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
                                        <Button variant='text' onClick={() => setModalRepuestoAbierto(true)}>
                                            + Agregar repuesto
                                        </Button>
                                    </Grid>
                                )}

                                <Grid container spacing={2}>
                                    {datos.Repuestos.length > 0 && (
                                        <Grid md={12} xs={12}>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2">
                                                    Repuestos {modo === 'crear' ? 'agregados' : 'de la entrada'}
                                                </Typography>
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
                                                                {modo === 'crear' && (
                                                                    <TableCell><strong>Acciones</strong></TableCell>
                                                                )}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {datos.Repuestos.map((rep, idx) => (
                                                                <TableRow key={idx} hover>
                                                                    <TableCell>{idx + 1} - {obtenerNombreRepuesto(rep.IdRepuesto)}</TableCell>
                                                                    <TableCell>{rep.Cantidad}</TableCell>
                                                                    <TableCell>{obtenerNombreUnidadMedida(rep.IdUnidadMedida)}</TableCell>
                                                                    <TableCell>{obtenerNombreEstado(rep.IdEstado)}</TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                maxWidth: '200px',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap'
                                                                            }}
                                                                            title={rep.Observacion}
                                                                        >
                                                                            {rep.Observacion}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    {modo === 'crear' && (
                                                                        <TableCell>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => eliminarRepuesto(idx)}
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
                                        onClick={handleGuardarEntradaRepuesto}
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
                <Modal open={modalRepuestoAbierto}
                    onClose={(_, reason) => {
                        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                            setModalRepuestoAbierto(false);
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
                        <Typography variant="subtitle1">Agregar repuesto</Typography>
                        <IconButton
                            onClick={() => setModalRepuestoAbierto(false)}
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
                                    value={repuestoItem.IdRepuesto}
                                    onChange={(e) => setRepuestoItem(prev => ({ ...prev, IdRepuesto: Number(e.target.value) }))}
                                    options={repuestos}
                                    size='small'
                                    valorname='Repuesto'
                                    required
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <Input
                                    label="Cantidad"
                                    value={repuestoItem.Cantidad}
                                    tipo_input="number"
                                    onChange={(e) => setRepuestoItem(prev => ({ ...prev, Cantidad: Number(e.target.value) }))}
                                    tamano='small'
                                    required
                                />
                            </Grid>

                            <Grid md={6} xs={12} mt={0.5}>
                                <InputSelect
                                    label="Unidad de medida"
                                    value={repuestoItem.IdUnidadMedida}
                                    options={unidadesDeMedida}
                                    size='small'
                                    onChange={(e) => setRepuestoItem(prev => ({ ...prev, IdUnidadMedida: Number(e.target.value) }))}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <InputSelect
                                    label="Estado"
                                    value={repuestoItem.IdEstado}
                                    options={estados}
                                    size='small'
                                    onChange={(e) => setRepuestoItem(prev => ({ ...prev, IdEstado: Number(e.target.value) }))}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} md={12}>
                                <Input
                                    label="Observación"
                                    value={repuestoItem.Observacion}
                                    tipo_input="textarea"
                                    onChange={(e) => setRepuestoItem(prev => ({ ...prev, Observacion: e.target.value }))}
                                    tamano='small'
                                />
                            </Grid>
                        </Grid>

                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button onClick={agregarRepuesto} variant="text" disabled={habilitarDeshabilitarBotonAgregar}>
                                Agregar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}
        </>
    );
}