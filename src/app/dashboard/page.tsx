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
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowRight, ArrowClockwise, Buildings, ClipboardText, Package, Receipt, Wrench } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import { config } from '@/config';
import { paths } from '@/paths';
import { Chart } from '@/components/core/chart';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ConsultarProyectos } from '@/services/gestionycontrol/proyectos/ConsultarProyectosService';
import {
    ConsultarRemisiones,
    VerActividadRecienteMovimientos,
    VerCantidadRemisionesYDevolucionesUltimos6Meses,
    VerTotalesMovimientosMesActual,
} from '@/services/comercial/remisiones/ConsultarRemisionesService';
import type {
    ActividadRecienteMovimientosResponse,
    CantidadRemisionesDevolucionesUltimos6Meses,
    TotalesMovimientosMesActual,
} from '@/services/comercial/remisiones/ConsultarRemisionesService';
import { VerTodasLasDevoluciones } from '@/services/comercial/devoluciones/VerTodasLasDevolucionesService';
import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
import { VerStockEquipos } from '@/services/inventario/equipos/VerStockEquiposService';
import { VerStockRepuestos } from '@/services/inventario/repuestos/VerStockRepuestosService';

type Proyecto = {
    IdProyecto: number;
    NombreProyecto: string;
    Cliente: string;
    DireccionProyecto: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoProyecto: string;
};

type Remision = {
    IdRemision: number;
    NoRemision: string;
    Cliente: string;
    Proyecto: string;
    CreadoPor: string;
    FechaCreacion: string;
    ObservacionesInternasEmpresa: string;
    EstadoRemision: string;
};

type Devolucion = {
    IdDevolucion: number;
    NoDevolucion: string;
    NoRemision?: string;
    IdRemision: number;
    Cliente: string;
    Proyecto: string;
    CreadoPor: string;
    FechaCreacion: string;
    Estado: string;
};

type OrdenDeServicio = {
    IdOrdenDeServicio: number;
    NoOrdenDeServicio: string;
    Cliente: string;
    Proyecto: string;
    Mecanico: string;
    CreadoPor: string;
    FechaCreacion: string;
    EstadoOrdenDeServicio: string;
};

type StockItem = Record<string, unknown>;

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

function qtyFromStock(item: StockItem): number {
    const candidates = [item.CantidadDisponible, item.Cantidad, item.cantidad, item.stock];
    for (const c of candidates) {
        const n = Number(c);
        if (Number.isFinite(n)) return n;
    }
    return 0;
}

