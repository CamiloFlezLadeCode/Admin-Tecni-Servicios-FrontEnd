'use client';
import { FiltrarOpcionesActivas } from '@/utils/filtrarOpcionesActivas';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
import { Box, Button, CardActions, CardContent, SelectChangeEvent, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';

import type { OpcionesSelectNumero, OpcionesSelectTexto } from '@/types/select_options';

import { CamposAgregarItem, EncabezadoAgregarItems, MarcoModalMovimiento, TablaItemsMovimiento, type ColumnaItem } from './componentes-movimiento';
import { cargarCatalogo, itemVacio, manejadorCambioItem, useDiccionario, useUnidadPorElemento, type ItemMovimiento } from './utilidades-movimiento';

/** Lo que cambia entre la entrada de equipos y la de repuestos. */
export interface ConfigEntradaInventario {
    /** `equipos` / `repuestos`. */
    readonly plural: string;
    /** `Equipo` / `Repuesto`. */
    readonly singular: string;
    readonly campoNumero: string;
    readonly campoLista: string;
    readonly campoId: string;
    readonly campoSiguiente: string;
    readonly evento: string;
    readonly textoGuardar: string;
    readonly mensajeExito: string;
    /** Inicio del mensaje de error al guardar (se le añade el detalle). */
    readonly mensajeErrorGuardar: string;
    /** Sufijo del mensaje de consola cuando falla el siguiente número. */
    readonly mensajeErrorSiguiente: string;
    readonly servicios: {
        readonly siguiente: () => Promise<any>;
        readonly guardar: (body: any) => Promise<any>;
        readonly visualizar: (params: any) => Promise<any>;
        readonly listarElementos: () => Promise<any>;
        readonly consultarPorId: (id: number) => Promise<any>;
    };
    /** Opciones del select de elementos y su unidad de medida conocida. */
    readonly construirOpciones: (listado: any) => { opciones: OpcionesSelectNumero[]; unidades: Map<number, number> };
    /** Solo ofrecer los estados Nuevo/Usado. */
    readonly filtrarEstados: boolean;
    /** Del resultado de visualizar: si hay datos y de dónde leerlos. */
    readonly leerVisualizacion: (respuesta: any) => { existe: unknown; datos: any };
    /** Formato en que el backend envía la fecha (si no es ISO). */
    readonly formatoFecha?: string;
    /** Presentación propia de repuestos (filas separadas, campos obligatorios, tabla y pie). */
    readonly presentacionRepuestos?: boolean;
}

export interface ModalEntradaInventarioProps {
    modo?: 'crear' | 'visualizar';
    numero?: number;
    onClose?: () => void;
    readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly sendMessage?: (event: string, payload: any) => void;
    readonly mensajesSocket?: any[];
}

type DatosEntrada = Record<string, any> & {
    FechaEntrada: Dayjs;
    DocumentoResponsable: string;
    Observaciones: string;
    UsuarioCreacion: string | null | undefined;
};

export function ModalEntradaInventario({
    config,
    modo = 'crear',
    numero,
    onClose,
    onMostrarMensaje,
    sendMessage,
    mensajesSocket = []
}: Readonly<ModalEntradaInventarioProps & { config: ConfigEntradaInventario }>): React.JSX.Element {
    const { campoNumero, campoLista, campoId, servicios } = config;
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const datosIniciales = (): DatosEntrada => ({
        FechaEntrada: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        [campoNumero]: null,
        [campoLista]: [],
        UsuarioCreacion: documentoUsuarioActivo
    });

    const [datos, setDatos] = React.useState<DatosEntrada>(datosIniciales);
    const items = datos[campoLista] as ItemMovimiento[];
    const [item, setItem] = React.useState<ItemMovimiento>(() => itemVacio(campoId));

    const [modalAbierto, setModalAbierto] = React.useState(false);
    const [agregarDeshabilitado, setAgregarDeshabilitado] = React.useState(true);
    const [guardarDeshabilitado, setGuardarDeshabilitado] = React.useState(true);
    const [cargandoVisualizacion, setCargandoVisualizacion] = React.useState(false);

    const [responsables, setResponsables] = React.useState<OpcionesSelectTexto[]>([]);
    const [elementos, setElementos] = React.useState<OpcionesSelectNumero[]>([]);
    const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<OpcionesSelectNumero[]>([]);
    const [estados, setEstados] = React.useState<OpcionesSelectNumero[]>([]);
    const elementosDict = useDiccionario(elementos);
    const unidadesDict = useDiccionario(unidadesDeMedida);
    const estadosDict = useDiccionario(estados);
    const { setUnidadPorElemento, asignarUnidad } = useUnidadPorElemento(servicios.consultarPorId, setItem);

    const consultarSiguiente = async () => {
        try {
            const siguiente = await servicios.siguiente();
            setDatos(prev => ({ ...prev, [campoNumero]: Number(siguiente[0]?.[config.campoSiguiente]) }));
        } catch (error) {
            console.error(`Error al consultar el siguiente no de entrada de ${config.mensajeErrorSiguiente}: ${error}`);
        }
    };

    const cargarDatosEntrada = async (noEntrada: number) => {
        try {
            setCargandoVisualizacion(true);
            const { existe, datos: respuesta } = config.leerVisualizacion(await servicios.visualizar({ [campoNumero]: noEntrada }));
            if (!existe) {
                throw new Error('No se encontraron datos para esta entrada');
            }
            setDatos({
                FechaEntrada: config.formatoFecha ? dayjs(respuesta.FechaEntrada, config.formatoFecha) : dayjs(respuesta.FechaEntrada),
                DocumentoResponsable: respuesta.Responsable || OpcionPorDefecto.value,
                Observaciones: respuesta.Observaciones || '',
                [campoNumero]: respuesta[campoNumero],
                [campoLista]: (respuesta[campoLista] || []).map((d: ItemMovimiento) => ({
                    [campoId]: d[campoId],
                    Cantidad: d.Cantidad,
                    IdUnidadMedida: d.IdUnidadMedida,
                    IdEstado: d.IdEstado,
                    Observacion: d.Observacion || ''
                })),
                UsuarioCreacion: respuesta.UsuarioCreacion || ''
            });
        } catch (error) {
            console.error('Error al cargar datos de visualización:', error);
            onMostrarMensaje?.(`Error al cargar los detalles de la entrada: ${error}`, 'error');
        } finally {
            setCargandoVisualizacion(false);
        }
    };

    // Modo visualizar: cargar el movimiento y abrir el modal
    React.useEffect(() => {
        if (modo === 'visualizar' && numero) {
            void cargarDatosEntrada(numero);
            setModalAbierto(true);
        }
    }, [modo, numero]);

    // Modo crear: formulario limpio y siguiente número
    React.useEffect(() => {
        if (modo === 'crear') {
            setDatos(datosIniciales());
            void consultarSiguiente();
        }
    }, [modo]);

    React.useEffect(() => {
        if (mensajesSocket.length > 0 && mensajesSocket[mensajesSocket.length - 1].tipo === config.evento) {
            void consultarSiguiente();
        }
    }, [mensajesSocket]);

    // Catálogos
    React.useEffect(() => {
        const cargar = cargarCatalogo;
        void cargar('los responsables', ListarProfesionalesPertenecientes, (Responsables) => setResponsables([OpcionPorDefecto, ...Responsables]));
        void cargar(`los ${config.plural}`, servicios.listarElementos, (listado) => {
            const { opciones, unidades } = config.construirOpciones(listado);
            setElementos(opciones);
            setUnidadPorElemento(unidades);
        });
        void cargar('las unidades de medida', ListarUnidadesDeMedida, (Unidades) => setUnidadesDeMedida([OpcionPorDefectoNumber, ...Unidades]));
        void cargar('los estados', ListarEstados, (Estados) => setEstados(
            config.filtrarEstados
                ? [OpcionPorDefectoNumber, ...Estados.filter((e: any) => /nuevo|usado/i.test(e.label))]
                : [OpcionPorDefectoNumber, ...Estados]
        ));
        if (modo === 'crear') {
            void consultarSiguiente();
        }
    }, [modo]);

    // Validaciones
    React.useEffect(() => {
        const EsItemValido = Number(item[campoId]) > 0 && item.Cantidad > 0 && item.IdUnidadMedida > 0 && item.IdEstado > 0;
        setAgregarDeshabilitado(!EsItemValido);
    }, [item[campoId], item.Cantidad, item.IdUnidadMedida, item.IdEstado]);

    React.useEffect(() => {
        const EsEntradaValida = datos.DocumentoResponsable !== OpcionPorDefecto.value && items.length >= 1;
        setGuardarDeshabilitado(!EsEntradaValida);
    }, [datos.DocumentoResponsable, items]);

    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaEntrada: fecha || dayjs() }));
    };

    const agregarItem = () => {
        setDatos(prev => ({ ...prev, [campoLista]: [...prev[campoLista], item] }));
        setItem(itemVacio(campoId));
    };

    const eliminarItem = (index: number) => {
        setDatos(prev => ({ ...prev, [campoLista]: prev[campoLista].filter((_: unknown, i: number) => i !== index) }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = manejadorCambioItem(campoId, setItem);

    const handleGuardar = async () => {
        try {
            const response = await servicios.guardar({ ...datos, FechaEntrada: datos.FechaEntrada.format('YYYY-MM-DD HH:mm:ss') });
            console.log(response);
            setDatos(datosIniciales());
            setItem(itemVacio(campoId));
            sendMessage?.(config.evento, {});
            onMostrarMensaje?.(config.mensajeExito, 'success');
            void consultarSiguiente();
        } catch (error) {
            onMostrarMensaje?.(`${config.mensajeErrorGuardar} ${error}`, 'error');
            console.error(`Hubo un error al guardar la entrada. Detalles: ${error}`);
        }
    };

    const handleCerrarModal = () => {
        if (onClose) {
            onClose();
        } else {
            setModalAbierto(false);
        }
    };

    const repuestos = config.presentacionRepuestos ?? false;
    const visualizar = modo === 'visualizar';

    const campoNumeroEntrada = (
        <Grid md={3} xs={12}>
            <Input label='No Entrada' value={datos[campoNumero] ?? ''} onChange={handleChange} tamano='small' tipo_input='number' bloqueado />
        </Grid>
    );
    const campoFecha = (
        <Grid md={3} xs={12}>
            <FechayHora label="Fecha y hora" value={datos.FechaEntrada} onChange={handleFechaChange} disabled={visualizar} />
        </Grid>
    );
    const campoResponsable = (
        <Grid md={3} xs={12}>
            <InputSelect
                label="Responsable"
                value={datos.DocumentoResponsable}
                options={FiltrarOpcionesActivas(responsables, datos.DocumentoResponsable)}
                onChange={handleChange}
                valorname="DocumentoResponsable"
                required
                bloqueado={visualizar}
            />
        </Grid>
    );
    const campoObservaciones = (
        <Grid md={12} xs={12}>
            <Input label='Observaciones' value={datos.Observaciones} onChange={handleChange} tamano='small' tipo_input='textarea' valorname='Observaciones' bloqueado={visualizar} />
        </Grid>
    );
    const camposItem = (
        <CamposAgregarItem
            etiqueta={config.singular}
            campoId={campoId}
            valornameElemento={repuestos ? config.singular : campoId}
            item={item}
            opciones={elementos}
            estados={estados}
            unidad={repuestos ? nombreUnidad(Number(item.IdUnidadMedida)) : unidadesDict.get(item.IdUnidadMedida) ?? ''}
            onElegir={(id) => { setItem(prev => ({ ...prev, [campoId]: id })); void asignarUnidad(id); }}
            onCambio={handleItemChange}
            onAgregar={agregarItem}
            agregarDeshabilitado={agregarDeshabilitado}
            requeridos={repuestos}
        />
    );

    function nombreUnidad(idUnidad: number): string {
        if (!idUnidad || idUnidad === OpcionPorDefectoNumber.value) return '';
        return unidadesDict.get(idUnidad) ?? `Unidad #${idUnidad}`;
    }

    const columnas: ColumnaItem[] = repuestos
        ? [
            { encabezado: `# ${config.singular}`, celda: (d, idx) => `${idx + 1} - ${elementosDict.get(Number(d[campoId])) ?? `${config.singular} #${d[campoId]}`}` },
            { encabezado: 'Cantidad', celda: (d) => d.Cantidad },
            { encabezado: 'Unidad Medida', celda: (d) => nombreUnidad(d.IdUnidadMedida) },
            { encabezado: 'Estado', celda: (d) => estadosDict.get(d.IdEstado) ?? `Estado #${d.IdEstado}` },
            {
                encabezado: 'Observación',
                celda: (d) => (
                    <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.Observacion}>
                        {d.Observacion}
                    </Typography>
                ),
            },
        ]
        : [
            { encabezado: 'Id', celda: (d) => d[campoId] },
            { encabezado: config.singular, celda: (d) => elementosDict.get(Number(d[campoId])) ?? d[campoId] },
            { encabezado: 'Cantidad', celda: (d) => d.Cantidad },
            { encabezado: 'Unidad', celda: (d) => unidadesDict.get(d.IdUnidadMedida) ?? d.IdUnidadMedida },
            { encabezado: 'Estado', celda: (d) => estadosDict.get(d.IdEstado) ?? d.IdEstado },
            { encabezado: 'Observación', celda: (d) => d.Observacion },
        ];

    const tablaItems = items.length > 0 && (
        <Grid md={12} xs={12}>
            <TablaItemsMovimiento
                titulo={`${config.singular === 'Equipo' ? 'Equipos' : 'Repuestos'} ${modo === 'crear' ? 'agregados' : 'de la entrada'}`}
                items={items}
                columnas={columnas}
                onEliminar={modo === 'crear' ? eliminarItem : undefined}
                variante={repuestos ? 'repuestos' : 'equipos'}
                filasHover={repuestos}
            />
        </Grid>
    );

    const botonGuardar = (
        <Button variant='contained' color='primary' disabled={guardarDeshabilitado} onClick={handleGuardar}>
            {config.textoGuardar}
        </Button>
    );

    return (
        <MarcoModalMovimiento
            estilo='entrada'
            mostrarBotonNuevo={modo === 'crear'}
            textoBotonNuevo={`+ Nueva Entrada ${config.singular === 'Equipo' ? 'Equipos' : 'Repuestos'}`}
            abierto={modalAbierto}
            onAbrir={() => { setModalAbierto(true) }}
            onCerrar={handleCerrarModal}
            cargando={cargandoVisualizacion && visualizar}
            titulo={modo === 'crear' ? `Nueva entrada ${config.plural}` : `Detalles de entrada de ${config.plural}`}
        >
            {repuestos ? (
                <>
                    <CardContent>
                        <Grid container spacing={2}>
                            {campoNumeroEntrada}
                            {campoFecha}
                            {campoResponsable}
                        </Grid>
                        <Grid container spacing={2}>
                            {campoObservaciones}
                        </Grid>
                        {modo === 'crear' && (
                            <Grid container spacing={2}>
                                <EncabezadoAgregarItems texto={`Agregar ${config.plural}`} />
                                {camposItem}
                            </Grid>
                        )}
                        <Grid container spacing={2}>
                            {tablaItems}
                        </Grid>
                    </CardContent>
                    {modo === 'crear' && (
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            {botonGuardar}
                        </CardActions>
                    )}
                </>
            ) : (
                <CardContent>
                    <Grid container spacing={2}>
                        {campoNumeroEntrada}
                        {campoFecha}
                        {campoResponsable}
                        {campoObservaciones}
                    </Grid>

                    {modo === 'crear' && (
                        <>
                            <EncabezadoAgregarItems texto={`Agregar ${config.plural}`} />
                            <Grid container spacing={2}>
                                {camposItem}
                            </Grid>
                        </>
                    )}

                    {tablaItems && (
                        <Grid container spacing={2}>
                            {tablaItems}
                        </Grid>
                    )}

                    {modo === 'crear' && (
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <Box display='flex' justifyContent='flex-end' sx={{ mt: 2 }}>
                                    {botonGuardar}
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            )}
        </MarcoModalMovimiento>
    );
}
