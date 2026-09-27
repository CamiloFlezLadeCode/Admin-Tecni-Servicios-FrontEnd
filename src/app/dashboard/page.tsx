'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowRight, ArrowClockwise, Buildings, ClipboardText, Package, Receipt, Wrench } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import { config } from '@/config';
import { paths } from '@/paths';
import { useChartPalette } from '@/hooks/use-chart-palette';
import { Chart } from '@/components/core/chart';
import { VerResumenDashboard } from '@/services/dashboard/VerResumenDashboardService';
import type { ResumenDashboard } from '@/services/dashboard/VerResumenDashboardService';

const skeletonKeys6 = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

function parseDate(value: unknown): dayjs.Dayjs | null {
    if (value instanceof Date) {
        const d = dayjs(value);
        return d.isValid() ? d : null;
    }

    if (typeof value !== 'string') return null;

    const raw = value.trim();
    if (!raw) return null;

    const isoLike = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (isoLike) {
        const normalized = raw.replace(' ', 'T');
        const d = dayjs(normalized);
        return d.isValid() ? d : null;
    }

    const dmy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (dmy) {
        const dd = Number(dmy[1]);
        const mm = Number(dmy[2]);
        const yyyy = Number(dmy[3]);
        const hh = Number(dmy[4] ?? 0);
        const mi = Number(dmy[5] ?? 0);
        const ss = Number(dmy[6] ?? 0);
        const date = new Date(yyyy, mm - 1, dd, hh, mi, ss);
        const d = dayjs(date);
        return d.isValid() ? d : null;
    }

    const d = dayjs(raw);
    return d.isValid() ? d : null;
}

function monthKey(d: dayjs.Dayjs): string {
    return d.format('YYYY-MM');
}

function normalizeMonthKey(value: unknown): string | null {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (/^\d{4}-\d{2}$/.test(trimmed)) return trimmed;
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 7);
    }

    const d = parseDate(value);
    return d ? monthKey(d) : null;
}

