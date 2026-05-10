'use client';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto } from '@/lib/constants/option-default';
import { ActualizarDevolucion } from '@/services/comercial/devoluciones/ActualizarDevolucionService';
import { ConsultarDevolucionPorId } from '@/services/comercial/devoluciones/ConsultarDevolucionPorIdService';
import { equipos_pendientes_por_devolver } from '@/services/comercial/devoluciones/EquiposPendientesPorDevolverService';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple, Plus, Trash, X } from '@phosphor-icons/react';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';

interface ItemDevolucion {
    IdDetalleDevolucion?: number;
    IdDetalleRemision?: number;
    ClaveAgrupacionPendiente?: string;
    IdEquipo: string;
    NombreEquipo: string;
    CantidadArrendada: number;
    CantidadDevuelta: number;
    EstadoEquipo: number;
    CantidadDevueltaOriginal?: number;
    Observaciones: string;
    IdRemision: string;
    NoRemision?: string;
    Descripcion?: string;
    Subarrendatario?: string;
    NombreSubarrendatario?: string;
    FuentesPendientes?: FuentePendiente[];
}

interface ItemPendienteDevolucion {
    IdDetalleRemision: number;
    IdRemision: string;
    NoRemision?: string;
    IdEquipo: string;
    NombreEquipo: string;
    CantidadArrendada: number;
    CantidadPendiente: number;
    Subarrendatario?: string;
    NombreSubarrendatario?: string;
    Descripcion?: string;
}

interface FuentePendiente {
    IdDetalleRemision: number;
    IdRemision: string;
    NoRemision?: string;
    CantidadPendiente: number;
}

interface ItemPendienteAgrupado {
    Clave: string;
    IdEquipo: string;
    NombreEquipo: string;
    Subarrendatario?: string;
    NombreSubarrendatario?: string;
    CantidadPendienteTotal: number;
    Fuentes: FuentePendiente[];
}

interface DevolucionDetalle {
    NoDevolucion: string;
    Cliente: string;
    DocumentoCliente?: string;
    Proyecto: string;
    IdProyecto?: number;
    Observaciones: string;
    PersonaQueRecibe: string;
    PersonaQueEntrega: string;
    FechaDevolucion: Dayjs;
    IncluyeTransporte: boolean | null;
    ValorTransporte: number;
    IdEstado?: number;
}

interface Option {
    value: string | number;
    label: string;
}

interface EditarDevolucionProps {
    IdDevolucion: number;
    NoDevolucion: string;
    sendMessage: (event: string, payload: any) => void;
    mostrarMensaje: (mensaje: string, tipo: 'success' | 'error' | 'warning') => void;
}

