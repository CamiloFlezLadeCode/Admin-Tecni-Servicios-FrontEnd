'use client';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto } from '@/lib/constants/option-default';
import { ActualizarDevolucion } from '@/services/comercial/devoluciones/ActualizarDevolucionService';
import { ConsultarDevolucionPorId } from '@/services/comercial/devoluciones/ConsultarDevolucionPorIdService';
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
import { PencilSimple, Trash, X } from '@phosphor-icons/react';
import * as React from 'react';

interface ItemDevolucion {
    IdDetalleDevolucion?: number;
    IdEquipo: string;
    NombreEquipo: string;
    CantidadArrendada: number;
    CantidadDevuelta: number;
    EstadoEquipo: number;
    Observaciones: string;
    IdRemision: string;
    NoRemision?: string;
    Descripcion?: string;
    Subarrendatario?: string;
    NombreSubarrendatario?: string;
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
    FechaDevolucion: string;
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
    mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
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
        FechaDevolucion: '',
        IncluyeTransporte: null,
        ValorTransporte: 0
    });
    const [items, setItems] = React.useState<ItemDevolucion[]>([]);
    const [estados, setEstados] = React.useState<Option[]>([]);
    const [profesionales, setProfesionales] = React.useState<Option[]>([]);

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
                IdEquipo: String(item.IdEquipo ?? ''),
                NombreEquipo: item.NombreEquipo || item.Equipo || '',
                CantidadArrendada: Number(item.CantidadArrendada ?? item.Cantidad ?? 0),
                CantidadDevuelta: Number(item.CantidadADevolver ?? item.CantidadDevuelta ?? 0),
                EstadoEquipo: typeof item.EstadoEquipo === 'number' ? item.EstadoEquipo : -1,
                Observaciones: item.Observaciones || '',
                IdRemision: String(item.IdRemision ?? ''),
                NoRemision: item.NoRemision,
                Descripcion: item.Descripcion,
                Subarrendatario: item.Subarrendatario || item.DocumentoSubarrendatario,
                NombreSubarrendatario: item.NombreSubarrendatario
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
                FechaDevolucion: devolucion.FechaDevolucion || devolucion.FechaCreacion || '',
                IncluyeTransporte: incluyeTransporte,
                ValorTransporte: Number(devolucion.ValorTransporte ?? 0),
                IdEstado: devolucion.IdEstado
            });
            setItems(mappedItems);
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
            FechaDevolucion: '',
            IncluyeTransporte: null,
            ValorTransporte: 0
        });
        setItems([]);
        setEstados([]);
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

    const handleChangeEstadoItem = (idDetalle: number | undefined, nuevoEstado: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.IdDetalleDevolucion === idDetalle
                    ? {
                        ...item,
                        EstadoEquipo: nuevoEstado
                    }
                    : item
            )
        );
    };

    const handleChangeCantidadDevuelta = (idDetalle: number | undefined, nuevaCantidadTexto: string) => {
        let nuevaCantidad = Number.parseInt(nuevaCantidadTexto, 10);
        if (Number.isNaN(nuevaCantidad)) {
            nuevaCantidad = 0;
        }

        setItems((prev) =>
            prev.map((item) => {
                if (item.IdDetalleDevolucion !== idDetalle) {
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

    const handleChangeObservacionesItem = (idDetalle: number | undefined, nuevasObservaciones: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.IdDetalleDevolucion === idDetalle
                    ? {
                        ...item,
                        Observaciones: nuevasObservaciones
                    }
                    : item
            )
        );
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
            const payload = {
                IdDevolucion,
                Observaciones: datosGenerales.Observaciones,
                PersonaQueRecibe: datosGenerales.PersonaQueRecibe,
                PersonaQueEntrega: datosGenerales.PersonaQueEntrega,
                IncluyeTransporte: datosGenerales.IncluyeTransporte,
                ValorTransporte: datosGenerales.ValorTransporte,
                Detalles: items.map((item) => ({
                    IdDetalleDevolucion: item.IdDetalleDevolucion,
                    CantidadDevuelta: item.CantidadDevuelta,
                    EstadoEquipo: item.EstadoEquipo,
                    Observaciones: item.Observaciones
                })),
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

    const eliminarItem = (index: number) => {
        const itemAEliminar = items[index];
        if (itemAEliminar.IdDetalleDevolucion) {
            setItems(items.filter((item) => item.IdDetalleDevolucion !== itemAEliminar.IdDetalleDevolucion));
        }
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
                                        <Input
                                            label="Fecha devolución"
                                            value={datosGenerales.FechaDevolucion}
                                            onChange={handleChangeGenerales}
                                            valorname="FechaDevolucion"
                                            tipo_input="text"
                                            tamano="small"
                                            bloqueado
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
                                            <TableCell>Observaciones</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={item.IdDetalleDevolucion}>
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
                                                                    item.IdDetalleDevolucion,
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
                                                        onChange={(e) => handleChangeEstadoItem(item.IdDetalleDevolucion, Number(e.target.value))}
                                                        valorname="EstadoEquipo"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        label=""
                                                        value={item.Observaciones}
                                                        onChange={(e) => handleChangeObservacionesItem(item.IdDetalleDevolucion, e.target.value)}
                                                        valorname="Observaciones"
                                                        tipo_input="text"
                                                        tamano="small"
                                                    />
                                                </TableCell>
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