function monthLabel(d: dayjs.Dayjs): string {
    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${labels[d.month()]} ${d.format('YY')}`;
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
}

function formatDateShort(value: string): string {
    const d = parseDate(value);
    return d ? d.format('DD/MM/YYYY') : value;
}

function formatDateTimeShort12h(value: string): string {
    const d = parseDate(value);
    return d ? d.format('DD/MM/YYYY hh:mm A') : value;
}

function formatDateLongEsCo(value: dayjs.Dayjs): string {
    return new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(value.toDate());
}

function actividadColor(tipo: 'Remisión' | 'Devolución' | 'Órden'): 'primary' | 'info' | 'success' {
    if (tipo === 'Remisión') return 'primary';
    if (tipo === 'Devolución') return 'info';
    return 'success';
}

export default function Page(): React.JSX.Element {
    // Colores literales para ApexCharts, ligados al modo REAL (ver el hook:
    // `theme.palette` no sirve aquí porque son variables CSS y `palette.mode`
    // se queda congelado bajo `CssVarsProvider`).
    const paletaGrafica = useChartPalette();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Una sola petición con todo ya agregado en el servidor. Antes el panel
    // descargaba los listados completos de clientes, proyectos, remisiones,
    // devoluciones, órdenes y stock sólo para contarlos en el navegador, y el
    // tamaño de esa descarga crecía con el historial.
    const [resumen, setResumen] = React.useState<ResumenDashboard | null>(null);

    React.useEffect(() => {
        document.title = `Dashboard | ${config.site.name}`;
    }, []);

    const cargar = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setResumen(await VerResumenDashboard());
        } catch (e) {
            setError((e as Error)?.message ?? 'No fue posible cargar el dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        cargar();
    }, [cargar]);

    const now = dayjs();

    const clientesCount = resumen?.TotalClientes ?? 0;
    const proyectosActivos = resumen?.Proyectos.Activos ?? 0;
    const proyectosTotal = resumen?.Proyectos.Total ?? 0;

    const operacionDelMes = React.useMemo(() => {
        const totales = resumen?.TotalesMesActual?.Totales;
        return {
            total: resumen?.TotalesMesActual?.TotalMovimientos ?? 0,
            rem: totales?.CantidadRemisiones ?? 0,
            dev: totales?.CantidadDevoluciones ?? 0,
            ord: totales?.CantidadOrdenesDeServicio ?? 0,
        };
    }, [resumen]);

    const inventarioResumen = resumen?.Inventario ?? { OK: 0, Bajo: 0, Agotado: 0 };
    const inventarioAlertasCount = inventarioResumen.Bajo + inventarioResumen.Agotado;

    const serieMeses = React.useMemo(() => {
        const sorted = [...(resumen?.SerieUltimos6Meses?.Meses ?? [])].sort((a, b) => String(a.Mes).localeCompare(String(b.Mes)));
        return {
            categories: sorted.map((m) => String(m.Etiqueta ?? m.Mes)),
            remisiones: sorted.map((m) => Number(m.CantidadRemisiones ?? 0)),
            devoluciones: sorted.map((m) => Number(m.CantidadDevoluciones ?? 0)),
            ordenes: sorted.map((m) => Number(m.CantidadOrdenesDeServicio ?? 0)),
        };
    }, [resumen]);

    const serieOrdenes6m = React.useMemo(() => {
        const meses = Array.from({ length: 6 }).map((_, idx) => now.subtract(5 - idx, 'month').startOf('month'));
        const porMes = new Map<string, number>();
        (resumen?.SerieUltimos6Meses?.Meses ?? []).forEach((m) => {
            const k = normalizeMonthKey(m.Mes);
            if (k) porMes.set(k, Number(m.CantidadOrdenesDeServicio ?? 0));
        });
        return {
            categories: meses.map(monthLabel),
            ordenes: meses.map((m) => porMes.get(monthKey(m)) ?? 0),
        };
        // `now` cambia en cada render; la serie sólo depende de los datos.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
    }, [resumen]);

    const topClientes = React.useMemo(() => {
        return (resumen?.TopClientes ?? []).map((c) => ({
            cliente: c.Cliente || 'Sin cliente',
            remisiones: c.CantidadRemisiones,
            devoluciones: c.CantidadDevoluciones,
            total: c.Total,
        }));
    }, [resumen]);

    const actividadReciente = React.useMemo(() => {
        return (resumen?.ActividadReciente?.Movimientos ?? []).map((m) => {
            let tipo: 'Remisión' | 'Devolución' | 'Órden' = 'Remisión';
            const rawTipo = String(m.TipoMovimiento || '').toUpperCase();

            if (rawTipo === 'DEVOLUCION') tipo = 'Devolución';
            else if (rawTipo === 'ORDEN_DE_SERVICIO') tipo = 'Órden';

            return {
                tipo,
                id: Number(m.IdMovimiento),
                numero: String(m.NoMovimiento),
                cliente: String(m.Cliente),
                proyecto: String(m.Proyecto || ''),
                creadoPor: String(m.CreadoPor || ''),
                estado: String(m.Estado || ''),
                fecha: String(m.FechaCreacion)
            };
        });
    }, [resumen]);

    // El fondo de papel y el hairline de elevación ya vienen de `MuiPaper` y
    // `MuiCard`; repetirlos aquí sólo duplicaba el borde de las tarjetas KPI.
    const kpiCardSx = React.useMemo(() => {
        return {
            height: '100%',
            overflow: 'hidden',
        };
    }, []);

    /**
     * Opciones comunes de las tres gráficas.
     *
     * Todo el color sale de `paletaGrafica` (hex literales) y NO de
     * `theme.palette.*`: bajo `CssVarsProvider` esos valores son strings con
     * `var(...)` dentro, o rgba translúcidos, y Apex —que escribe en atributos
     * SVG— no resuelve ninguno de los dos. Y `theme.palette.mode` queda
     * congelado en el esquema por defecto, así que ni el tema ni las
     * dependencias del `useMemo` cambiaban al alternar el modo.
     *
     * `paletaGrafica` sólo cambia de identidad cuando cambia el modo real, así
     * que tenerla en las dependencias es justo lo que faltaba para que las
     * gráficas se repinten.
     */
    const chartCommon = React.useMemo(() => {
        return {
            chart: {
                background: 'transparent',
                fontFamily: 'inherit',
                // Color por defecto de cualquier texto del SVG sin color propio.
                foreColor: paletaGrafica.textoEje,
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            dataLabels: { enabled: false },
            grid: { borderColor: paletaGrafica.rejilla, strokeDashArray: 2 },
            stroke: { width: 3, curve: 'smooth' as const },
            // Sin `theme.mode` a propósito. Cuando Apex recibe opciones nuevas
            // con el gráfico ya montado (`updateOptions`), `theme.mode` le hace
            // PISAR `chart.background` con su gris `#424242` en oscuro (`#fff`
            // en claro) ignorando el `transparent` de arriba: aparecía un velo
            // opaco sobre las gráficas al volver al panel sin refrescar.
            // Todo lo que decidiría el modo ya va explícito (colores, foreColor,
            // fondo, tooltip) y el gráfico se remonta al cambiar de modo (`key`).
            tooltip: { theme: paletaGrafica.modo },
        };
    }, [paletaGrafica]);

    /** Variables CSS del tooltip; las consume el CSS de `components/core/chart.tsx`. */
    const chartTooltipVars = React.useMemo(() => {
        return {
            '--grafica-tooltip-fondo': paletaGrafica.tooltipFondo,
            '--grafica-tooltip-texto': paletaGrafica.tooltipTexto,
        };
    }, [paletaGrafica]);

    const optionsRemVsDev = React.useMemo(() => {
        return {
            ...chartCommon,
            // Índigo y cian: los mismos hex a los que resuelven `primary.main`
            // e `info.main` del modo activo, para que cada área vaya a juego
            // con su `<Chip>` ("Rem" primary / "Dev" info) de las tarjetas.
            colors: [paletaGrafica.primario, paletaGrafica.info],
            xaxis: {
                categories: serieMeses.categories,
                axisBorder: { color: paletaGrafica.bordeEje },
                axisTicks: { color: paletaGrafica.bordeEje },
                labels: { style: { colors: paletaGrafica.textoEje } },
            },
            yaxis: { labels: { style: { colors: paletaGrafica.textoEje } } },
            // Con dos series superpuestas la leyenda es obligatoria: es lo
            // único que ata cada color a su nombre.
            legend: {
                position: 'top' as const,
                horizontalAlign: 'right' as const,
                fontFamily: 'inherit',
                labels: { colors: paletaGrafica.textoEje },
                markers: { width: 10, height: 10, radius: 3 },
            },
            fill: { type: 'gradient', gradient: { shadeIntensity: 0.2, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] } },
        };
    }, [chartCommon, paletaGrafica, serieMeses.categories]);

    const optionsOrdenes = React.useMemo(() => {
        return {
            ...chartCommon,
            colors: [paletaGrafica.exito],
            // Punta redondeada sólo arriba: la base queda anclada al cero, que
            // es lo que se compara entre meses.
            plotOptions: { bar: { columnWidth: '42px', borderRadius: 6, borderRadiusApplication: 'end' as const } },
            stroke: { width: 0 },
            xaxis: {
                categories: serieOrdenes6m.categories,
                axisBorder: { color: paletaGrafica.bordeEje },
                axisTicks: { color: paletaGrafica.bordeEje },
                labels: { style: { colors: paletaGrafica.textoEje } },
            },
            yaxis: { labels: { style: { colors: paletaGrafica.textoEje } } },
        };
    }, [chartCommon, paletaGrafica, serieOrdenes6m.categories]);

    const optionsInventario = React.useMemo(() => {
        return {
            ...chartCommon,
            labels: ['OK', 'Bajo', 'Agotado'],
            // Trío de estado del hook, no `success/warning/error.main` tal cual:
            // en modo claro el ámbar 600 y el rojo 500 quedan a ΔE 8.2 en
            // visión normal —se confunden entre sí incluso sin daltonismo— y
            // aquí van en porciones contiguas de la misma dona.
            colors: [paletaGrafica.estadoOk, paletaGrafica.estadoAdvertencia, paletaGrafica.estadoCritico],
            legend: {
                position: 'bottom' as const,
                fontFamily: 'inherit',
                labels: { colors: paletaGrafica.textoEje },
                markers: { width: 10, height: 10, radius: 3 },
            },
            // Separador entre porciones: tiene que ser el color REAL de la
            // tarjeta en el modo activo, no una variable CSS (Apex lo escribe
            // como atributo `stroke` del SVG y descartaría el valor).
            stroke: { width: 2, colors: [paletaGrafica.superficie] },
            plotOptions: { pie: { donut: { size: '72%' } } },
        };
    }, [chartCommon, paletaGrafica]);

    const actionButtonSx = React.useMemo(() => {
        return {
            borderRadius: 2,
            borderColor: 'divider',
            bgcolor: 'background.paper',
        };
    }, []);

    let topClientesBody: React.ReactNode;
    if (loading) {
        topClientesBody = (
            <Stack spacing={1}>
                {skeletonKeys6.map((key) => (
                    <Skeleton key={key} height={42} />
                ))}
            </Stack>
        );
    } else if (topClientes.length) {
        topClientesBody = (
            <Stack spacing={1}>
                {topClientes.map((c) => (
                    <Box
                        key={c.cliente}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            p: 1.25,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.level1',
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                                {c.cliente}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 0.25 }}>
                                <Chip size="small" variant="outlined" color="primary" label={`Rem: ${formatNumber(c.remisiones)}`} />
                                <Chip size="small" variant="outlined" color="info" label={`Dev: ${formatNumber(c.devoluciones)}`} />
                            </Stack>
                        </Box>
                        <Chip
                            size="small"
                            color="default"
                            label={formatNumber(c.total)}
                            sx={{ fontWeight: 800, bgcolor: 'background.level2' }}
                        />
                    </Box>
                ))}
            </Stack>
        );
    } else {
        topClientesBody = (
            <Typography variant="body2" color="text.secondary">
                Aún no hay actividad para mostrar.
            </Typography>
        );
    }

    let actividadRecienteBody: React.ReactNode;
    if (loading) {
        actividadRecienteBody = (
            <Stack spacing={1}>
                {skeletonKeys6.map((key) => (
                    <Skeleton key={key} height={44} />
                ))}
            </Stack>
        );
    } else if (actividadReciente.length) {
        actividadRecienteBody = (
            <Stack spacing={1}>
                {actividadReciente.map((a) => (
                    <Box
                        key={`${a.tipo}-${a.id}`}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            p: 1.25,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.level1',
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
                            <Chip size="small" label={a.tipo} color={actividadColor(a.tipo)} sx={{ fontWeight: 700 }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    {a.numero}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                    {a.cliente}
                                </Typography>
                                {a.proyecto && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
                                    >
                                        {a.proyecto}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ flex: '0 0 auto' }}>
                            {a.fecha}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        );
    } else {
        actividadRecienteBody = (
            <Typography variant="body2" color="text.secondary">
                Aún no hay actividad registrada para mostrar.
            </Typography>
        );
    }

    return (
        <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                        Panel
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                        {formatDateLongEsCo(now)}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowClockwise fontSize="var(--icon-fontSize-md)" />}
                        onClick={cargar}
                        sx={actionButtonSx}
                    >
                        Actualizar
                    </Button>
                    <Button component={RouterLink} href={paths.dashboard.comercialremisionescrear} variant="contained" startIcon={<Receipt size={18} />}>
                        Crear remisión
                    </Button>
                    <Button component={RouterLink} href={paths.dashboard.comercialdevolucionescrear} variant="contained" color="info" startIcon={<ClipboardText size={18} />}>
                        Crear devolución
                    </Button>
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.comercialordenesdeserviciocrear}
                        variant="contained"
                        color="success"
                        startIcon={<Wrench size={18} />}
                    >
                        Crear órden
                    </Button>
                </Stack>
            </Stack>

            {error ? (
                <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    No fue posible cargar algunas métricas
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {error}
                                </Typography>
                            </Box>
                            <Button variant="contained" onClick={cargar} startIcon={<ArrowClockwise size={18} />}>
                                Reintentar
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            ) : null}

            <Grid container spacing={2}>
                <Grid xs={12} md={3}>
                    <Card sx={kpiCardSx}>
                        <CardContent>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Clientes
                                    </Typography>
                                    {loading ? <Skeleton width={100} height={36} /> : <Typography variant="h4">{formatNumber(clientesCount)}</Typography>}
                                    <Typography variant="caption" color="text.secondary">
                                        Total registrados
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 2,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: 'background.level2',
                                        color: 'primary.main',
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    <Buildings size={26} />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={3}>
                    <Card sx={kpiCardSx}>
                        <CardContent>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Proyectos activos
                                    </Typography>
                                    {loading ? <Skeleton width={120} height={36} /> : <Typography variant="h4">{formatNumber(proyectosActivos)}</Typography>}
                                    <Typography variant="caption" color="text.secondary">
                                        De {formatNumber(proyectosTotal)} proyectos
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 2,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: 'background.level2',
                                        color: 'success.main',
                                        border: '1px solid',
                                        borderColor: 'success.main',
                                    }}
                                >
                                    <ClipboardText size={26} />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={3}>
                    <Card sx={kpiCardSx}>
                        <CardContent>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Operación del mes
                                    </Typography>
                                    {loading ? (
                                        <Skeleton width={160} height={36} />
                                    ) : (
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
                                            <Typography variant="h4">{formatNumber(operacionDelMes.total)}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                movimientos
                                            </Typography>
                                        </Stack>
                                    )}
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                        <Chip size="small" label={`${formatNumber(operacionDelMes.rem)} remisiones`} color="primary" variant="outlined" />
                                        <Chip size="small" label={`${formatNumber(operacionDelMes.dev)} devoluciones`} color="info" variant="outlined" />
                                        <Chip size="small" label={`${formatNumber(operacionDelMes.ord)} órdenes`} color="success" variant="outlined" />
                                    </Stack>
                                </Stack>
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 2,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: 'background.level2',
                                        color: 'info.main',
                                        border: '1px solid',
                                        borderColor: 'info.main',
                                    }}
                                >
                                    <Receipt size={26} />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={3}>
                    <Card sx={kpiCardSx}>
                        <CardContent>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Alertas de inventario
                                    </Typography>
                                    {loading ? <Skeleton width={120} height={36} /> : <Typography variant="h4">{formatNumber(inventarioAlertasCount)}</Typography>}
                                    <Typography variant="caption" color="text.secondary">
                                        Bajo/Agotado en equipos y repuestos
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 2,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: 'background.level2',
                                        color: 'warning.main',
                                        border: '1px solid',
                                        borderColor: 'warning.main',
                                    }}
                                >
                                    <Package size={26} />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid xs={12} lg={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Remisiones vs devoluciones
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Últimos 6 meses
                                    </Typography>
                                </Box>
                                <Button component={RouterLink} href={paths.dashboard.comercialremisionesver} color="inherit" endIcon={<ArrowRight size={18} />} size="small">
                                    Ver remisiones
                                </Button>
                            </Stack>
                            <Box sx={{ mt: 2 }}>
                                {/* `!paletaGrafica.montado` mantiene el placeholder hasta conocer
                                    el modo real: evita pintar una vez con la paleta equivocada. */}
                                {loading || !paletaGrafica.montado ? (
                                    <Skeleton variant="rounded" height={320} />
                                ) : (
                                    <Chart
                                        // Remontar al cambiar de modo: Apex reutiliza el SVG ya
                                        // pintado y no siempre repinta los colores literales.
                                        key={paletaGrafica.modo}
                                        height={320}
                                        type="area"
                                        width="100%"
                                        sx={chartTooltipVars}
                                        options={optionsRemVsDev as any}
                                        series={[
                                            { name: 'Remisiones', data: serieMeses.remisiones },
                                            { name: 'Devoluciones', data: serieMeses.devoluciones },
                                        ]}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Inventario
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Estado general (items)
                                    </Typography>
                                </Box>
                                <Button component={RouterLink} href={paths.dashboard.inventarioequiposstock} color="inherit" endIcon={<ArrowRight size={18} />} size="small">
                                    Ver stock
                                </Button>
                            </Stack>

                            <Box sx={{ mt: 2 }}>
                                {loading || !paletaGrafica.montado ? (
                                    <Skeleton variant="rounded" height={320} />
                                ) : (
                                    <Chart
                                        key={paletaGrafica.modo}
                                        height={320}
                                        type="donut"
                                        width="100%"
                                        sx={chartTooltipVars}
                                        options={optionsInventario as any}
                                        series={[inventarioResumen.OK, inventarioResumen.Bajo, inventarioResumen.Agotado]}
                                    />
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                <Chip size="small" color="success" label={`OK: ${formatNumber(inventarioResumen.OK)}`} />
                                <Chip size="small" color="warning" label={`Bajo: ${formatNumber(inventarioResumen.Bajo)}`} />
                                <Chip size="small" color="error" label={`Agotado: ${formatNumber(inventarioResumen.Agotado)}`} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Órdenes de servicio
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Últimos 6 meses
                                    </Typography>
                                </Box>
                                <Button
                                    component={RouterLink}
                                    href={paths.dashboard.comercialordenesdeserviciover}
                                    color="inherit"
                                    endIcon={<ArrowRight size={18} />}
                                    size="small"
                                >
                                    Ver órdenes
                                </Button>
                            </Stack>
                            <Box sx={{ mt: 2 }}>
                                {loading || !paletaGrafica.montado ? (
                                    <Skeleton variant="rounded" height={320} />
                                ) : (
                                    <Chart
                                        key={paletaGrafica.modo}
                                        height={320}
                                        type="bar"
                                        width="100%"
                                        sx={chartTooltipVars}
                                        options={optionsOrdenes as any}
                                        series={[{ name: 'Órdenes', data: serieOrdenes6m.ordenes }]}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Top clientes
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Por actividad (remisiones + devoluciones)
                                    </Typography>
                                </Box>
                                <Button component={RouterLink} href={paths.dashboard.comercialestadodecuenta} color="inherit" endIcon={<ArrowRight size={18} />} size="small">
                                    Estado de cuenta
                                </Button>
                            </Stack>

                            <Box sx={{ mt: 2 }}>
                                {topClientesBody}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Actividad reciente
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Últimos movimientos registrados
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button component={RouterLink} href={paths.dashboard.comercialremisionesver} color="inherit" size="small">
                                Remisiones
                            </Button>
                            <Button component={RouterLink} href={paths.dashboard.comercialdevolucionesver} color="inherit" size="small">
                                Devoluciones
                            </Button>
                            <Button component={RouterLink} href={paths.dashboard.comercialordenesdeserviciover} color="inherit" size="small">
                                Órdenes
                            </Button>
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {actividadRecienteBody}
                </CardContent>
            </Card>
        </Stack>
    );
}
