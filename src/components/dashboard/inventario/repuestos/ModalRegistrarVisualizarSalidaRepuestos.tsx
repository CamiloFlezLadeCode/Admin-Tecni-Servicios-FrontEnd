'use client';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import Select from '@/components/dashboard/componentes_generales/formulario/Select';
import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
import { UserContext } from '@/contexts/user-context';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
import { ListarRepuestos } from '@/services/inventario/repuestos/ListarRepuestosService';
import { ConsultarSiguienteNoSalidaRepuestos } from '@/services/inventario/repuestos/ConsultarSiguienteNoSalidaRepuestosService';
import { GuardarSalidaRepuestos } from '@/services/inventario/repuestos/GuardarSalidaRepuestosService';
import { ListarTiposMovimientoRepuesto } from '@/services/inventario/repuestos/ListarTiposMovimientoRepuestoService';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { VisualizarSalidaRepuestos } from '@/services/inventario/repuestos/VisualizarSalidaRepuestosService';
import {
  Box,
  Button,
  CardActions,
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
import { X } from '@phosphor-icons/react/dist/ssr';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface RepuestoItem {
  IdRepuesto: number;
  Cantidad: number;
  IdUnidadMedida: number;
  IdEstado: number;
  Observacion: string;
}

interface SalidaRepuesto {
  FechaSalida: Dayjs;
  DocumentoResponsable: string;
  Observaciones: string;
  NoSalidaRepuestos: number | null;
  Repuestos: RepuestoItem[];
  UsuarioCreacion: string | null | undefined;
  IdTipoMovimiento?: number;
}

interface SalidaRepuestoModal extends Partial<SalidaRepuesto> {
  Responsable?: string;
  CreadoPor?: string;
  FechaCreacion?: string;
}

interface ModalRegistrarVisualizarSalidaRepuestosProps {
  modo?: 'crear' | 'visualizar';
  noSalidaRepuestos?: number;
  onClose?: () => void;
  readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function ModalRegistrarVisualizarSalidaRepuestos({
  modo = 'crear',
  noSalidaRepuestos,
  onClose,
  onMostrarMensaje
}: Readonly<ModalRegistrarVisualizarSalidaRepuestosProps>): React.JSX.Element {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = React.useContext(UserContext) || { user: null };
  const documentoUsuarioActivo = user ? `${user.documento}` : null;
  const theme = useTheme();

  const [datos, setDatos] = React.useState<SalidaRepuesto>({
    FechaSalida: dayjs(),
    DocumentoResponsable: OpcionPorDefecto.value,
    Observaciones: '',
    NoSalidaRepuestos: null,
    Repuestos: [],
    UsuarioCreacion: documentoUsuarioActivo,
    IdTipoMovimiento: OpcionPorDefectoNumber.value
  });

  const [repuestoItem, setRepuestoItem] = React.useState<RepuestoItem>({
    IdRepuesto: OpcionPorDefectoNumber.value,
    Cantidad: 1,
    IdUnidadMedida: OpcionPorDefectoNumber.value,
    IdEstado: OpcionPorDefectoNumber.value,
    Observacion: ''
  });

  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [habilitarAgregar, setHabilitarAgregar] = React.useState(false);
  const [habilitarGuardar, setHabilitarGuardar] = React.useState(false);

  const [responsables, setResponsables] = React.useState<{ value: string; label: string; }[]>([]);
  const [repuestos, setRepuestos] = React.useState<{ value: number; label: string; }[]>([]);
  const [unidadesDeMedida, setUnidadesDeMedida] = React.useState<{ value: number; label: string; }[]>([]);
  const [estados, setEstados] = React.useState<{ value: number; label: string; }[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = React.useState<{ value: number; label: string; }[]>([]);
  const { sendMessage, messages } = useSocketIO();
  const repuestosDict = React.useMemo(() => {
    const m = new Map<number, string>();
    repuestos.forEach((o) => { if (o?.value) m.set(Number(o.value), String(o.label ?? '')); });
    return m;
  }, [repuestos]);
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

  React.useEffect(() => {
    if (modo === 'crear') {
      setDatos((prev) => ({
        ...prev,
        FechaSalida: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        NoSalidaRepuestos: null,
        Repuestos: [],
        UsuarioCreacion: documentoUsuarioActivo
      }));
      (async () => {
        try {
          const siguiente = await ConsultarSiguienteNoSalidaRepuestos();
          const valor = Array.isArray(siguiente)
            ? Number(siguiente[0]?.SiguienteNoSalidaRepuestos ?? 0)
            : Number((siguiente as any)?.SiguienteNoSalidaRepuestos ?? siguiente ?? 0);
          setDatos(prev => ({ ...prev, NoSalidaRepuestos: valor || null }));
        } catch (e) {
          // silencioso
        }
      })();
    }
  }, [modo, documentoUsuarioActivo]);

  React.useEffect(() => {
    if (modo === 'visualizar' && noSalidaRepuestos) {
      setModalAbierto(true);
      (async () => {
        try {
          const resp = await VisualizarSalidaRepuestos({ NoSalidaRepuestos: noSalidaRepuestos });
          const fecha = dayjs(String(resp?.FechaSalida ?? resp?.fecha ?? resp?.Fecha ?? dayjs().format('YYYY-MM-DD HH:mm:ss')));
          const numero = Number(resp?.NoSalidaRepuestos ?? noSalidaRepuestos);
          const responsable = String(resp?.DocumentoResponsable ?? resp?.Responsable ?? OpcionPorDefecto.value);
          const obs = String(resp?.Observaciones ?? '');
          const tipoMov = Number(resp?.IdTipoMovimiento ?? resp?.TipoMovimientoId ?? resp?.TipoMovimiento ?? OpcionPorDefectoNumber.value);
          const detallesOrigen = (resp?.Repuestos ?? resp?.Detalles ?? resp?.detalles ?? []) as any[];
          const detalles: RepuestoItem[] = detallesOrigen.map((d: any) => ({
            IdRepuesto: Number(d?.IdRepuesto ?? d?.value ?? d?.RepuestoId ?? 0),
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
            NoSalidaRepuestos: numero || null,
            Repuestos: detalles,
            IdTipoMovimiento: tipoMov || OpcionPorDefectoNumber.value
          }));
        } catch (error) {
          onMostrarMensaje?.('Error al visualizar la salida', 'error');
        }
      })();
    }
  }, [modo, noSalidaRepuestos]);

  React.useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const Unidades = await ListarUnidadesDeMedida();
        const Estados = await ListarEstados();
        const Repuestos = await ListarRepuestos();
        const Tipos = await ListarTiposMovimientoRepuesto();
        const Resp = await ListarProfesionalesPertenecientes();
        setUnidadesDeMedida([OpcionPorDefectoNumber, ...Unidades]);
        setEstados([OpcionPorDefectoNumber, ...Estados]);
        const opcionesRepuestos: { value: number; label: string }[] = [];
        const vistos = new Set<number>();
        (Array.isArray(Repuestos) ? Repuestos : []).forEach((r: any) => {
          // Soportar dos formas: { value, label } ya normalizado, o registro crudo con IdRepuesto
          const hasValueLabel = r && 'value' in r && 'label' in r;
          const id = hasValueLabel ? Number(r.value) : Number(r.IdRepuesto);
          if (!id || vistos.has(id)) return;
          const etiqueta = hasValueLabel
            ? String(r.label ?? String(id)).trim()
            : (() => {
              const codigo = String(r.CodigoRepuesto ?? '').trim();
              const nombre = String(r.NombreRepuesto ?? '').trim();
              return (codigo || nombre) ? `${codigo}${codigo && nombre ? ' ' : ''}${nombre}` : `Repuesto ${id}`;
            })();
          opcionesRepuestos.push({ value: id, label: etiqueta });
          vistos.add(id);
        });
        setRepuestos([OpcionPorDefectoNumber, ...opcionesRepuestos]);
        setTiposMovimiento([OpcionPorDefectoNumber, ...Tipos]);
        setResponsables([OpcionPorDefecto, ...((Array.isArray(Resp) ? Resp : []))]);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    cargarDatosIniciales();
  }, []);

  React.useEffect(() => {
    const valid = repuestoItem.IdRepuesto !== OpcionPorDefectoNumber.value && repuestoItem.Cantidad > 0 && repuestoItem.IdUnidadMedida !== OpcionPorDefectoNumber.value && repuestoItem.IdEstado !== OpcionPorDefectoNumber.value;
    setHabilitarAgregar(valid);
  }, [repuestoItem]);

  React.useEffect(() => {
    const valid = datos.DocumentoResponsable !== OpcionPorDefecto.value && datos.Repuestos.length > 0;
    setHabilitarGuardar(valid);
  }, [datos.DocumentoResponsable, datos.Repuestos]);

  const handleFechaChange = (fecha: Dayjs | null) => {
    setDatos(prev => ({ ...prev, FechaSalida: fecha || dayjs() }));
  };

  const agregarRepuesto = () => {
    setDatos(prev => ({ ...prev, Repuestos: [...prev.Repuestos, repuestoItem] }));
    setRepuestoItem({
      IdRepuesto: OpcionPorDefectoNumber.value,
      Cantidad: 1,
      IdUnidadMedida: OpcionPorDefectoNumber.value,
      IdEstado: OpcionPorDefectoNumber.value,
      Observacion: ''
    });
  };

  const eliminarRepuesto = (index: number) => {
    setDatos(prev => ({ ...prev, Repuestos: prev.Repuestos.filter((_, i) => i !== index) }));
  };

  const handleDatosChange = (e: any) => {
    const { name, value } = e.target || {};
    if (!name) return;
    setDatos(prev => ({
      ...prev,
      [name]: name === 'IdTipoMovimiento' ? Number(value) : value
    }));
  };

  const handleRepuestoItemChange = (e: any) => {
    const { name, value } = e.target || {};
    if (!name) return;
    const numericos = new Set(['IdRepuesto', 'Cantidad', 'IdUnidadMedida', 'IdEstado']);
    setRepuestoItem(prev => ({
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
        NoSalidaRepuestos: datos.NoSalidaRepuestos,
        Repuestos: datos.Repuestos,
        UsuarioCreacion: datos.UsuarioCreacion,
        IdTipoMovimiento: datos.IdTipoMovimiento ?? 5
      };
      await GuardarSalidaRepuestos(body as any);
      sendMessage?.('salida-repuestos-creada', { numero: datos.NoSalidaRepuestos, fecha: new Date().toISOString() });
      onMostrarMensaje?.('Salida registrada correctamente', 'success');
      setDatos(prev => ({
        ...prev,
        FechaSalida: dayjs(),
        DocumentoResponsable: OpcionPorDefecto.value,
        Observaciones: '',
        NoSalidaRepuestos: null,
        Repuestos: [],
        UsuarioCreacion: documentoUsuarioActivo,
        IdTipoMovimiento: OpcionPorDefectoNumber.value
      }));
      setRepuestoItem({
        IdRepuesto: OpcionPorDefectoNumber.value,
        Cantidad: 1,
        IdUnidadMedida: OpcionPorDefectoNumber.value,
        IdEstado: OpcionPorDefectoNumber.value,
        Observacion: ''
      });
      try {
        const siguiente = await ConsultarSiguienteNoSalidaRepuestos();
        const valor = Array.isArray(siguiente)
          ? Number(siguiente[0]?.SiguienteNoSalidaRepuestos ?? 0)
          : Number((siguiente as any)?.SiguienteNoSalidaRepuestos ?? siguiente ?? 0);
        setDatos(prev => ({ ...prev, NoSalidaRepuestos: valor || null }));
      } catch { }
    } catch (error: any) {
      onMostrarMensaje?.(error?.message ?? 'Error al registrar la salida', 'error');
    }
  };

  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimo = messages[messages.length - 1];
      if (ultimo.tipo === 'salida-repuestos-creada') {
        (async () => {
          try {
            const siguiente = await ConsultarSiguienteNoSalidaRepuestos();
            const valor = Array.isArray(siguiente)
              ? Number(siguiente[0]?.SiguienteNoSalidaRepuestos ?? 0)
              : Number((siguiente as any)?.SiguienteNoSalidaRepuestos ?? siguiente ?? 0);
            setDatos(prev => ({ ...prev, NoSalidaRepuestos: valor || null }));
          } catch { }
        })();
      }
    }
  }, [messages]);

  return (
    <>
      {modo === 'crear' && (
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <Button variant="contained" onClick={() => setModalAbierto(true)}>+ Nueva Salida Repuestos</Button>
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
            {modo === 'visualizar' ? 'Detalles de salida de repuestos' : 'Nueva salida repuestos'}
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
                <Input label='No. salida' value={String(datos.NoSalidaRepuestos ?? '')} tamano='small' tipo_input='text' bloqueado />
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
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Agregar repuestos</Typography>
                  </Grid>

                  <Grid xs={12} md={3}>
                    <SelectConBuscador label='Repuesto' value={repuestoItem.IdRepuesto} onChange={handleRepuestoItemChange} options={repuestos} valorname='IdRepuesto' />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <Input label='Cantidad' value={repuestoItem.Cantidad} onChange={handleRepuestoItemChange} tamano='small' tipo_input='number' valorname='Cantidad' />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <Select label='Unidad' value={repuestoItem.IdUnidadMedida} onChange={handleRepuestoItemChange} options={unidadesDeMedida} valorname='IdUnidadMedida' />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <Select label='Estado' value={repuestoItem.IdEstado} onChange={handleRepuestoItemChange} options={estados} valorname='IdEstado' />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <Input label='Observación' value={repuestoItem.Observacion} onChange={handleRepuestoItemChange} tamano='small' tipo_input='text' valorname='Observacion' />
                  </Grid>

                  <Grid xs={12}>
                    <Box display='flex' justifyContent='flex-end'>
                      <Button variant='contained' disabled={!habilitarAgregar} onClick={agregarRepuesto}>Agregar</Button>
                    </Box>
                  </Grid>
                </>
              )}

              <Grid xs={12}>
                <TableContainer component={Paper}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Repuesto</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Unidad</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Observación</TableCell>
                        {modo !== 'visualizar' && (
                          <TableCell align='right'>Acciones</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datos.Repuestos.map((r, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{r.IdRepuesto}</TableCell>
                          <TableCell>{repuestosDict.get(r.IdRepuesto) ?? '-'}</TableCell>
                          <TableCell>{r.Cantidad}</TableCell>
                          <TableCell>{unidadesDict.get(r.IdUnidadMedida) ?? '-'}</TableCell>
                          <TableCell>{estadosDict.get(r.IdEstado) ?? '-'}</TableCell>
                          <TableCell>{r.Observacion}</TableCell>
                          {modo !== 'visualizar' && (
                            <TableCell align='right'>
                              <Button size='small' color='error' onClick={() => eliminarRepuesto(idx)}>Eliminar</Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ mt: 1 }} />
          <CardActions>
            <Box flex={1} />
            {modo === 'crear' && (
              <Button variant='contained' disabled={!habilitarGuardar} onClick={guardarSalida}>Guardar salida</Button>
            )}
          </CardActions>
        </Paper>
      </Modal>
    </>
  );
}