export function EditarDevolucion({ IdDevolucion, NoDevolucion, sendMessage, mostrarMensaje }: EditarDevolucionProps): React.JSX.Element {
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [guardando, setGuardando] = React.useState(false);
    const [datosGenerales, setDatosGenerales] = React.useState<DevolucionDetalle>({
        NoDevolucion: NoDevolucion,
        Cliente: '',
        Proyecto: '',
        Observaciones: '',
        PersonaQueRecibe: '',
        PersonaQueEntrega: '',
        FechaDevolucion: dayjs(),
        IncluyeTransporte: null,
        ValorTransporte: 0
    });
    const [items, setItems] = React.useState<ItemDevolucion[]>([]);
    const [itemsPendientes, setItemsPendientes] = React.useState<ItemPendienteAgrupado[]>([]);
    const [estados, setEstados] = React.useState<Option[]>([]);
    const [profesionales, setProfesionales] = React.useState<Option[]>([]);
    const [nuevoItem, setNuevoItem] = React.useState({
        ClavePendiente: '',
    });

    const construirClavePendiente = (item: { IdEquipo: string; Subarrendatario?: string }) =>
        `${item.IdEquipo}::${item.Subarrendatario || ''}`;

    const cargarItemsPendientes = async (
        documentoCliente: string,
        idProyecto: number,
        detallesActuales: ItemDevolucion[]
    ): Promise<ItemPendienteAgrupado[]> => {
        const pendientes = await equipos_pendientes_por_devolver({
            IdProyecto: idProyecto,
            DocumentoSubarrendatario: '',
            DocumentoCliente: documentoCliente
        });

        const idsYaAsociados = new Set(
            detallesActuales
                .map((detalle) => Number(detalle.IdDetalleRemision))
                .filter((id) => Number.isFinite(id) && id > 0)
        );

        const pendientesDisponibles: ItemPendienteDevolucion[] = (pendientes as any[])
            .map((item) => ({
                IdDetalleRemision: Number(item.IdDetalleRemision),
                IdRemision: String(item.IdRemision),
                NoRemision: item.NoRemision,
                IdEquipo: String(item.IdEquipo),
                NombreEquipo: item.NombreEquipo || '',
                CantidadArrendada: Number(item.CantidadArrendada || 0),
                CantidadPendiente: Number(item.CantidadPendiente || 0),
                Subarrendatario: item.Subarrendatario,
                NombreSubarrendatario: item.NombreSubarrendatario,
                Descripcion: item.Descripcion
            }))
            .filter((item) => item.CantidadPendiente > 0 && !idsYaAsociados.has(item.IdDetalleRemision));

        const mapaAgrupado = new Map<string, ItemPendienteAgrupado>();
        for (const item of pendientesDisponibles) {
            const clave = construirClavePendiente(item);
            const existente = mapaAgrupado.get(clave);
            if (!existente) {
                mapaAgrupado.set(clave, {
                    Clave: clave,
                    IdEquipo: item.IdEquipo,
                    NombreEquipo: item.NombreEquipo,
                    Subarrendatario: item.Subarrendatario,
                    NombreSubarrendatario: item.NombreSubarrendatario,
                    CantidadPendienteTotal: Number(item.CantidadPendiente || 0),
                    Fuentes: [
                        {
                            IdDetalleRemision: item.IdDetalleRemision,
                            IdRemision: item.IdRemision,
                            NoRemision: item.NoRemision,
                            CantidadPendiente: Number(item.CantidadPendiente || 0)
                        }
                    ]
                });
                continue;
            }

            existente.CantidadPendienteTotal += Number(item.CantidadPendiente || 0);
            existente.Fuentes.push({
                IdDetalleRemision: item.IdDetalleRemision,
                IdRemision: item.IdRemision,
                NoRemision: item.NoRemision,
                CantidadPendiente: Number(item.CantidadPendiente || 0)
            });
        }

        return Array.from(mapaAgrupado.values());
    };

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        try {
            const [detalleDevolucion, estadosRes, profesionalesRes] = await Promise.all([
                ConsultarDevolucionPorId(IdDevolucion),
                ListarEstados(),
                ListarProfesionalesPertenecientes()
            ]);

            const devolucion = Array.isArray(detalleDevolucion) ? detalleDevolucion[0] : detalleDevolucion;

            const detalles = devolucion?.Detalles || devolucion?.DetallesDevolucion || [];

            const mappedItems: ItemDevolucion[] = (detalles as any[]).map((item) => ({
                IdDetalleDevolucion: item.IdDetalleDevolucion || item.IdDetalleRemision,
                IdDetalleRemision: item.IdDetalleRemision,
                IdEquipo: String(item.IdEquipo ?? ''),
                NombreEquipo: item.NombreEquipo || item.Equipo || '',
                CantidadArrendada: Number(item.CantidadArrendada ?? item.Cantidad ?? 0),
                CantidadDevuelta: Number(item.CantidadADevolver ?? item.CantidadDevuelta ?? 0),
                CantidadDevueltaOriginal: Number(item.CantidadADevolver ?? item.CantidadDevuelta ?? 0),
                EstadoEquipo: typeof item.EstadoEquipo === 'number' ? item.EstadoEquipo : -1,
                Observaciones: item.Observaciones || '',
                IdRemision: String(item.IdRemision ?? ''),
                NoRemision: item.NoRemision,
                Descripcion: item.Descripcion,
                Subarrendatario: item.Subarrendatario || item.DocumentoSubarrendatario,
                NombreSubarrendatario: item.NombreSubarrendatario,
            }));

            const estadosPermitidos = new Set(['buen estado', 'dañado', 'perdido']);
            const estadosFiltrados = (estadosRes as Option[]).filter((estado) =>
                estadosPermitidos.has(String(estado.label).toLowerCase().trim())
            );
            estadosFiltrados.unshift({ value: -1, label: 'Sin seleccionar' });

            setEstados(estadosFiltrados);

            const profesionalesConDefault = [...(profesionalesRes as Option[])];
            profesionalesConDefault.unshift(OpcionPorDefecto);
            setProfesionales(profesionalesConDefault);

            const incluyeTransporteBack = devolucion.IncluyeTransporte;
            let incluyeTransporte: boolean | null = null;
            if (incluyeTransporteBack === 1 || incluyeTransporteBack === true) {
                incluyeTransporte = true;
            } else if (incluyeTransporteBack === 0 || incluyeTransporteBack === false) {
                incluyeTransporte = false;
            }

            setDatosGenerales({
                NoDevolucion: devolucion.NoDevolucion || NoDevolucion,
                Cliente: devolucion.Cliente || '',
                DocumentoCliente: devolucion.DocumentoCliente,
                Proyecto: devolucion.Proyecto || '',
                IdProyecto: devolucion.IdProyecto,
                Observaciones: devolucion.Observaciones || '',
                PersonaQueRecibe: devolucion.PersonaQueRecibe || '',
                PersonaQueEntrega: devolucion.PersonaQueEntrega || '',
                FechaDevolucion: dayjs(devolucion.FechaDevolucion, 'DD/MM/YYYY hh:mm A'),
                IncluyeTransporte: incluyeTransporte,
                ValorTransporte: Number(devolucion.ValorTransporte ?? 0),
                IdEstado: devolucion.IdEstado
            });
            if (devolucion.DocumentoCliente && devolucion.IdProyecto) {
                const pendientesAgrupados = await cargarItemsPendientes(devolucion.DocumentoCliente, devolucion.IdProyecto, mappedItems);
                const itemsConsolidados = mappedItems.map((item) => {
                    const clave = construirClavePendiente({
                        IdEquipo: item.IdEquipo,
                        Subarrendatario: item.Subarrendatario
                    });
                    const pendiente = pendientesAgrupados.find((pendienteItem) => pendienteItem.Clave === clave);
                    if (!pendiente) return item;
                    return {
                        ...item,
                        ClaveAgrupacionPendiente: clave,
                        CantidadArrendada: Number(item.CantidadArrendada || 0) + Number(pendiente.CantidadPendienteTotal || 0),
                        FuentesPendientes: pendiente.Fuentes
                    };
                });

                const clavesItemsEnTabla = new Set(
                    itemsConsolidados.map((item) => construirClavePendiente({ IdEquipo: item.IdEquipo, Subarrendatario: item.Subarrendatario }))
                );

                setItems(itemsConsolidados);
                setItemsPendientes(
                    pendientesAgrupados.filter((pendiente) => !clavesItemsEnTabla.has(pendiente.Clave))
                );
            } else {
                setItems(mappedItems);
                setItemsPendientes([]);
            }
        } catch (error) {
            mostrarMensaje(`Error al cargar la devolución: ${error}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading || guardando) return;
        setOpen(false);
        setDatosGenerales({
            NoDevolucion: NoDevolucion,
            Cliente: '',
            Proyecto: '',
            Observaciones: '',
            PersonaQueRecibe: '',
            PersonaQueEntrega: '',
            FechaDevolucion: dayjs(),
            IncluyeTransporte: null,
            ValorTransporte: 0
        });
        setItems([]);
        setItemsPendientes([]);
        setEstados([]);
        setNuevoItem({
            ClavePendiente: '',
        });
    };

    const handleChangeGenerales = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let { name, value } = e.target;
        if (name === 'PersonaQueEntrega') {
            value = value.toUpperCase();
        }

        setDatosGenerales((prev) => ({
            ...prev,
            [name]: name === 'ValorTransporte' ? Number(value) : value
        }));
    };

    const handleChangeIncluyeTransporte = (e: SelectChangeEvent<string>) => {
        const { value } = e.target;
        let incluye: boolean | null = null;
        if (value === 'SI') incluye = true;
        if (value === 'NO') incluye = false;
        setDatosGenerales((prev) => ({
            ...prev,
            IncluyeTransporte: incluye,
            ValorTransporte: incluye ? prev.ValorTransporte : 0
        }));
    };

    const handleChangePersonaQueRecibe = (e: SelectChangeEvent<string>) => {
        const { value } = e.target;
        setDatosGenerales((prev) => ({
            ...prev,
            PersonaQueRecibe: value
        }));
    };

    const handleChangeEstadoItem = (index: number, nuevoEstado: number) => {
        setItems((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        EstadoEquipo: nuevoEstado
                    }
                    : item
            )
        );
    };

    const handleChangeCantidadDevuelta = (index: number, nuevaCantidadTexto: string) => {
        let nuevaCantidad = Number.parseInt(nuevaCantidadTexto, 10);
        if (Number.isNaN(nuevaCantidad)) {
            nuevaCantidad = 0;
        }

        setItems((prev) =>
            prev.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                const cantidadMaxima = Number(item.CantidadArrendada ?? 0);
                const cantidadFinal = Math.min(Math.max(nuevaCantidad, 0), cantidadMaxima);

                return {
                    ...item,
                    CantidadDevuelta: cantidadFinal
                };
            })
        );
    };

    const handleChangeNuevoItem = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNuevoItem((prev) => ({ ...prev, [name]: String(value) }));
    };

    const agregarNuevoItem = () => {
        const clavePendiente = nuevoItem.ClavePendiente;
        if (!clavePendiente) {
            mostrarMensaje('Seleccione un equipo pendiente para agregar', 'error');
            return;
        }

        const pendienteSeleccionado = itemsPendientes.find(
            (item) => item.Clave === clavePendiente
        );

        if (!pendienteSeleccionado) {
            mostrarMensaje('No se encontró el equipo seleccionado', 'error');
            return;
        }

        const nuevoDetalle: ItemDevolucion = {
            ClaveAgrupacionPendiente: pendienteSeleccionado.Clave,
            IdEquipo: pendienteSeleccionado.IdEquipo,
            NombreEquipo: pendienteSeleccionado.NombreEquipo,
            CantidadArrendada: Number(pendienteSeleccionado.CantidadPendienteTotal),
            CantidadDevuelta: 1,
            CantidadDevueltaOriginal: 0,
            EstadoEquipo: -1,
            Observaciones: '',
            IdRemision: '',
            NoRemision: pendienteSeleccionado.Fuentes.map((fuente) => fuente.NoRemision).filter(Boolean).join(', '),
            Descripcion: 'Equipo agregado desde pendientes',
            Subarrendatario: pendienteSeleccionado.Subarrendatario,
            NombreSubarrendatario: pendienteSeleccionado.NombreSubarrendatario,
            FuentesPendientes: pendienteSeleccionado.Fuentes
        };

        setItems((prev) => [...prev, nuevoDetalle]);
        setItemsPendientes((prev) =>
            prev.filter((item) => item.Clave !== pendienteSeleccionado.Clave)
        );
        setNuevoItem({
            ClavePendiente: '',
        });
    };

    const handleGuardar = async () => {
        if (!IdDevolucion) {
            mostrarMensaje('No se encontró la devolución a actualizar', 'error');
            return;
        }

        if (datosGenerales.IncluyeTransporte === null) {
            mostrarMensaje('Debe indicar si incluye transporte', 'error');
            return;
        }

        if (datosGenerales.IncluyeTransporte === true) {
            const recibeInvalido =
                !datosGenerales.PersonaQueRecibe || datosGenerales.PersonaQueRecibe === OpcionPorDefecto.value;

            if (recibeInvalido) {
                mostrarMensaje(
                    'Debe especificar quién recibe los equipos cuando se incluye transporte',
                    'error'
                );
                return;
            }

            if (!datosGenerales.ValorTransporte || datosGenerales.ValorTransporte <= 0) {
                mostrarMensaje('El valor del transporte debe ser mayor a 0', 'error');
                return;
            }
        }

        const itemsConCantidadInvalida = items.some(
            (item) => !item.CantidadDevuelta || item.CantidadDevuelta <= 0
        );

        if (itemsConCantidadInvalida) {
            mostrarMensaje('La cantidad devuelta debe ser mayor a 0 en todos los ítems', 'error');
            return;
        }

        setGuardando(true);
        try {
            const detallesParaEnviar = items.flatMap((item) => {
                const fuentes = Array.isArray(item.FuentesPendientes) ? item.FuentesPendientes : [];
                const cantidadObjetivo = Number(item.CantidadDevuelta || 0);

                if (item.IdDetalleDevolucion && fuentes.length === 0) {
                    return [{
                        IdDetalleDevolucion: item.IdDetalleDevolucion,
                        IdDetalleRemision: item.IdDetalleRemision,
                        IdEquipo: item.IdEquipo,
                        IdRemision: item.IdRemision,
                        CantidadDevuelta: cantidadObjetivo,
                        EstadoEquipo: item.EstadoEquipo,
                        Observaciones: item.Observaciones,
                        DocumentoSubarrendatario: item.Subarrendatario
                    }];
                }

                const detallesNuevos: any[] = [];
                let restante = cantidadObjetivo;

                if (item.IdDetalleDevolucion) {
                    const cantidadBaseOriginal = Number(item.CantidadDevueltaOriginal || 0);
                    const cantidadParaDetalleExistente = Math.min(restante, cantidadBaseOriginal);
                    detallesNuevos.push({
                        IdDetalleDevolucion: item.IdDetalleDevolucion,
                        IdDetalleRemision: item.IdDetalleRemision,
                        IdEquipo: item.IdEquipo,
                        IdRemision: item.IdRemision,
                        CantidadDevuelta: cantidadParaDetalleExistente,
                        EstadoEquipo: item.EstadoEquipo,
                        Observaciones: item.Observaciones,
                        DocumentoSubarrendatario: item.Subarrendatario
                    });
                    restante -= cantidadParaDetalleExistente;
                }

                for (const fuente of fuentes) {
                    if (restante <= 0) break;
                    const disponibleFuente = Number(fuente.CantidadPendiente || 0);
                    if (disponibleFuente <= 0) continue;
                    const cantidadAsignada = Math.min(restante, disponibleFuente);
                    detallesNuevos.push({
                        IdDetalleRemision: fuente.IdDetalleRemision,
                        IdEquipo: item.IdEquipo,
                        IdRemision: fuente.IdRemision,
                        CantidadDevuelta: cantidadAsignada,
                        EstadoEquipo: item.EstadoEquipo,
                        Observaciones: item.Observaciones,
                        DocumentoSubarrendatario: item.Subarrendatario
                    });
                    restante -= cantidadAsignada;
                }

                if (restante > 0) {
                    throw new Error(`La cantidad para ${item.NombreEquipo} supera la disponibilidad agrupada`);
                }

                return detallesNuevos;
            });

            const payload = {
                IdDevolucion,
                Observaciones: datosGenerales.Observaciones,
                PersonaQueRecibe: datosGenerales.PersonaQueRecibe,
                PersonaQueEntrega: datosGenerales.PersonaQueEntrega,
                IncluyeTransporte: datosGenerales.IncluyeTransporte,
                ValorTransporte: datosGenerales.ValorTransporte,
                FechaDevolucion: dayjs(datosGenerales.FechaDevolucion).format('YYYY/MM/DD HH:mm:ss'),
                Detalles: detallesParaEnviar,
                UsuarioQueActualiza: documentoUsuarioActivo
            };

            const response = await ActualizarDevolucion(payload);
            if (response.status === 200) {
                mostrarMensaje('Devolución actualizada con éxito', 'success');
                sendMessage('devolucion-actualizada', {
                    id: IdDevolucion,
                    numero: datosGenerales.NoDevolucion,
                    timestamp: new Date().toISOString()
                });
                setTimeout(() => {
                    handleClose();
                }, 1200);
            } else if (response.status === 201) {
                mostrarMensaje('La devolución fue eliminado por no contener items', 'success');
                sendMessage('devolucion-eliminada', {
                    id: IdDevolucion,
                    numero: datosGenerales.NoDevolucion,
                    timestamp: new Date().toISOString()
                });
                setTimeout(() => {
                    handleClose();
                }, 1200);
            } else if (response.status === 204) {
                mostrarMensaje('No se realizó ningún cambio', 'warning');
            }
        } catch (error) {
            mostrarMensaje(`Error al actualizar la devolución: ${error}`, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const opcionesTransporte: Option[] = [
        { value: 'SinSeleccionar', label: 'Sin seleccionar' },
        { value: 'SI', label: 'SI' },
        { value: 'NO', label: 'NO' }
    ];

    const valorTransporteSelect =
        datosGenerales.IncluyeTransporte === null
            ? 'SinSeleccionar'
            : datosGenerales.IncluyeTransporte
                ? 'SI'
                : 'NO';

    const opcionesItemsPendientes: Option[] = [
        { value: '', label: 'Seleccione equipo pendiente' },
        ...itemsPendientes.map((item) => ({
            value: item.Clave,
            label: `${item.NombreEquipo} | Subarren: ${item.NombreSubarrendatario || item.Subarrendatario || 'N/A'} | Pendiente: ${item.CantidadPendienteTotal}`
        }))
    ];

    const itemPendienteSeleccionado = itemsPendientes.find(
        (item) => item.Clave === nuevoItem.ClavePendiente
    );

    const eliminarItem = (index: number) => {
        setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    }

    const handleChangeFecha = (fecha: Dayjs | null) => {
        setDatosGenerales(prev => ({ ...prev, FechaDevolucion: fecha || dayjs() }))
    }
    return (
        <>
            <Tooltip title="Editar devolución">
                <IconButton size="small" color="primary" onClick={handleOpen}>
                    <PencilSimple size={20} weight="bold" />
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose();
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 1200,
                        maxHeight: '95vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box px={4} pt={4}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5">
                                Editar devolución: {datosGenerales.NoDevolucion}
                            </Typography>
                            <IconButton onClick={handleClose} disabled={loading || guardando}>
                                <X size={24} />
                            </IconButton>
                        </Box>
                        <Divider />
                    </Box>
                    <Box
                        sx={{
                            px: 4,
                            pb: 4,
                            overflowY: 'auto',
                            flex: 1
                        }}
                        mt={2}
                    >
                        <Card variant="outlined">
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid xs={12} md={4}>
                                        <Input
                                            label="Cliente"
                                            value={datosGenerales.Cliente}
                                            onChange={handleChangeGenerales}
                                            valorname="Cliente"
                                            tipo_input="text"
                                            tamano="small"
                                            bloqueado
                                        />
                                    </Grid>
                                    <Grid xs={12} md={4}>
                                        <Input
                                            label="Proyecto"
                                            value={datosGenerales.Proyecto}
                                            onChange={handleChangeGenerales}
                                            valorname="Proyecto"
                                            tipo_input="text"
                                            tamano="small"
                                            bloqueado
                                        />
                                    </Grid>
                                    <Grid xs={12} md={4}>
                                        <FechayHora
                                            label="Fecha devolución"
                                            value={datosGenerales.FechaDevolucion}
                                            onChange={handleChangeFecha}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <InputSelect
                                            label="Persona que recibe"
                                            value={datosGenerales.PersonaQueRecibe}
                                            options={profesionales}
                                            onChange={handleChangePersonaQueRecibe}
                                            valorname="PersonaQueRecibe"
                                            required={datosGenerales.IncluyeTransporte === true}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <Input
                                            label="Persona que entrega"
                                            value={datosGenerales.PersonaQueEntrega}
                                            onChange={handleChangeGenerales}
                                            valorname="PersonaQueEntrega"
                                            tipo_input="text"
                                            tamano="small"
                                        />
                                    </Grid>
                                    <Grid xs={12} md={4}>
                                        <InputSelect
                                            label="¿Incluye transporte?"
                                            value={valorTransporteSelect}
                                            options={opcionesTransporte}
                                            onChange={handleChangeIncluyeTransporte}
                                            valorname="IncluyeTransporte"
                                        />
                                    </Grid>
                                    {datosGenerales.IncluyeTransporte === true && (
                                        <Grid xs={12} md={4}>
                                            <Input
                                                label="Valor transporte"
                                                value={datosGenerales.ValorTransporte}
                                                onChange={handleChangeGenerales}
                                                valorname="ValorTransporte"
                                                tipo_input="number"
                                                tamano="small"
                                                required
                                            />
                                        </Grid>
                                    )}
                                    <Grid xs={12}>
                                        <Input
                                            label="Observaciones"
                                            value={datosGenerales.Observaciones}
                                            onChange={handleChangeGenerales}
                                            valorname="Observaciones"
                                            tipo_input="textarea"
                                            tamano="small"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa' }}>
                            <Typography variant="subtitle1" mb={2}>
                                Agregar ítem/equipo a la devolución
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid xs={12} md={10}>
                                    <InputSelect
                                        label="Equipo pendiente"
                                        value={nuevoItem.ClavePendiente}
                                        options={opcionesItemsPendientes}
                                        onChange={handleChangeNuevoItem}
                                        valorname="ClavePendiente"
                                    />
                                </Grid>
                                <Grid xs={12} md={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<Plus size={16} />}
                                        onClick={agregarNuevoItem}
                                        disabled={itemsPendientes.length === 0}
                                    >
                                        Agregar
                                    </Button>
                                </Grid>
                                <Grid xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        {itemPendienteSeleccionado
                                            ? `Pendiente total agrupado: ${itemPendienteSeleccionado.CantidadPendienteTotal}`
                                            : itemsPendientes.length === 0
                                                ? 'No hay equipos pendientes disponibles para agregar.'
                                                : 'Seleccione un equipo para agregarlo y ajustar cantidad/estado en la tabla inferior.'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>

                        <Box mt={3}>
                            <Typography variant="h6" mb={1}>
                                Detalle de equipos devueltos
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Equipo</TableCell>
                                            <TableCell>Remisión</TableCell>
                                            <TableCell align="right">Cant. arrendada</TableCell>
                                            <TableCell align="right">Cant. devuelta</TableCell>
                                            <TableCell>Estado equipo</TableCell>
                                            {/* <TableCell>Observaciones</TableCell> */}
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={`${item.IdDetalleDevolucion ?? 'nuevo'}-${item.IdDetalleRemision ?? index}-${index}`}>
                                                {/* <TableCell>{item.NombreEquipo}<br></br>
                                                    <label>Subarren: </label><span>{item.NombreSubarrendatario}</span>
                                                </TableCell> */}
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {item.NombreEquipo}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <Typography component="span" variant="caption">
                                                            Subarren:{' '}{item.NombreSubarrendatario}
                                                        </Typography>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{item.NoRemision || item.IdRemision}</TableCell>
                                                <TableCell align="right">{item.CantidadArrendada}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ maxWidth: 80, ml: 'auto' }}>
                                                        <Input
                                                            label=""
                                                            value={item.CantidadDevuelta}
                                                            onChange={(e) =>
                                                                handleChangeCantidadDevuelta(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            valorname="CantidadDevuelta"
                                                            tipo_input="number"
                                                            tamano="small"
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <InputSelect
                                                        label=""
                                                        value={item.EstadoEquipo}
                                                        options={estados}
                                                        onChange={(e) => handleChangeEstadoItem(index, Number(e.target.value))}
                                                        valorname="EstadoEquipo"
                                                    />
                                                </TableCell>
                                                {/* <TableCell>
                                                    <Input
                                                        label=""
                                                        value={item.Observaciones}
                                                        onChange={(e) => handleChangeObservacionesItem(item.IdDetalleDevolucion, e.target.value)}
                                                        valorname="Observaciones"
                                                        tipo_input="text"
                                                        tamano="small"
                                                    />
                                                </TableCell> */}
                                                <TableCell align="center">
                                                    <IconButton color="error" onClick={() => eliminarItem(index)}>
                                                        <Trash size={18} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {items.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    No se encontraron items para esta devolución
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <CardActions sx={{ justifyContent: 'flex-end', mt: 4, px: 0 }}>
                            <Button variant="outlined" onClick={handleClose} disabled={loading || guardando}>
                                Cancelar
                            </Button>
                            <Button variant="contained" onClick={handleGuardar} disabled={loading || guardando}>
                                Guardar cambios
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Modal>
            <MensajeDeCarga MostrarMensaje={guardando} Mensaje="Procesando..." />
        </>
    );
}
