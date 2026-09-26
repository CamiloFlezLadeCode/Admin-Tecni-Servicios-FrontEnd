'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings';
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr/CalendarBlank';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
import { Package } from '@phosphor-icons/react/dist/ssr/Package';
import { Truck } from '@phosphor-icons/react/dist/ssr/Truck';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import axios from 'axios';

import type {
  FichaEquipo,
  UbicacionEquipo,
  UbicacionEquipoRespuesta,
} from '@/services/gestionycontrol/equipos/ConsultarUbicacionEquipoService';
import { ConsultarUbicacionEquipo } from '@/services/gestionycontrol/equipos/ConsultarUbicacionEquipoService';
import { TraerEquipos } from '@/services/gestionycontrol/equipos/TraerEquiposRegistradosService';

/** Opción del buscador de equipos. */
interface OpcionEquipo {
  IdEquipo: number;
  NombreEquipo: string;
  CategoriaEquipo?: string;
}

/** A partir de cuántos días una permanencia en obra merece destacarse. */
const DIAS_PERMANENCIA_LARGA = 90;

/** Tarjeta de cifra: total / disponible / en obra. */
function Indicador({
  titulo,
  valor,
  token,
  icono,
}: {
  titulo: string;
  valor: number;
  token: 'primary' | 'success' | 'warning';
  icono: React.ReactNode;
}): React.JSX.Element {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '12px',
              flexShrink: 0,
              // Tinte del propio color semántico: se lee igual en claro y en oscuro.
              backgroundColor: `rgba(var(--mui-palette-${token}-mainChannel) / 0.12)`,
              color: `var(--mui-palette-${token}-main)`,
            }}
          >
            {icono}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: 'var(--mui-palette-text-secondary)', lineHeight: 1.4 }}>
              {titulo}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {valor}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/** Par etiqueta/valor de la ficha del equipo. */
function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string | null }): React.JSX.Element {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'var(--mui-palette-text-secondary)', display: 'block' }}>
        {etiqueta}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
        {valor && valor.trim() !== '' ? valor : '—'}
      </Typography>
    </Box>
  );
}

/**
 * Convierte los días transcurridos en un texto legible.
 *
 * Los días llegan ya calculados desde el servidor (con la hora de Colombia),
 * así que el texto no depende del reloj ni de la zona horaria del navegador.
 */
function textoAntiguedad(dias: number): string {
  if (dias <= 0) return 'Hoy';
  if (dias === 1) return '1 día';
  if (dias < 30) return `${dias} días`;
  const meses = Math.floor(dias / 30);
  const resto = dias % 30;
  const parteMeses = meses === 1 ? '1 mes' : `${meses} meses`;
  if (resto === 0) return parteMeses;
  return `${parteMeses} y ${resto} ${resto === 1 ? 'día' : 'días'}`;
}

