'use client';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import Select from '@/components/dashboard/componentes_generales/formulario/Select';
import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
import { ListarEquiposPropios } from '@/services/inventario/equipos/ListarEquiposPropiosService';
import { ConsultarSiguienteNoSalidaEquipos } from '@/services/inventario/equipos/ConsultarSiguienteNoSalidaEquiposService';
import { GuardarSalidaEquipos } from '@/services/inventario/equipos/GuardarSalidaEquiposService';
import { ListarTiposMovimientoEquipo } from '@/services/inventario/equipos/ListarTiposMovimientoEquipoService';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { VisualizarSalidaEquipos } from '@/services/inventario/equipos/VisualizarSalidaEquiposService';
import { ConsultarEquipoPorId } from '@/services/gestionycontrol/equipos/ConsultarEquipoPorIdService';
import {
  Box,
  Button,
  CardContent,
  Divider,
  IconButton,
  Modal,
  Paper,
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
import { X, Trash } from '@phosphor-icons/react/dist/ssr';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface EquipoItem {
  IdEquipo: number;
  Cantidad: number;
  IdUnidadMedida: number;
  IdEstado: number;
  Observacion: string;
}

interface SalidaEquipo {
  FechaSalida: Dayjs;
  DocumentoResponsable: string;
  Observaciones: string;
  NoSalidaEquipos: number | null;
  Equipos: EquipoItem[];
  UsuarioCreacion: string | null | undefined;
  IdTipoMovimiento?: number;
}

interface ModalRegistrarVisualizarSalidaEquiposProps {
  modo?: 'crear' | 'visualizar';
  noSalidaEquipos?: number;
  onClose?: () => void;
  readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function ModalRegistrarVisualizarSalidaEquipos({
  modo = 'crear',
  noSalidaEquipos,
  onClose,
  onMostrarMensaje
}: Readonly<ModalRegistrarVisualizarSalidaEquiposProps>): React.JSX.Element {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = React.useContext(UserContext) || { user: null };
  const documentoUsuarioActivo = user ? `${user.documento}` : null;
  const theme = useTheme();

  const [datos, setDatos] = React.useState<SalidaEquipo>({
    FechaSalida: dayjs(),
    DocumentoResponsable: OpcionPorDefecto.value,
    Observaciones: '',
    NoSalidaEquipos: null,
    Equipos: [],
    UsuarioCreacion: documentoUsuarioActivo,
    IdTipoMovimiento: OpcionPorDefectoNumber.value
  });

  const [equipoItem, setEquipoItem] = React.useState<EquipoItem>({
    IdEquipo: OpcionPorDefectoNumber.value,
    Cantidad: 1,
    IdUnidadMedida: OpcionPorDefectoNumber.value,
    IdEstado: OpcionPorDefectoNumber.value,
    Observacion: ''
  });

  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [habilitarAgregar, setHabilitarAgregar] = React.useState(false);
  const [habilitarGuardar, setHabilitarGuardar] = React.useState(false);

  const [responsables, setResponsables] = React.useState<{ value: string; label: string; }[]>([]);
  const [equipos, setEquipos] = React.useState<{ value: number; label: string; }[]>([]);
  const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<{ value: number; label: string; }[]>([]);
  const [estados, setEstados] = React.useState<{ value: number; label: string; }[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = React.useState<{ value: number; label: string; }[]>([]);
  const { sendMessage, messages } = useSocketIO();
  const [unidadPorEquipo, setUnidadPorEquipo] = React.useState<Map<number, number>>(new Map());
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

  React.useEffect(() => {
    if (modo === 'crear') {
      setDatos((prev) => ({
        ...prev,
        FechaSalida: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        NoSalidaEquipos: null,
        Equipos: [],
        UsuarioCreacion: documentoUsuarioActivo
      }));
      (async () => {
        try {
          const siguiente = await ConsultarSiguienteNoSalidaEquipos();
          const valor = Array.isArray(siguiente)
            ? Number(siguiente[0]?.SiguienteNoSalidaEquipo ?? 0)
            : Number((siguiente as any)?.SiguienteNoSalidaEquipo ?? siguiente ?? 0);
          setDatos(prev => ({ ...prev, NoSalidaEquipos: valor || null }));
        } catch (e) {
          // silencioso
        }
      })();
    }
  }, [modo, documentoUsuarioActivo]);

  React.useEffect(() => {
    if (modo === 'visualizar' && noSalidaEquipos) {
      setModalAbierto(true);
      (async () => {
        try {
          const resp = await VisualizarSalidaEquipos({ NoSalidaEquipos: noSalidaEquipos });
          const fecha = dayjs(String(resp?.FechaSalida ?? resp?.fecha ?? resp?.Fecha ?? dayjs().format('YYYY-MM-DD HH:mm:ss')));
          const numero = Number(resp?.NoSalidaEquipos ?? noSalidaEquipos);
          const responsable = String(resp?.DocumentoResponsable ?? resp?.Responsable ?? OpcionPorDefecto.value);
          const obs = String(resp?.Observaciones ?? '');
          const tipoMov = Number(resp?.IdTipoMovimiento ?? resp?.TipoMovimientoId ?? resp?.TipoMovimiento ?? OpcionPorDefectoNumber.value);
          const detallesOrigen = (resp?.Equipos ?? resp?.Detalles ?? resp?.detalles ?? []) as any[];
          const detalles: EquipoItem[] = detallesOrigen.map((d: any) => ({
            IdEquipo: Number(d?.IdEquipo ?? d?.value ?? d?.EquipoId ?? 0),
            Cantidad: Number(d?.Cantidad ?? d?.cantidad ?? d?.Qty ?? 0),
            IdUnidadMedida: Number(d?.IdUnidadDeMedida ?? d?.IdUnidadMedida ?? d?.UnidadId ?? 0),
            IdEstado: Number(d?.IdEstado ?? d?.EstadoId ?? 0),
            Observacion: String(d?.Observaciones ?? d?.Observacion ?? d?.observacion ?? '')
          }));
          setDatos(prev => ({
            ...prev,
            FechaSalida: fecha,
            DocumentoResponsable: responsable,
            Observaciones: obs,
            NoSalidaEquipos: numero || null,
            Equipos: detalles,
            IdTipoMovimiento: tipoMov || OpcionPorDefectoNumber.value
          }));
        } catch (error) {
          onMostrarMensaje?.('Error al visualizar la salida', 'error');
        }
      })();
    }
  }, [modo, noSalidaEquipos]);

  React.useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const Unidades = await ListarUnidadesDeMedida();
        const Estados = await ListarEstados();
        const Equipos = await ListarEquiposPropios();
        const Tipos = await ListarTiposMovimientoEquipo();
        const Resp = await ListarProfesionalesPertenecientes();
        setUnidadesDeMedida([OpcionPorDefectoNumber, ...Unidades]);
        setEstados([OpcionPorDefectoNumber, ...Estados]);
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
        setTiposMovimiento([OpcionPorDefectoNumber, ...Tipos]);
        setResponsables([OpcionPorDefecto, ...((Array.isArray(Resp) ? Resp : []))]);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    cargarDatosIniciales();
  }, []);

  React.useEffect(() => {
    const valid = equipoItem.IdEquipo !== OpcionPorDefectoNumber.value && equipoItem.Cantidad > 0 && equipoItem.IdUnidadMedida !== OpcionPorDefectoNumber.value && equipoItem.IdEstado !== OpcionPorDefectoNumber.value;
    setHabilitarAgregar(valid);
  }, [equipoItem]);

  React.useEffect(() => {
    const valid = datos.DocumentoResponsable !== OpcionPorDefecto.value && datos.Equipos.length > 0;
    setHabilitarGuardar(valid);
  }, [datos.DocumentoResponsable, datos.Equipos]);

  const handleFechaChange = (fecha: Dayjs | null) => {
    setDatos(prev => ({ ...prev, FechaSalida: fecha || dayjs() }));
  };

  const agregarEquipo = () => {
    setDatos(prev => ({ ...prev, Equipos: [...prev.Equipos, equipoItem] }));
    setEquipoItem({
      IdEquipo: OpcionPorDefectoNumber.value,
      Cantidad: 1,
      IdUnidadMedida: OpcionPorDefectoNumber.value,
      IdEstado: OpcionPorDefectoNumber.value,
      Observacion: ''
    });
  };

  const eliminarEquipo = (index: number) => {
    setDatos(prev => ({ ...prev, Equipos: prev.Equipos.filter((_, i) => i !== index) }));
  };

  const handleDatosChange = (e: any) => {
    const { name, value } = e.target || {};
    if (!name) return;
    setDatos(prev => ({
      ...prev,
      [name]: name === 'IdTipoMovimiento' ? Number(value) : value
    }));
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

  const guardarSalida = async () => {
    try {
      const body = {
        FechaSalida: datos.FechaSalida.format('YYYY-MM-DD HH:mm:ss'),
        DocumentoResponsable: datos.DocumentoResponsable,
        Observaciones: datos.Observaciones,
        NoSalidaEquipos: datos.NoSalidaEquipos,
        Equipos: datos.Equipos,
        UsuarioCreacion: datos.UsuarioCreacion,
        IdTipoMovimiento: datos.IdTipoMovimiento ?? 5
      };
      await GuardarSalidaEquipos(body as any);
      sendMessage?.('salida-equipos-creada', { numero: datos.NoSalidaEquipos, fecha: new Date().toISOString() });
      onMostrarMensaje?.('Salida registrada correctamente', 'success');
      setDatos(prev => ({
        ...prev,
        FechaSalida: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        NoSalidaEquipos: null,
        Equipos: [],
        UsuarioCreacion: documentoUsuarioActivo,
        IdTipoMovimiento: OpcionPorDefectoNumber.value
      }));
      setEquipoItem({
        IdEquipo: OpcionPorDefectoNumber.value,
        Cantidad: 1,
        IdUnidadMedida: OpcionPorDefectoNumber.value,
        IdEstado: OpcionPorDefectoNumber.value,
        Observacion: ''
      });
      try {
        const siguiente = await ConsultarSiguienteNoSalidaEquipos();
        const valor = Array.isArray(siguiente)
          ? Number(siguiente[0]?.SiguienteNoSalidaEquipo ?? 0)
          : Number((siguiente as any)?.SiguienteNoSalidaEquipo ?? siguiente ?? 0);
        setDatos(prev => ({ ...prev, NoSalidaEquipos: valor || null }));
      } catch { }
    } catch (error: any) {
      onMostrarMensaje?.(error?.message ?? 'Error al registrar la salida', 'error');
    }
  };

  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimo = messages[messages.length - 1];
      if (ultimo.tipo === 'salida-equipos-creada') {
        (async () => {
          try {
            const siguiente = await ConsultarSiguienteNoSalidaEquipos();
            const valor = Array.isArray(siguiente)
              ? Number(siguiente[0]?.SiguienteNoSalidaEquipo ?? 0)
              : Number((siguiente as any)?.SiguienteNoSalidaEquipo ?? siguiente ?? 0);
            setDatos(prev => ({ ...prev, NoSalidaEquipos: valor || null }));
          } catch { }
        })();
      }
    }
  }, [messages]);

  return (
    <>
      {modo === 'crear' && (
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <Button variant="contained" onClick={() => setModalAbierto(true)}>+ Nueva Salida Equipos</Button>
        </Box>
      )}

      <Modal
        open={modalAbierto}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
          setModalAbierto(false);
          onClose?.();
        }}
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '1%',
            left: '50%',
            transform: 'translate(-50%)',
            width: {
              xs: '90%',
              sm: '90%',
              md: '78%',
              lg: '78%'
            },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {modo === 'visualizar' ? 'Detalles de salida de equipos' : 'Nueva salida equipos'}
          </Typography>
          <IconButton
            onClick={() => { setModalAbierto(false); onClose?.(); }}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <X />
          </IconButton>
          <Divider sx={{ mb: 2 }} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} md={3}>
                <Input label='No. salida' value={String(datos.NoSalidaEquipos ?? '')} tamano='small' tipo_input='text' bloqueado />
              </Grid>
              <Grid xs={12} md={3}>
                <FechayHora label='Fecha salida' value={datos.FechaSalida} onChange={handleFechaChange} disabled={modo === 'visualizar'} />
              </Grid>
              <Grid xs={12} md={3}>
                <Select label='Responsable' value={datos.DocumentoResponsable} onChange={handleDatosChange} options={responsables} valorname='DocumentoResponsable' bloqueado={modo === 'visualizar'} />
              </Grid>
              <Grid xs={12} md={3}>
                <Select label='Tipo de movimiento' value={datos.IdTipoMovimiento ?? OpcionPorDefectoNumber.value} onChange={handleDatosChange} options={tiposMovimiento} valorname='IdTipoMovimiento' bloqueado={modo === 'visualizar'} />
              </Grid>
              <Grid xs={12} md={12}>
                <Input label='Observaciones' value={datos.Observaciones} onChange={handleDatosChange} tamano='small' tipo_input='textarea' valorname='Observaciones' bloqueado={modo === 'visualizar'} />
              </Grid>

              {modo === 'crear' && (
                <>
                  <Grid xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Agregar equipos</Typography>
                  </Grid>

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
                    <Select label='Estado' value={equipoItem.IdEstado} onChange={handleEquipoItemChange} options={estados} valorname='IdEstado' />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <Input label='Observación' value={equipoItem.Observacion} onChange={handleEquipoItemChange} tamano='small' tipo_input='text' valorname='Observacion' />
                  </Grid>

                  <Grid xs={12}>
                    <Box display='flex' justifyContent='flex-end'>
                      <Button variant='contained' disabled={!habilitarAgregar} onClick={agregarEquipo}>Agregar</Button>
                    </Box>
                  </Grid>
                </>
              )}

              {datos.Equipos.length > 0 && (
                <Grid xs={12} md={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      Equipos {modo === 'crear' ? 'agregados' : 'de la salida'}
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
              )}

              {modo === 'crear' && (
                <Grid xs={12}>
                  <Box display='flex' justifyContent='flex-end' sx={{ mt: 2 }}>
                    <Button variant='contained' color='primary' disabled={!habilitarGuardar} onClick={guardarSalida}>
                      Guardar Salida
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Paper>
      </Modal>
    </>
  );
}
