'use client';
import { FiltrarOpcionesActivas } from '@/utils/filtrarOpcionesActivas';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import Select from '@/components/dashboard/componentes_generales/formulario/Select';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { Box, Button, CardActions, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';

import type { OpcionesSelectNumero, OpcionesSelectTexto } from '@/types/select_options';

import { CamposAgregarItem, EncabezadoAgregarItems, MarcoModalMovimiento, TablaItemsMovimiento } from './componentes-movimiento';
import {
  cargarCatalogo,
  itemVacio,
  manejadorCambioItem,
  opcionesDeElementos,
  useDiccionario,
  useUnidadPorElemento,
  type ItemMovimiento,
} from './utilidades-movimiento';

/** Lo que cambia entre la salida de equipos y la de repuestos. */
export interface ConfigSalidaInventario {
  /** `equipos` / `repuestos` (títulos y textos). */
  readonly plural: string;
  /** `Equipo` / `Repuesto`. */
  readonly singular: string;
  readonly campoNumero: string;
  readonly campoLista: string;
  readonly campoId: string;
  /** Nombre alterno del id en el detalle que devuelve el backend (`EquipoId`). */
  readonly campoIdAlterno: string;
  readonly campoCodigo: string;
  readonly campoNombre: string;
  /** Campo con el siguiente número en la respuesta del backend. */
  readonly campoSiguiente: string;
  readonly evento: string;
  readonly textoGuardar: string;
  readonly servicios: {
    readonly siguiente: () => Promise<any>;
    readonly guardar: (body: any) => Promise<any>;
    readonly visualizar: (params: any) => Promise<any>;
    readonly listarElementos: () => Promise<any>;
    readonly listarTipos: () => Promise<any>;
    readonly consultarPorId: (id: number) => Promise<any>;
  };
  /** Lee la fecha del movimiento tal como la envía el backend. */
  readonly leerFecha: (resp: any) => Dayjs;
  /** Presentación propia de repuestos: nombre `-` si no se conoce, ícono X y botón en el pie. */
  readonly presentacionRepuestos?: boolean;
}

export interface ModalSalidaInventarioProps {
  modo?: 'crear' | 'visualizar';
  numero?: number;
  onClose?: () => void;
  readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
  readonly sendMessage?: (event: string, payload: any) => void;
  readonly mensajesSocket?: any[];
}

type DatosSalida = Record<string, any> & {
  FechaSalida: Dayjs;
  DocumentoResponsable: string;
  Observaciones: string;
  UsuarioCreacion: string | null | undefined;
  IdTipoMovimiento?: number;
};

function leerSiguiente(siguiente: any, campo: string): number {
  return Array.isArray(siguiente)
    ? Number(siguiente[0]?.[campo] ?? 0)
    : Number(siguiente?.[campo] ?? siguiente ?? 0);
}

export function ModalSalidaInventario({
  config,
  modo = 'crear',
  numero,
  onClose,
  onMostrarMensaje,
  sendMessage,
  mensajesSocket = []
}: Readonly<ModalSalidaInventarioProps & { config: ConfigSalidaInventario }>): React.JSX.Element {
  const { campoNumero, campoLista, campoId, servicios } = config;
  const { user } = React.useContext(UserContext) || { user: null };
  const documentoUsuarioActivo = user ? `${user.documento}` : null;

  const [datos, setDatos] = React.useState<DatosSalida>({
    FechaSalida: dayjs(),
    DocumentoResponsable: OpcionPorDefecto.value,
    Observaciones: '',
    [campoNumero]: null,
    [campoLista]: [],
    UsuarioCreacion: documentoUsuarioActivo,
    IdTipoMovimiento: OpcionPorDefectoNumber.value
  });
  const items = datos[campoLista] as ItemMovimiento[];

  const [item, setItem] = React.useState<ItemMovimiento>(() => itemVacio(campoId));

  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [habilitarAgregar, setHabilitarAgregar] = React.useState(false);
  const [habilitarGuardar, setHabilitarGuardar] = React.useState(false);

  const [responsables, setResponsables] = React.useState<OpcionesSelectTexto[]>([]);
  const [elementos, setElementos] = React.useState<OpcionesSelectNumero[]>([]);
  const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<OpcionesSelectNumero[]>([]);
  const [estados, setEstados] = React.useState<OpcionesSelectNumero[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = React.useState<OpcionesSelectNumero[]>([]);
  const elementosDict = useDiccionario(elementos);
  const unidadesDict = useDiccionario(unidadesDeMedida);
  const estadosDict = useDiccionario(estados);
  const { setUnidadPorElemento, asignarUnidad } = useUnidadPorElemento(servicios.consultarPorId, setItem);

  const consultarSiguiente = async () => {
    const valor = leerSiguiente(await servicios.siguiente(), config.campoSiguiente);
    setDatos(prev => ({ ...prev, [campoNumero]: valor || null }));
  };

  React.useEffect(() => {
    if (modo === 'crear') {
      setDatos((prev) => ({
        ...prev,
        FechaSalida: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        [campoNumero]: null,
        [campoLista]: [],
        UsuarioCreacion: documentoUsuarioActivo
      }));
      consultarSiguiente().catch(() => { /* silencioso */ });
    }
  }, [modo, documentoUsuarioActivo]);

  React.useEffect(() => {
    if (modo === 'visualizar' && numero) {
      setModalAbierto(true);
      void (async () => {
        try {
          const resp = await servicios.visualizar({ [campoNumero]: numero });
          const numeroLeido = Number(resp?.[campoNumero] ?? numero);
          const responsable = String(resp?.DocumentoResponsable ?? resp?.Responsable ?? OpcionPorDefecto.value);
          const obs = String(resp?.Observaciones ?? '');
          const tipoMov = Number(resp?.IdTipoMovimiento ?? resp?.TipoMovimientoId ?? resp?.TipoMovimiento ?? OpcionPorDefectoNumber.value);
          const detallesOrigen = (resp?.[campoLista] ?? resp?.Detalles ?? resp?.detalles ?? []) as any[];
          const detalles = detallesOrigen.map((d: any) => ({
            [campoId]: Number(d?.[campoId] ?? d?.value ?? d?.[config.campoIdAlterno] ?? 0),
            Cantidad: Number(d?.Cantidad ?? d?.cantidad ?? d?.Qty ?? 0),
            IdUnidadMedida: Number(d?.IdUnidadDeMedida ?? d?.IdUnidadMedida ?? d?.UnidadId ?? 0),
            IdEstado: Number(d?.IdEstado ?? d?.EstadoId ?? 0),
            Observacion: String(d?.Observaciones ?? d?.Observacion ?? d?.observacion ?? '')
          }));
          setDatos(prev => ({
            ...prev,
            FechaSalida: config.leerFecha(resp),
            DocumentoResponsable: responsable,
            Observaciones: obs,
            [campoNumero]: numeroLeido || null,
            [campoLista]: detalles,
            IdTipoMovimiento: tipoMov || OpcionPorDefectoNumber.value
          }));
        } catch {
          onMostrarMensaje?.('Error al visualizar la salida', 'error');
        }
      })();
    }
  }, [modo, numero]);

  React.useEffect(() => {
    // Cada catálogo se pide en paralelo y se asigna en cuanto llega: encadenarlos
    // con `await` sumaba las cinco peticiones antes de poder mostrar nombres en el
    // modal, y un fallo en uno dejaba sin cargar todos los siguientes.
    void cargarCatalogo('las unidades de medida', ListarUnidadesDeMedida, (Unidades) => setUnidadesDeMedida([OpcionPorDefectoNumber, ...Unidades]));
    void cargarCatalogo('los estados', ListarEstados, (Estados) => setEstados([OpcionPorDefectoNumber, ...Estados]));
    void cargarCatalogo('los tipos de movimiento', servicios.listarTipos, (Tipos) => setTiposMovimiento([OpcionPorDefectoNumber, ...Tipos]));
    void cargarCatalogo('los responsables', ListarProfesionalesPertenecientes, (Resp) => setResponsables([OpcionPorDefecto, ...((Array.isArray(Resp) ? Resp : []))]));
    void cargarCatalogo(`los ${config.plural}`, servicios.listarElementos, (listado) => {
      const { opciones, unidades } = opcionesDeElementos(listado, {
        campoId,
        campoCodigo: config.campoCodigo,
        campoNombre: config.campoNombre,
        prefijo: config.singular,
      });
      setElementos(opciones);
      setUnidadPorElemento(unidades);
    });
  }, []);

  React.useEffect(() => {
    const valid = item[campoId] !== OpcionPorDefectoNumber.value && item.Cantidad > 0 && item.IdUnidadMedida !== OpcionPorDefectoNumber.value && item.IdEstado !== OpcionPorDefectoNumber.value;
    setHabilitarAgregar(valid);
  }, [item]);

  React.useEffect(() => {
    const valid = datos.DocumentoResponsable !== OpcionPorDefecto.value && items.length > 0;
    setHabilitarGuardar(valid);
  }, [datos.DocumentoResponsable, items]);

  const handleFechaChange = (fecha: Dayjs | null) => {
    setDatos(prev => ({ ...prev, FechaSalida: fecha || dayjs() }));
  };

  const agregarItem = () => {
    setDatos(prev => ({ ...prev, [campoLista]: [...prev[campoLista], item] }));
    setItem(itemVacio(campoId));
  };

  const eliminarItem = (index: number) => {
    setDatos(prev => ({ ...prev, [campoLista]: prev[campoLista].filter((_: unknown, i: number) => i !== index) }));
  };

  const handleDatosChange = (e: any) => {
    const { name, value } = e.target || {};
    if (!name) return;
    setDatos(prev => ({
      ...prev,
      [name]: name === 'IdTipoMovimiento' ? Number(value) : value
    }));
  };

  const handleItemChange = manejadorCambioItem(campoId, setItem);

  const guardarSalida = async () => {
    try {
      const body = {
        FechaSalida: datos.FechaSalida.format('YYYY-MM-DD HH:mm:ss'),
        DocumentoResponsable: datos.DocumentoResponsable,
        Observaciones: datos.Observaciones,
        [campoNumero]: datos[campoNumero],
        [campoLista]: items,
        UsuarioCreacion: datos.UsuarioCreacion,
        IdTipoMovimiento: datos.IdTipoMovimiento ?? 5
      };
      await servicios.guardar(body);
      sendMessage?.(config.evento, { numero: datos[campoNumero], fecha: new Date().toISOString() });
      onMostrarMensaje?.('Salida registrada correctamente', 'success');
      setDatos(prev => ({
        ...prev,
        FechaSalida: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        [campoNumero]: null,
        [campoLista]: [],
        UsuarioCreacion: documentoUsuarioActivo,
        IdTipoMovimiento: OpcionPorDefectoNumber.value
      }));
      setItem(itemVacio(campoId));
      await consultarSiguiente().catch(() => { /* silencioso */ });
    } catch (error: any) {
      onMostrarMensaje?.(error?.message ?? 'Error al registrar la salida', 'error');
    }
  };

  React.useEffect(() => {
    if (mensajesSocket.length > 0) {
      const ultimo = mensajesSocket[mensajesSocket.length - 1];
      if (ultimo.tipo === config.evento) {
        consultarSiguiente().catch(() => { /* silencioso */ });
      }
    }
  }, [mensajesSocket]);

  const cerrar = () => { setModalAbierto(false); onClose?.(); };
  const repuestos = config.presentacionRepuestos ?? false;
  const nombreDesconocido = (id: number) => (repuestos ? '-' : id);

  return (
    <MarcoModalMovimiento
      estilo='salida'
      mostrarBotonNuevo={modo === 'crear'}
      textoBotonNuevo={`+ Nueva Salida ${config.singular === 'Equipo' ? 'Equipos' : 'Repuestos'}`}
      abierto={modalAbierto}
      onAbrir={() => setModalAbierto(true)}
      onCerrar={cerrar}
      titulo={modo === 'visualizar' ? `Detalles de salida de ${config.plural}` : `Nueva salida ${config.plural}`}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid xs={12} md={3}>
            <Input label='No. salida' value={String(datos[campoNumero] ?? '')} tamano='small' tipo_input='text' bloqueado />
          </Grid>
          <Grid xs={12} md={3}>
            <FechayHora label='Fecha salida' value={datos.FechaSalida} onChange={handleFechaChange} disabled={modo === 'visualizar'} />
          </Grid>
          <Grid xs={12} md={3}>
            <Select label='Responsable' value={datos.DocumentoResponsable} onChange={handleDatosChange} options={FiltrarOpcionesActivas(responsables, datos.DocumentoResponsable)} valorname='DocumentoResponsable' bloqueado={modo === 'visualizar'} />
          </Grid>
          <Grid xs={12} md={3}>
            <Select label='Tipo de movimiento' value={datos.IdTipoMovimiento ?? OpcionPorDefectoNumber.value} onChange={handleDatosChange} options={tiposMovimiento} valorname='IdTipoMovimiento' bloqueado={modo === 'visualizar'} />
          </Grid>
          <Grid xs={12} md={12}>
            <Input label='Observaciones' value={datos.Observaciones} onChange={handleDatosChange} tamano='small' tipo_input='textarea' valorname='Observaciones' bloqueado={modo === 'visualizar'} />
          </Grid>

          {modo === 'crear' && (
            <>
              <EncabezadoAgregarItems texto={`Agregar ${config.plural}`} />
              <CamposAgregarItem
                etiqueta={config.singular}
                campoId={campoId}
                item={item}
                opciones={elementos}
                estados={estados}
                unidad={unidadesDict.get(item.IdUnidadMedida) ?? ''}
                onElegir={(id) => { setItem(prev => ({ ...prev, [campoId]: id })); void asignarUnidad(id); }}
                onCambio={handleItemChange}
                onAgregar={agregarItem}
                agregarDeshabilitado={!habilitarAgregar}
              />
            </>
          )}

          {items.length > 0 && (
            <Grid xs={12} md={12}>
              <TablaItemsMovimiento
                titulo={`${config.singular === 'Equipo' ? 'Equipos' : 'Repuestos'} ${modo === 'crear' ? 'agregados' : 'de la salida'}`}
                items={items}
                variante={repuestos ? 'repuestos' : 'equipos'}
                onEliminar={modo === 'crear' ? eliminarItem : undefined}
                columnas={[
                  { encabezado: 'Id', celda: (d) => d[campoId] },
                  { encabezado: config.singular, celda: (d) => elementosDict.get(Number(d[campoId])) ?? nombreDesconocido(Number(d[campoId])) },
                  { encabezado: 'Cantidad', celda: (d) => d.Cantidad },
                  { encabezado: 'Unidad', celda: (d) => unidadesDict.get(d.IdUnidadMedida) ?? nombreDesconocido(d.IdUnidadMedida) },
                  { encabezado: 'Estado', celda: (d) => estadosDict.get(d.IdEstado) ?? nombreDesconocido(d.IdEstado) },
                  { encabezado: 'Observación', celda: (d) => d.Observacion },
                ]}
              />
            </Grid>
          )}

          {modo === 'crear' && !repuestos && (
            <Grid xs={12}>
              <Box display='flex' justifyContent='flex-end' sx={{ mt: 2 }}>
                <Button variant='contained' color='primary' disabled={!habilitarGuardar} onClick={guardarSalida}>
                  {config.textoGuardar}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
      {repuestos && (
        <CardActions>
          <Box flex={1} />
          {modo === 'crear' && (
            <Button variant='contained' disabled={!habilitarGuardar} onClick={guardarSalida}>{config.textoGuardar}</Button>
          )}
        </CardActions>
      )}
    </MarcoModalMovimiento>
  );
}