export function ConsultarEstadoEquipo(): React.JSX.Element {
  const [equipos, setEquipos] = React.useState<OpcionEquipo[]>([]);
  const [cargandoEquipos, setCargandoEquipos] = React.useState(true);
  const [seleccionado, setSeleccionado] = React.useState<OpcionEquipo | null>(null);

  const [datos, setDatos] = React.useState<UbicacionEquipoRespuesta | null>(null);
  const [consultando, setConsultando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Catálogo de equipos para el buscador.
  React.useEffect(() => {
    let vigente = true;

    const cargar = async (): Promise<void> => {
      try {
        const data = await TraerEquipos();
        if (vigente) setEquipos(Array.isArray(data) ? data : []);
      } catch {
        if (vigente) setError('No se pudo cargar el listado de equipos.');
      } finally {
        if (vigente) setCargandoEquipos(false);
      }
    };

    void cargar();
    return () => {
      vigente = false;
    };
  }, []);

  // Consulta de ubicación cada vez que cambia el equipo elegido.
  React.useEffect(() => {
    if (!seleccionado) {
      setDatos(null);
      setError(null);
      return;
    }

    // `vigente` evita que la respuesta lenta de una consulta anterior pise el
    // resultado de la que el usuario acaba de pedir.
    let vigente = true;
    setConsultando(true);
    setError(null);

    const consultar = async (): Promise<void> => {
      try {
        const respuesta = await ConsultarUbicacionEquipo(seleccionado.IdEquipo);
        if (vigente) setDatos(respuesta);
      } catch (e) {
        if (!vigente) return;
        setDatos(null);
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setError('El equipo seleccionado ya no existe.');
        } else {
          setError('No se pudo consultar la ubicación del equipo. Inténtalo de nuevo.');
        }
      } finally {
        if (vigente) setConsultando(false);
      }
    };

    void consultar();
    return () => {
      vigente = false;
    };
  }, [seleccionado]);

  const equipo: FichaEquipo | undefined = datos?.Equipo;
  const ubicaciones: UbicacionEquipo[] = datos?.Ubicaciones ?? [];
  const estaEnObra = (equipo?.CantidadEnObra ?? 0) > 0;

  return (
    <Stack spacing={2}>
      {/* ── Buscador ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Consultar ubicación de un equipo
          </Typography>
          <Autocomplete
            options={equipos}
            loading={cargandoEquipos}
            value={seleccionado}
            onChange={(_evento, valor) => {
              setSeleccionado(valor);
            }}
            getOptionLabel={(opcion) => opcion.NombreEquipo ?? ''}
            isOptionEqualToValue={(opcion, valor) => opcion.IdEquipo === valor.IdEquipo}
            noOptionsText="No hay equipos que coincidan"
            loadingText="Cargando equipos…"
            renderOption={(props, opcion) => {
              const { key: _key, ...resto } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
              return (
                <Box component="li" key={opcion.IdEquipo} {...resto}>
                  <Stack sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {opcion.NombreEquipo}
                    </Typography>
                    {opcion.CategoriaEquipo ? (
                      <Typography variant="caption" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                        {opcion.CategoriaEquipo}
                      </Typography>
                    ) : null}
                  </Stack>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipo"
                placeholder="Escribe para buscar un equipo…"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <React.Fragment>
                      <MagnifyingGlass size={18} style={{ marginLeft: 6, marginRight: 4 }} />
                      {params.InputProps.startAdornment}
                    </React.Fragment>
                  ),
                  endAdornment: (
                    <React.Fragment>
                      {cargandoEquipos ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </CardContent>
      </Card>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {/* ── Cargando ─────────────────────────────────────────────────── */}
      {consultando ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={150} />
          <Skeleton variant="rounded" height={220} />
        </Stack>
      ) : null}

      {/* ── Todavía no se ha elegido nada ────────────────────────────── */}
      {!consultando && !datos && !error ? (
        <Card variant="outlined">
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Package size={40} color="var(--mui-palette-text-secondary)" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
              Selecciona un equipo
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              Verás si está disponible o, si está arrendado, en qué proyecto se encuentra y desde cuándo.
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {/* ── Resultado ────────────────────────────────────────────────── */}
      {!consultando && equipo ? (
        <React.Fragment>
          <Card>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ alignItems: { md: 'flex-start' }, justifyContent: 'space-between' }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {equipo.NombreEquipo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                    {equipo.Categoria} · {equipo.TipoDeEquipo}
                  </Typography>
                </Box>
                <Chip
                  icon={estaEnObra ? <Truck size={16} weight="fill" /> : <CheckCircle size={16} weight="fill" />}
                  color={estaEnObra ? 'warning' : 'success'}
                  label={
                    estaEnObra
                      ? `Arrendado · ${equipo.CantidadEnObra} en obra`
                      : 'Disponible · sin unidades en obra'
                  }
                  sx={{ flexShrink: 0 }}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3}>
                  <Dato etiqueta="Propietario" valor={equipo.Propietario} />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Dato etiqueta="Bodega" valor={equipo.Bodega} />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Dato etiqueta="Unidad de medida" valor={equipo.UnidadDeMedida} />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Dato etiqueta="Estado en catálogo" valor={equipo.Estado} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Indicador titulo="Total" valor={equipo.CantidadTotal} token="primary" icono={<Package size={22} weight="duotone" />} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Indicador
                titulo="Disponible"
                valor={equipo.CantidadDisponible}
                token="success"
                icono={<CheckCircle size={22} weight="duotone" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Indicador titulo="En obra" valor={equipo.CantidadEnObra} token="warning" icono={<Truck size={22} weight="duotone" />} />
            </Grid>
          </Grid>

          {estaEnObra ? (
            <Card>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ¿Quién lo tiene y dónde?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                    {ubicaciones.length === 1
                      ? 'Una ubicación con unidades pendientes de devolución.'
                      : `${ubicaciones.length} ubicaciones con unidades pendientes de devolución.`}
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Proyecto</TableCell>
                        <TableCell>Dirección</TableCell>
                        <TableCell>Desde</TableCell>
                        <TableCell>Tiempo en obra</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell>Remisión</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ubicaciones.map((u) => {
                        const contacto = u.CelularCliente ?? u.TelefonoCliente;
                        const permanenciaLarga = u.DiasEnObra >= DIAS_PERMANENCIA_LARGA;
                        return (
                          <TableRow hover key={u.IdDetalleRemision}>
                            <TableCell>
                              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <User size={16} color="var(--mui-palette-text-secondary)" />
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {u.Cliente}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                                    {u.DocumentoCliente}
                                    {contacto ? ` · ${contacto}` : ''}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <Buildings size={16} color="var(--mui-palette-text-secondary)" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {u.Proyecto}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <MapPin size={16} color="var(--mui-palette-text-secondary)" />
                                <Typography variant="body2">{u.DireccionProyecto || '—'}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={u.FechaRemisionCompleta}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                  <CalendarBlank size={16} color="var(--mui-palette-text-secondary)" />
                                  <Typography variant="body2">{u.FechaRemisionTexto}</Typography>
                                </Stack>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              {/* Una permanencia muy larga se resalta: suele delatar
                                  una devolución pendiente que conviene revisar. */}
                              <Chip
                                size="small"
                                label={textoAntiguedad(u.DiasEnObra)}
                                color={permanenciaLarga ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {u.CantidadEnObra}
                              </Typography>
                              {u.CantidadDevuelta > 0 ? (
                                <Typography variant="caption" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                                  de {u.CantidadPrestada} · {u.CantidadDevuelta} devueltas
                                </Typography>
                              ) : null}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{u.NoRemision}</Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="success" icon={<CheckCircle size={20} weight="fill" />}>
              Este equipo no tiene unidades en obra: todas las remisiones que lo incluyen fueron devueltas.
            </Alert>
          )}
        </React.Fragment>
      ) : null}
    </Stack>
  );
}