function statusFromQty(qty: number): 'OK' | 'Bajo' | 'Agotado' {
    if (qty <= 0) return 'Agotado';
    if (qty <= 5) return 'Bajo';
    return 'OK';
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
    const theme = useTheme();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [clientesCount, setClientesCount] = React.useState(0);
    const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
    const [remisiones, setRemisiones] = React.useState<Remision[]>([]);
    const [devoluciones, setDevoluciones] = React.useState<Devolucion[]>([]);
    const [ordenes, setOrdenes] = React.useState<OrdenDeServicio[]>([]);
    const [stockEquipos, setStockEquipos] = React.useState<StockItem[]>([]);
    const [stockRepuestos, setStockRepuestos] = React.useState<StockItem[]>([]);
    const [serieRemisionesDevoluciones, setSerieRemisionesDevoluciones] = React.useState<CantidadRemisionesDevolucionesUltimos6Meses | null>(null);
    const [totalesMovimientosMesActual, setTotalesMovimientosMesActual] = React.useState<TotalesMovimientosMesActual | null>(null);
    const [actividadRecienteMovimientos, setActividadRecienteMovimientos] = React.useState<ActividadRecienteMovimientosResponse | null>(null);

    React.useEffect(() => {
        document.title = `Dashboard | ${config.site.name}`;
    }, []);

    const cargar = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                clientes,
                proyectosResp,
                remisionesResp,
                devolucionesResp,
                ordenesResp,
                stockEquiposResp,
                stockRepuestosResp,
            ] = await Promise.all([
                ListarClientes(),
                ConsultarProyectos(),
                ConsultarRemisiones(),
                VerTodasLasDevoluciones(),
                VerTodasLasOrdenesDeServicio(),
                VerStockEquipos(),
                VerStockRepuestos(),
            ]);

            let serieRemDevResp: unknown = null;
            try {
                serieRemDevResp = await VerCantidadRemisionesYDevolucionesUltimos6Meses();
            } catch {
                serieRemDevResp = null;
            }

            let totalesMesResp: unknown = null;
            try {
                totalesMesResp = await VerTotalesMovimientosMesActual();
            } catch {
                totalesMesResp = null;
            }

            let actividadRecienteResp: unknown = null;
            try {
                actividadRecienteResp = await VerActividadRecienteMovimientos(10);
            } catch {
                actividadRecienteResp = null;
            }

            setClientesCount(Array.isArray(clientes) ? clientes.length : 0);
            setProyectos(Array.isArray(proyectosResp) ? proyectosResp : []);
            setRemisiones(Array.isArray(remisionesResp) ? remisionesResp : []);
            setSerieRemisionesDevoluciones(
                serieRemDevResp && typeof serieRemDevResp === 'object' && Array.isArray((serieRemDevResp as any).Meses)
                    ? (serieRemDevResp as CantidadRemisionesDevolucionesUltimos6Meses)
                    : null
            );
            setTotalesMovimientosMesActual(
                totalesMesResp && typeof totalesMesResp === 'object' && (totalesMesResp as any).Totales && typeof (totalesMesResp as any).TotalMovimientos === 'number'
                    ? (totalesMesResp as TotalesMovimientosMesActual)
                    : null
            );
            setActividadRecienteMovimientos(
                actividadRecienteResp &&
                    typeof actividadRecienteResp === 'object' &&
                    Array.isArray((actividadRecienteResp as any).Movimientos) &&
                    typeof (actividadRecienteResp as any).Limite === 'number'
                    ? (actividadRecienteResp as ActividadRecienteMovimientosResponse)
                    : null
            );
            setDevoluciones(Array.isArray(devolucionesResp) ? devolucionesResp : []);
            setOrdenes(Array.isArray(ordenesResp) ? ordenesResp : []);
            setStockEquipos(Array.isArray(stockEquiposResp) ? stockEquiposResp : []);
            setStockRepuestos(Array.isArray(stockRepuestosResp) ? stockRepuestosResp : []);
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
    const inicioMes = now.startOf('month');

    const proyectosActivos = React.useMemo(() => {
        return proyectos.filter((p) => String(p.EstadoProyecto ?? '').toLowerCase() === 'activo').length;
    }, [proyectos]);

    const remisionesMes = React.useMemo(() => {
        return remisiones.filter((r) => {
            const d = parseDate(r.FechaCreacion);
            return d ? d.isSame(inicioMes, 'month') : false;
        }).length;
    }, [remisiones, inicioMes]);

    const devolucionesMes = React.useMemo(() => {
        return devoluciones.filter((d) => {
            const dd = parseDate(d.FechaCreacion);
            return dd ? dd.isSame(inicioMes, 'month') : false;
        }).length;
    }, [devoluciones, inicioMes]);

    const ordenesMes = React.useMemo(() => {
        return ordenes.filter((o) => {
            const d = parseDate(o.FechaCreacion);
            return d ? d.isSame(inicioMes, 'month') : false;
        }).length;
    }, [ordenes, inicioMes]);

    const operacionDelMes = React.useMemo(() => {
        const totales = totalesMovimientosMesActual?.Totales;
        const rem = typeof totales?.CantidadRemisiones === 'number' ? totales.CantidadRemisiones : remisionesMes;
        const dev = typeof totales?.CantidadDevoluciones === 'number' ? totales.CantidadDevoluciones : devolucionesMes;
        const ord = typeof totales?.CantidadOrdenesDeServicio === 'number' ? totales.CantidadOrdenesDeServicio : ordenesMes;
        const total = typeof totalesMovimientosMesActual?.TotalMovimientos === 'number' ? totalesMovimientosMesActual.TotalMovimientos : remisionesMes + devolucionesMes + ordenesMes;
        return { total, rem, dev, ord };
    }, [devolucionesMes, ordenesMes, remisionesMes, totalesMovimientosMesActual]);

    const inventarioResumen = React.useMemo(() => {
        const items = [...stockEquipos, ...stockRepuestos];
        const counts: Record<'OK' | 'Bajo' | 'Agotado', number> = { OK: 0, Bajo: 0, Agotado: 0 };
        for (const item of items) {
            const qty = qtyFromStock(item);
            const status = statusFromQty(qty);
            counts[status] += 1;
        }
        return counts;
    }, [stockEquipos, stockRepuestos]);

    const inventarioAlertasCount = inventarioResumen.Bajo + inventarioResumen.Agotado;

    const serieMeses = React.useMemo(() => {
        const ordMap = new Map<string, number>();
        ordenes.forEach((r) => {
            const d = parseDate(r.FechaCreacion);
            if (!d) return;
            const key = monthKey(d);
            ordMap.set(key, (ordMap.get(key) ?? 0) + 1);
        });

        const mesesApi = serieRemisionesDevoluciones?.Meses;
        if (Array.isArray(mesesApi) && mesesApi.length) {
            const sorted = [...mesesApi].sort((a, b) => String(a.Mes).localeCompare(String(b.Mes)));
            const categories = sorted.map((m) => String(m.Etiqueta ?? m.Mes));
            const remData = sorted.map((m) => Number(m.CantidadRemisiones ?? 0));
            const devData = sorted.map((m) => Number(m.CantidadDevoluciones ?? 0));
            const ordDataFromApi = sorted.map((m) => Number(m.CantidadOrdenesDeServicio ?? 0));
            const apiMonthKeys = sorted.map((m) => normalizeMonthKey(m.Mes));
            const ordDataFromOrders = apiMonthKeys.map((k) => (k ? (ordMap.get(k) ?? 0) : 0));

            const apiHasValidOrders = ordDataFromApi.every((n) => Number.isFinite(n));
            const apiHasNonZeroOrders = ordDataFromApi.some((n) => Number.isFinite(n) && n > 0);
            const ordersHaveNonZero = ordDataFromOrders.some((n) => n > 0);

            const ordData = apiHasValidOrders && apiHasNonZeroOrders ? ordDataFromApi : ordersHaveNonZero ? ordDataFromOrders : ordDataFromApi;
            return { categories, remisiones: remData, devoluciones: devData, ordenes: ordData };
        }

        const meses = Array.from({ length: 6 }).map((_, idx) => now.subtract(5 - idx, 'month').startOf('month'));
        const cats = meses.map(monthLabel);

        const remMap = new Map<string, number>();
        remisiones.forEach((r) => {
            const d = parseDate(r.FechaCreacion);
            if (!d) return;
            const key = monthKey(d);
            remMap.set(key, (remMap.get(key) ?? 0) + 1);
        });

        const devMap = new Map<string, number>();
        devoluciones.forEach((r) => {
            const d = parseDate(r.FechaCreacion);
            if (!d) return;
            const key = monthKey(d);
            devMap.set(key, (devMap.get(key) ?? 0) + 1);
        });

        const remData = meses.map((m) => remMap.get(monthKey(m)) ?? 0);
        const devData = meses.map((m) => devMap.get(monthKey(m)) ?? 0);
        const ordData = meses.map((m) => ordMap.get(monthKey(m)) ?? 0);

        return { categories: cats, remisiones: remData, devoluciones: devData, ordenes: ordData };
    }, [devoluciones, now, ordenes, remisiones, serieRemisionesDevoluciones]);

    const serieOrdenes6m = React.useMemo(() => {
        const meses = Array.from({ length: 6 }).map((_, idx) => now.subtract(5 - idx, 'month').startOf('month'));
        const monthKeys = meses.map(monthKey);
        const categories = meses.map(monthLabel);

        const ordMap = new Map<string, number>();
        ordenes.forEach((o) => {
            const d = parseDate(o.FechaCreacion);
            if (!d) return;
            const key = monthKey(d);
            ordMap.set(key, (ordMap.get(key) ?? 0) + 1);
        });
        const ordFromOrders = monthKeys.map((k) => ordMap.get(k) ?? 0);

        const mesesApi = serieRemisionesDevoluciones?.Meses;
        if (Array.isArray(mesesApi) && mesesApi.length) {
            const apiMap = new Map<string, number>();
            mesesApi.forEach((m) => {
                const k = normalizeMonthKey(m.Mes);
                if (!k) return;
                apiMap.set(k, Number(m.CantidadOrdenesDeServicio ?? 0));
            });
            const ordFromApi = monthKeys.map((k) => apiMap.get(k) ?? 0);
            const apiHasNonZero = ordFromApi.some((n) => Number.isFinite(n) && n > 0);
            return { categories, ordenes: apiHasNonZero ? ordFromApi : ordFromOrders };
        }

        return { categories, ordenes: ordFromOrders };
    }, [now, ordenes, serieRemisionesDevoluciones]);

    const topClientes = React.useMemo(() => {
        const map = new Map<string, { remisiones: number; devoluciones: number }>();
        for (const r of remisiones) {
            const key = String(r.Cliente ?? 'Sin cliente');
            const prev = map.get(key) ?? { remisiones: 0, devoluciones: 0 };
            map.set(key, { ...prev, remisiones: prev.remisiones + 1 });
        }
        for (const d of devoluciones) {
            const key = String(d.Cliente ?? 'Sin cliente');
            const prev = map.get(key) ?? { remisiones: 0, devoluciones: 0 };
            map.set(key, { ...prev, devoluciones: prev.devoluciones + 1 });
        }
        return Array.from(map.entries())
            .map(([cliente, v]) => ({ cliente, ...v, total: v.remisiones + v.devoluciones }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 6);
    }, [remisiones, devoluciones]);

    const actividadRecienteFallback = React.useMemo(() => {
        const rem = remisiones
            .map((r) => ({
                tipo: 'Remisión' as const,
                id: r.IdRemision,
                numero: r.NoRemision,
                cliente: r.Cliente,
                proyecto: r.Proyecto,
                creadoPor: r.CreadoPor,
                estado: r.EstadoRemision,
                fecha: r.FechaCreacion
            }))
            .filter((x) => Boolean(parseDate(x.fecha)))
            .sort((a, b) => (parseDate(b.fecha)!.valueOf() - parseDate(a.fecha)!.valueOf()))
            .slice(0, 5);

        const dev = devoluciones
            .map((d) => ({
                tipo: 'Devolución' as const,
                id: d.IdDevolucion,
                numero: d.NoDevolucion,
                cliente: d.Cliente,
                proyecto: d.Proyecto,
                creadoPor: d.CreadoPor,
                estado: d.Estado,
                fecha: d.FechaCreacion
            }))
            .filter((x) => Boolean(parseDate(x.fecha)))
            .sort((a, b) => (parseDate(b.fecha)!.valueOf() - parseDate(a.fecha)!.valueOf()))
            .slice(0, 5);

        const ord = ordenes
            .map((o) => ({
                tipo: 'Órden' as const,
                id: o.IdOrdenDeServicio,
                numero: o.NoOrdenDeServicio,
                cliente: o.Cliente,
                proyecto: o.Proyecto,
                creadoPor: o.CreadoPor,
                estado: o.EstadoOrdenDeServicio,
                fecha: o.FechaCreacion
            }))
            .filter((x) => Boolean(parseDate(x.fecha)))
            .sort((a, b) => (parseDate(b.fecha)!.valueOf() - parseDate(a.fecha)!.valueOf()))
            .slice(0, 5);

        return [...rem, ...dev, ...ord].sort((a, b) => (parseDate(b.fecha)!.valueOf() - parseDate(a.fecha)!.valueOf())).slice(0, 10);
    }, [remisiones, devoluciones, ordenes]);

    const actividadReciente = React.useMemo(() => {
        const movimientos = actividadRecienteMovimientos?.Movimientos;
        if (Array.isArray(movimientos) && movimientos.length) {
            return movimientos.map((m: any) => {
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
        }

        return actividadRecienteFallback;
    }, [actividadRecienteFallback, actividadRecienteMovimientos]);

    const kpiCardSx = React.useMemo(() => {
        return {
            height: '100%',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
        };
    }, []);

    const chartCommon = React.useMemo(() => {
        return {
            chart: { background: 'transparent', toolbar: { show: false }, zoom: { enabled: false } },
            dataLabels: { enabled: false },
            grid: { borderColor: theme.palette.divider, strokeDashArray: 2 },
            stroke: { width: 3, curve: 'smooth' as const },
            theme: { mode: theme.palette.mode },
            tooltip: { theme: theme.palette.mode },
        };
    }, [theme.palette.divider, theme.palette.mode]);

    const optionsRemVsDev = React.useMemo(() => {
        return {
            ...chartCommon,
            colors: [theme.palette.primary.main, theme.palette.info.main],
            xaxis: { categories: serieMeses.categories, labels: { style: { colors: theme.palette.text.secondary } } },
            yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
            fill: { type: 'gradient', gradient: { shadeIntensity: 0.2, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] } },
        };
    }, [chartCommon, serieMeses.categories, theme.palette.info.main, theme.palette.primary.main, theme.palette.text.secondary]);

    const optionsOrdenes = React.useMemo(() => {
        return {
            ...chartCommon,
            colors: [theme.palette.success.main],
            plotOptions: { bar: { columnWidth: '42px', borderRadius: 6 } },
            stroke: { width: 0 },
            xaxis: { categories: serieOrdenes6m.categories, labels: { style: { colors: theme.palette.text.secondary } } },
            yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
        };
    }, [chartCommon, serieOrdenes6m.categories, theme.palette.success.main, theme.palette.text.secondary]);

    const optionsInventario = React.useMemo(() => {
        return {
            ...chartCommon,
            labels: ['OK', 'Bajo', 'Agotado'],
            colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
            legend: { position: 'bottom' as const, labels: { colors: theme.palette.text.secondary } },
            stroke: { width: 2, colors: [theme.palette.background.paper] },
            plotOptions: { pie: { donut: { size: '72%' } } },
        };
    }, [chartCommon, theme.palette.background.paper, theme.palette.error.main, theme.palette.success.main, theme.palette.text.secondary, theme.palette.warning.main]);

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
                                        De {formatNumber(proyectos.length)} proyectos
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
                                {loading ? (
                                    <Skeleton variant="rounded" height={320} />
                                ) : (
                                    <Chart
                                        height={320}
                                        type="area"
                                        width="100%"
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
                                {loading ? (
                                    <Skeleton variant="rounded" height={320} />
                                ) : (
                                    <Chart
                                        height={320}
                                        type="donut"
                                        width="100%"
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
                                {loading ? (
                                    <Skeleton variant="rounded" height={320} />
                                ) : (
                                    <Chart
                                        height={320}
                                        type="bar"
                                        width="100%"
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
