'use client';
import { useEffect, useState, useMemo } from 'react';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import {
    Chip,
    SelectChangeEvent,
    Card,
    CardContent,
    Box,
    Typography,
    Stack,
    Button,
    useTheme,
    Paper
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FilePdf, Buildings, Wrench, CheckCircle, Clock } from '@phosphor-icons/react';
import { VerEstadoDeCuentaCliente } from '@/services/comercial/estado_de_cuenta/VerEstadoDeCuentaClienteService';
import { InformeClienteEquiposEnObra } from '@/services/comercial/estado_de_cuenta/InformeClienteEquiposEnObraService';
import { InformeInternoEmpresaEquiposEnObra } from '@/services/comercial/estado_de_cuenta/InformeInternoEmpresaEquiposEnObraService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { OpcionPorDefecto } from '@/lib/constants/option-default';
import dayjs from 'dayjs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface EstadoDeCuenta {
    IdDetalleRemison?: number;
    IdProyecto?: number | string;
    Cliente: string;
    DocumentoCliente: string;
    NoRemision: string;
    FechaRemision: string;
    FechaUltimaDevolucion?: string;
    Proyecto: string;
    Categoria: string;
    Equipo: string;
    CantidadPrestada: number | string;
    CantidadDevuelta: number | string;
    CantidadPendiente: number | string;
    TiempoPrestamo: string;
    EstadoDevolucion: string;
    ValorPendiente: number | string;
    PrecioUnitario: number | string;
}

export function TablaVisualizarEstadoDeCuenta(): JSX.Element {
    const theme = useTheme();
    const [data, setData] = useState<EstadoDeCuenta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientes, setClientes] = useState<{ value: string | number; label: string }[]>([]);
    const [pdfLoading, setPdfLoading] = useState<'cliente' | 'interno' | null>(null);

    // Filtros
    const [datos, setDatos] = useState({
        Cliente: OpcionPorDefecto.value,
        Proyecto: 'Todos',
        Equipo: 'Todos'
    });

    // Opciones dinámicas para filtros
    const [opcionesProyectos, setOpcionesProyectos] = useState<{ value: string | number; label: string }[]>([]);
    const [opcionesEquipos, setOpcionesEquipos] = useState<{ value: string | number; label: string }[]>([]);

    useEffect(() => {
        const CargarClientes = async () => {
            try {
                const respuesta = await ListarClientes();
                respuesta.unshift(OpcionPorDefecto);
                setClientes(respuesta);
            } catch (error) {
                console.error(`Error al listar los clientes: ${error}`);
            }
        };
        CargarClientes();
    }, []);

    // Cargar data principal al seleccionar cliente
    useEffect(() => {
        if (datos.Cliente !== OpcionPorDefecto.value) {
            handleRefresh();
        } else {
            setData([]);
            setOpcionesProyectos([]);
            setOpcionesEquipos([]);
        }
    }, [datos.Cliente]);

    // Actualizar opciones de filtros basadas en la data cargada
    useEffect(() => {
        if (data.length > 0) {
            const proyectosUnicos = Array.from(
                new Map(
                    data
                        .filter(item => Boolean(item.Proyecto))
                        .map(item => [
                            String(item.IdProyecto ?? item.Proyecto),
                            { id: item.IdProyecto, nombre: item.Proyecto },
                        ])
                ).values()
            ).sort((a, b) => a.nombre.localeCompare(b.nombre));

            setOpcionesProyectos([
                { value: 'Todos', label: 'Todos los Proyectos' },
                ...proyectosUnicos.map(p => ({ value: p.id ?? p.nombre, label: p.nombre }))
            ]);

            // Extraer equipos únicos
            const equiposUnicos = Array.from(new Set(data.map(item => item.Equipo).filter(Boolean))).sort();
            setOpcionesEquipos([
                { value: 'Todos', label: 'Todos los Equipos' },
                ...equiposUnicos.map(e => ({ value: e, label: e }))
            ]);
        }
    }, [data]);

    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const handleRefresh = async () => {
        if (datos.Cliente === OpcionPorDefecto.value) return;

        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            // Resetear filtros secundarios al cambiar cliente
            setDatos(prev => ({ ...prev, Proyecto: 'Todos', Equipo: 'Todos' }));

            const response = await VerEstadoDeCuentaCliente(String(datos.Cliente));
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const sameValue = (a: string | number, b: string | number) => String(a) === String(b);

    // Filtrado de datos en memoria
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchProyecto = datos.Proyecto === 'Todos'
                || (item.IdProyecto !== undefined && sameValue(item.IdProyecto, datos.Proyecto))
                || item.Proyecto === datos.Proyecto;
            const matchEquipo = datos.Equipo === 'Todos' || item.Equipo === datos.Equipo;
            return matchProyecto && matchEquipo;
        });
    }, [data, datos.Proyecto, datos.Equipo]);

    // Cálculos para las Cards de Resumen
    const resumen = useMemo(() => {
        return filteredData.reduce((acc, curr) => ({
            totalPrestado: acc.totalPrestado + Number(curr.CantidadPrestada || 0),
            totalDevuelto: acc.totalDevuelto + Number(curr.CantidadDevuelta || 0),
            totalPendiente: acc.totalPendiente + Number(curr.CantidadPendiente || 0),
            valorPendiente: acc.valorPendiente + Number(curr.ValorPendiente || 0)
        }), { totalPrestado: 0, totalDevuelto: 0, totalPendiente: 0, valorPendiente: 0 });
    }, [filteredData]);

    const getEstadoColor = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case 'completo': return 'success';
            case 'pendiente': return 'warning';
            case 'cancelada': return 'error';
            case 'en proceso': return 'info';
            case 'creado': return 'info';
            default: return 'default';
        }
    };

    type InformeRow = Record<string, unknown>;

    const safeText = (value: unknown) => (value === null || value === undefined ? '' : String(value));

    const pickFirst = (row: InformeRow, keys: string[]) => {
        for (const key of keys) {
            const value = row[key];
            if (value !== null && value !== undefined && String(value).trim() !== '') return value;
        }
        return undefined;
    };

    const toNumber = (value: unknown) => {
        const n = typeof value === 'number' ? value : Number(String(value).replaceAll(',', '.'));
        return Number.isFinite(n) ? n : 0;
    };

    const formatInt = (value: unknown) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(toNumber(value));

    const formatMoney = (value: unknown) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(toNumber(value));

    const truncate = (text: string, maxWidth: number, font: any, fontSize: number) => {
        if (font.widthOfTextAtSize(text, fontSize) <= maxWidth) return text;
        const ellipsis = '…';
        let left = 0;
        let right = text.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            const candidate = text.slice(0, mid) + ellipsis;
            if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) left = mid + 1;
            else right = mid;
        }
        return text.slice(0, Math.max(0, left - 1)) + ellipsis;
    };

    const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
        if (bytes.buffer instanceof ArrayBuffer) {
            return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        }

        const copy = new Uint8Array(bytes.byteLength);
        copy.set(bytes);
        return copy.buffer;
    };

    const downloadBytesAsPdf = (pdfBytes: Uint8Array, filename: string) => {
        const blob = new Blob([toArrayBuffer(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const generatePdfFromInforme = async (tipo: 'cliente' | 'interno', rows: InformeRow[]) => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const pageWidth = 841.89;
        const pageHeight = 595.28;

        const now = dayjs();
        const clienteLabel = clientes.find(c => sameValue(c.value, datos.Cliente))?.label ?? '';
        const proyectoLabel = datos.Proyecto === 'Todos'
            ? 'Todos'
            : (opcionesProyectos.find(p => sameValue(p.value, datos.Proyecto))?.label ?? safeText(datos.Proyecto));

        const isGroupedByProyecto = rows.some(r => Array.isArray((r as any)?.Equipos));

        const flatRows: InformeRow[] = isGroupedByProyecto
            ? rows.flatMap(group => {
                const equipos = Array.isArray((group as any)?.Equipos) ? ((group as any).Equipos as unknown[]) : [];
                return equipos.map((equipo): InformeRow => ({
                    DocumentoCliente: pickFirst(group, ['DocumentoCliente']) ?? pickFirst(equipo as any, ['DocumentoCliente']),
                    IdProyecto: pickFirst(group, ['IdProyecto']) ?? pickFirst(equipo as any, ['IdProyecto']),
                    Proyecto: pickFirst(group, ['Proyecto', 'NombreProyecto', 'Obra']) ?? pickFirst(equipo as any, ['Proyecto', 'NombreProyecto', 'Obra']),
                    DireccionProyecto: pickFirst(group, ['DireccionProyecto', 'DirecciónProyecto', 'Direccion', 'Dirección']) ?? pickFirst(equipo as any, ['DireccionProyecto', 'DirecciónProyecto', 'Direccion', 'Dirección']),
                    IdEquipo: pickFirst(equipo as any, ['IdEquipo', 'IdEquipoCliente']),
                    Equipo: pickFirst(equipo as any, ['Equipo', 'NombreEquipo', 'DescripcionEquipo']),
                    Categoria: pickFirst(equipo as any, ['Categoria', 'Categoría', 'CategoriaEquipo']),
                    Subarrendatario: pickFirst(equipo as any, ['Subarrendatario', 'SubArrendatario', 'NombreSubarrendatario']),
                    DocumentoSubarrendatario: pickFirst(equipo as any, ['DocumentoSubarrendatario', 'DocumentoSubArrendatario']),
                    CantidadPrestada: pickFirst(equipo as any, ['CantidadPrestada', 'Prestada', 'Cantidad']),
                    CantidadDevuelta: pickFirst(equipo as any, ['CantidadDevuelta', 'Devuelta']),
                    CantidadEnObra: pickFirst(equipo as any, ['CantidadEnObra', 'EnObra', 'CantidadPendiente', 'Pendiente']),
                    PrecioUnitario: pickFirst(equipo as any, ['PrecioUnitario', 'precioUnitario', 'Precio', 'precio']),
                    ValorPendiente: pickFirst(equipo as any, ['ValorPendiente', 'valorPendiente', 'Valor', 'valor']),
                    TiempoPrestamo: pickFirst(equipo as any, ['TiempoPrestamo', 'tiempoPrestamo', 'Tiempo', 'tiempo']),
                }));
            })
            : rows;

        const sortedRows = [...flatRows].sort((a, b) => {
            const proyectoA = safeText(pickFirst(a, ['Proyecto'])).toLowerCase();
            const proyectoB = safeText(pickFirst(b, ['Proyecto'])).toLowerCase();
            if (proyectoA !== proyectoB) return proyectoA.localeCompare(proyectoB);
            const equipoA = safeText(pickFirst(a, ['Equipo'])).toLowerCase();
            const equipoB = safeText(pickFirst(b, ['Equipo'])).toLowerCase();
            return equipoA.localeCompare(equipoB);
        });

        let lastProyectoKey = '';
        const printableRows = sortedRows.map(r => {
            if (!isGroupedByProyecto) return r;
            const key = safeText(pickFirst(r, ['IdProyecto', 'Proyecto']));
            const out: InformeRow = { ...r };
            if (key && key === lastProyectoKey) {
                out.IdProyecto = '';
                out.Proyecto = '';
                out.DireccionProyecto = '';
            } else {
                lastProyectoKey = key;
            }
            return out;
        });

        const hasValor = printableRows.some(r => pickFirst(r, ['ValorPendiente', 'valorPendiente', 'Valor', 'valor']) !== undefined);
        const hasPrecio = printableRows.some(r => pickFirst(r, ['PrecioUnitario', 'precioUnitario', 'Precio', 'precio']) !== undefined);
        const hasTiempo = printableRows.some(r => pickFirst(r, ['TiempoPrestamo', 'tiempoPrestamo', 'Tiempo', 'tiempo']) !== undefined);
        const hasSubarrendatario = printableRows.some(r => pickFirst(r, ['Subarrendatario', 'DocumentoSubarrendatario']) !== undefined);

        const columns = isGroupedByProyecto
            ? [
                { label: 'ID PROY', width: 60, align: 'right' as const, get: (r: InformeRow) => safeText(pickFirst(r, ['IdProyecto'])) },
                { label: 'PROYECTO', width: 150, get: (r: InformeRow) => safeText(pickFirst(r, ['Proyecto'])) },
                { label: 'DIRECCIÓN', width: 150, get: (r: InformeRow) => safeText(pickFirst(r, ['DireccionProyecto'])) },
                { label: 'ID EQ', width: 55, align: 'right' as const, get: (r: InformeRow) => safeText(pickFirst(r, ['IdEquipo'])) },
                { label: 'EQUIPO', width: 150, get: (r: InformeRow) => safeText(pickFirst(r, ['Equipo'])) },
                { label: 'CATEGORÍA', width: 90, get: (r: InformeRow) => safeText(pickFirst(r, ['Categoria'])) },
                ...(tipo === 'interno' && hasSubarrendatario ? [
                    { label: 'DOC SUB', width: 70, get: (r: InformeRow) => safeText(pickFirst(r, ['DocumentoSubarrendatario'])) },
                    { label: 'SUBARREND.', width: 120, get: (r: InformeRow) => safeText(pickFirst(r, ['Subarrendatario'])) },
                ] : []),
                { label: 'PREST.', width: 58, align: 'right' as const, get: (r: InformeRow) => formatInt(pickFirst(r, ['CantidadPrestada'])) },
                { label: 'DEV.', width: 50, align: 'right' as const, get: (r: InformeRow) => formatInt(pickFirst(r, ['CantidadDevuelta'])) },
                { label: 'EN OBRA', width: 62, align: 'right' as const, get: (r: InformeRow) => formatInt(pickFirst(r, ['CantidadEnObra'])) },
                ...(hasTiempo ? [{ label: 'TIEMPO', width: 70, get: (r: InformeRow) => safeText(pickFirst(r, ['TiempoPrestamo'])) }] : []),
                ...(tipo === 'interno' && hasPrecio ? [{
                    label: 'P. UNIT',
                    width: 80,
                    align: 'right' as const,
                    get: (r: InformeRow) => formatMoney(pickFirst(r, ['PrecioUnitario'])),
                }] : []),
                ...(tipo === 'interno' && hasValor ? [{
                    label: 'V. PEND',
                    width: 86,
                    align: 'right' as const,
                    get: (r: InformeRow) => formatMoney(pickFirst(r, ['ValorPendiente'])),
                }] : []),
            ]
            : [
                { label: 'REMISIÓN', width: 78, get: (r: InformeRow) => safeText(pickFirst(r, ['NoRemision', 'NoRemisión', 'Remision', 'Remisión'])) },
                { label: 'FECHA', width: 70, get: (r: InformeRow) => safeText(pickFirst(r, ['FechaRemision', 'Fecha', 'FechaPréstamo', 'FechaPrestamo'])) },
                { label: 'PROYECTO', width: 150, get: (r: InformeRow) => safeText(pickFirst(r, ['Proyecto', 'NombreProyecto', 'Obra'])) },
                { label: 'EQUIPO', width: 190, get: (r: InformeRow) => safeText(pickFirst(r, ['Equipo', 'NombreEquipo', 'DescripcionEquipo'])) },
                { label: 'CATEGORÍA', width: 120, get: (r: InformeRow) => safeText(pickFirst(r, ['Categoria', 'Categoría', 'CategoriaEquipo'])) },
                { label: 'PEND.', width: 52, align: 'right' as const, get: (r: InformeRow) => formatInt(pickFirst(r, ['CantidadPendiente', 'Pendiente', 'Cantidad', 'cantidad'])) },
                ...(hasTiempo ? [{ label: 'TIEMPO', width: 70, get: (r: InformeRow) => safeText(pickFirst(r, ['TiempoPrestamo', 'tiempoPrestamo', 'Tiempo', 'tiempo'])) }] : []),
                ...(tipo === 'interno' && hasPrecio ? [{
                    label: 'P. UNIT',
                    width: 80,
                    align: 'right' as const,
                    get: (r: InformeRow) => formatMoney(pickFirst(r, ['PrecioUnitario', 'precioUnitario', 'Precio', 'precio'])),
                }] : []),
                ...(tipo === 'interno' && hasValor ? [{
                    label: 'V. PEND',
                    width: 86,
                    align: 'right' as const,
                    get: (r: InformeRow) => formatMoney(pickFirst(r, ['ValorPendiente', 'valorPendiente', 'Valor', 'valor'])),
                }] : []),
            ];

        const marginX = 36;
        const marginBottom = 28;
        const headerHeight = 68;
        const metaHeight = 48;
        const tableHeaderHeight = 22;
        const rowHeight = 18;

        const tableX = marginX;
        const tableWidth = pageWidth - marginX * 2;
        const scaleFactor = tableWidth / columns.reduce((sum, c) => sum + c.width, 0);
        const scaledColumns = columns.map(c => ({ ...c, width: Math.floor(c.width * scaleFactor) }));
        const scaledTotal = scaledColumns.reduce((sum, c) => sum + c.width, 0);
        if (scaledColumns.length > 0 && scaledTotal !== tableWidth) {
            scaledColumns[scaledColumns.length - 1] = {
                ...scaledColumns[scaledColumns.length - 1]!,
                width: scaledColumns[scaledColumns.length - 1]!.width + (tableWidth - scaledTotal),
            };
        }

        const usableHeight = pageHeight - headerHeight - metaHeight - marginBottom - 10;
        const rowsPerPage = Math.max(1, Math.floor((usableHeight - tableHeaderHeight) / rowHeight));
        const totalPages = Math.max(1, Math.ceil(printableRows.length / rowsPerPage));

        const primary = rgb(0.08, 0.21, 0.43);
        const headerTextColor = rgb(1, 1, 1);
        const gridColor = rgb(0.87, 0.89, 0.92);
        const muted = rgb(0.35, 0.38, 0.45);

        const sumPendiente = printableRows.reduce((acc, r) => acc + toNumber(pickFirst(r, ['CantidadPendiente', 'Pendiente', 'Cantidad', 'cantidad'])), 0);
        const sumValorPendiente = printableRows.reduce((acc, r) => acc + toNumber(pickFirst(r, ['ValorPendiente', 'valorPendiente', 'Valor', 'valor'])), 0);
        const sumPrestada = printableRows.reduce((acc, r) => acc + toNumber(pickFirst(r, ['CantidadPrestada'])), 0);
        const sumDevuelta = printableRows.reduce((acc, r) => acc + toNumber(pickFirst(r, ['CantidadDevuelta'])), 0);
        const sumEnObra = printableRows.reduce((acc, r) => acc + toNumber(pickFirst(r, ['CantidadEnObra', 'CantidadPendiente', 'Pendiente'])), 0);

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            page.drawRectangle({ x: 0, y: pageHeight - headerHeight, width: pageWidth, height: headerHeight, color: primary });

            const title = tipo === 'cliente' ? 'INFORME CLIENTE - EQUIPOS EN OBRA' : 'INFORME INTERNO - EQUIPOS EN OBRA';
            page.drawText(title, {
                x: marginX,
                y: pageHeight - 40,
                size: 16,
                font: fontBold,
                color: headerTextColor,
            });

            page.drawText(`Generado: ${now.format('YYYY-MM-DD HH:mm')}`, {
                x: pageWidth - marginX - 200,
                y: pageHeight - 40,
                size: 10,
                font,
                color: headerTextColor,
            });

            const metaY = pageHeight - headerHeight - 18;
            page.drawText(`Cliente: ${clienteLabel}`, { x: marginX, y: metaY, size: 11, font: fontBold, color: rgb(0, 0, 0) });
            page.drawText(`Documento: ${safeText(datos.Cliente)}`, { x: marginX, y: metaY - 16, size: 10, font, color: muted });
            page.drawText(`Proyecto: ${proyectoLabel}`, { x: pageWidth - marginX - 320, y: metaY, size: 10, font, color: muted });
            page.drawText(`Registros: ${printableRows.length}`, { x: pageWidth - marginX - 320, y: metaY - 16, size: 10, font, color: muted });

            const tableTopY = pageHeight - headerHeight - metaHeight;
            const tableY = tableTopY - tableHeaderHeight;

            page.drawRectangle({ x: tableX, y: tableY, width: tableWidth, height: tableHeaderHeight, color: rgb(0.95, 0.96, 0.98) });
            page.drawRectangle({ x: tableX, y: tableY, width: tableWidth, height: tableHeaderHeight, borderColor: gridColor, borderWidth: 1 });

            let colX = tableX;
            for (const col of scaledColumns) {
                page.drawText(col.label, {
                    x: colX + 6,
                    y: tableY + 7,
                    size: 9,
                    font: fontBold,
                    color: rgb(0.18, 0.2, 0.25),
                });
                colX += col.width;
                page.drawLine({ start: { x: colX, y: tableY }, end: { x: colX, y: tableY + tableHeaderHeight }, thickness: 1, color: gridColor });
            }

            const start = pageIndex * rowsPerPage;
            const end = Math.min(printableRows.length, start + rowsPerPage);
            let rowY = tableY - rowHeight;

            for (let i = start; i < end; i++) {
                const row = printableRows[i]!;
                const isEven = (i - start) % 2 === 0;

                page.drawRectangle({
                    x: tableX,
                    y: rowY,
                    width: tableWidth,
                    height: rowHeight,
                    color: isEven ? rgb(1, 1, 1) : rgb(0.985, 0.99, 1),
                    borderColor: gridColor,
                    borderWidth: 1,
                });

                let cellX = tableX;
                for (const col of scaledColumns) {
                    const raw = col.get(row);
                    const value = truncate(raw, col.width - 12, font, 9);
                    const align = 'align' in col ? col.align : 'left';
                    const textWidth = font.widthOfTextAtSize(value, 9);
                    const textX = align === 'right' ? cellX + col.width - 6 - textWidth : cellX + 6;
                    page.drawText(value, { x: textX, y: rowY + 5, size: 9, font, color: rgb(0.1, 0.12, 0.16) });
                    cellX += col.width;
                    page.drawLine({ start: { x: cellX, y: rowY }, end: { x: cellX, y: rowY + rowHeight }, thickness: 1, color: gridColor });
                }

                rowY -= rowHeight;
            }

            const footerY = marginBottom - 10;
            page.drawText(`Página ${pageIndex + 1} de ${totalPages}`, {
                x: marginX,
                y: footerY,
                size: 9,
                font,
                color: muted,
            });

            if (pageIndex === totalPages - 1) {
                const groupedTotals = tipo === 'interno'
                    ? (hasValor
                        ? `Totales: Prest. ${formatInt(sumPrestada)} | Dev. ${formatInt(sumDevuelta)} | En Obra ${formatInt(sumEnObra)} | Valor Pend. ${formatMoney(sumValorPendiente)}`
                        : `Totales: Prest. ${formatInt(sumPrestada)} | Dev. ${formatInt(sumDevuelta)} | En Obra ${formatInt(sumEnObra)}`)
                    : `Totales: Prest. ${formatInt(sumPrestada)} | Dev. ${formatInt(sumDevuelta)} | En Obra ${formatInt(sumEnObra)}`;

                const totalsText = isGroupedByProyecto
                    ? groupedTotals
                    : (tipo === 'interno'
                        ? `Totales: Pendiente ${formatInt(sumPendiente)} | Valor Pendiente ${formatMoney(sumValorPendiente)}`
                        : `Totales: Pendiente ${formatInt(sumPendiente)}`);

                page.drawText(totalsText, {
                    x: pageWidth - marginX - font.widthOfTextAtSize(totalsText, 10),
                    y: footerY,
                    size: 10,
                    font: fontBold,
                    color: rgb(0.12, 0.14, 0.18),
                });
            }
        }

        // const pdfBytes = await pdfDoc.save();
        // const filename = `equipos-en-obra-${tipo}-${dayjs().format('YYYY-MM-DD')}.pdf`;
        // downloadBytesAsPdf(pdfBytes, filename);


        const pdfBytes = new Uint8Array(await pdfDoc.save());
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = URL.createObjectURL(blob);
        document.body.appendChild(iframe);

        iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            // setTimeout(() => {
            //   URL.revokeObjectURL(blobURL);
            //   document.body.removeChild(iframe);
            // }, 1000);
        };
        console.log("Se completó la creación del pdf")
    };

    const handleDownloadPDF = async (tipo: 'cliente' | 'interno') => {
        if (!datos.Cliente || datos.Cliente === OpcionPorDefecto.value) {
            setError('Debe seleccionar un cliente válido para generar el informe.');
            return;
        }

        try {
            setPdfLoading(tipo);
            setError(null);

            const DocumentoCliente = String(datos.Cliente);
            const IdProyecto = datos.Proyecto === 'Todos' ? undefined : (datos.Proyecto as number | string);

            const response = tipo === 'cliente'
                ? await InformeClienteEquiposEnObra({ DocumentoCliente, IdProyecto })
                : await InformeInternoEmpresaEquiposEnObra({ DocumentoCliente, IdProyecto });

            const rows = Array.isArray(response) ? response : (Array.isArray((response as any)?.data) ? (response as any).data : []);

            if (rows.length === 0) {
                setError('No hay datos para generar el informe con los filtros actuales.');
                return;
            }

            await generatePdfFromInforme(tipo, rows);
        } catch (err: any) {
            setError(err?.message ?? String(err));
        } finally {
            setPdfLoading(null);
        }
    };

    const columns = [
        {
            key: 'NoRemision',
            header: 'Remisión',
            render: (row: EstadoDeCuenta) => (
                <Typography variant="body2" fontWeight="bold">{row.NoRemision}</Typography>
            )
        },
        {
            key: 'FechaRemision',
            header: 'Fecha Préstamo',
            render: (row: EstadoDeCuenta) => (
                <Typography variant="body2">{row.FechaRemision}</Typography>
            )
        },
        {
            key: 'Proyecto',
            header: 'Proyecto',
            render: (row: EstadoDeCuenta) => (
                <Box sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.Proyecto}>
                    {row.Proyecto}
                </Box>
            )
        },
        {
            key: 'Equipo',
            header: 'Equipo',
            render: (row: EstadoDeCuenta) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>{row.Equipo}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.Categoria}</Typography>
                </Box>
            )
        },
        {
            key: 'Cantidades',
            header: 'Estado Cantidades',
            render: (row: EstadoDeCuenta) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`Prest: ${row.CantidadPrestada}`} size="small" variant="outlined" />
                    <Chip label={`Dev: ${row.CantidadDevuelta}`} size="small" variant="outlined" color="success" />
                    <Chip label={`Pend: ${row.CantidadPendiente}`} size="small" color={Number(row.CantidadPendiente) > 0 ? "warning" : "default"} />
                </Stack>
            )
        },
        {
            key: 'TiempoPrestamo',
            header: 'Tiempo',
            render: (row: EstadoDeCuenta) => (
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Clock size={16} />
                    <Typography variant="body2">{row.TiempoPrestamo}</Typography>
                </Stack>
            )
        },
        {
            key: 'EstadoDevolucion',
            header: 'Estado',
            render: (row: EstadoDeCuenta) => (
                <Chip
                    label={row.EstadoDevolucion}
                    color={getEstadoColor(row.EstadoDevolucion)}
                    size="small"
                    sx={{ color: 'white', minWidth: 80, fontWeight: 'bold' }}
                />
            )
        }
    ];

    const actions: ActionDefinition<EstadoDeCuenta>[] = [
        {
            render: (row: EstadoDeCuenta) => (
                <Button size="small" variant="text">Ver Detalle</Button>
            ),
            tooltip: 'Ver Detalle Completo'
        }
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Panel de Filtros y Acciones */}
            <Card sx={{ mb: 3, overflow: 'visible' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Empresa/Cliente"
                                value={datos.Cliente}
                                options={clientes}
                                size="small"
                                onChange={handleChange}
                                valorname="Cliente"
                                required
                            />
                        </Grid>
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Filtrar por Proyecto"
                                value={datos.Proyecto}
                                options={opcionesProyectos}
                                size="small"
                                onChange={handleChange}
                                valorname="Proyecto"
                            // disabled={!datos.Cliente || datos.Cliente === OpcionPorDefecto.value}
                            />
                        </Grid>
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Filtrar por Equipo"
                                value={datos.Equipo}
                                options={opcionesEquipos}
                                size="small"
                                onChange={handleChange}
                                valorname="Equipo"
                            // disabled={!datos.Cliente || datos.Cliente === OpcionPorDefecto.value}
                            />
                        </Grid>
                        <Grid md={2} xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleRefresh}
                                disabled={!datos.Cliente || datos.Cliente === OpcionPorDefecto.value}
                            >
                                Actualizar
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Resumen de Métricas */}
            {datos.Cliente && datos.Cliente !== OpcionPorDefecto.value && (
                <Box mb={3}>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={3}>
                            <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Total en Obra</Typography>
                                            <Typography variant="h4">{resumen.totalPendiente}</Typography>
                                        </Box>
                                        <Buildings size={32} weight="duotone" style={{ opacity: 0.5 }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Card>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Total Entregado</Typography>
                                            <Typography variant="h4" color="success.main">{resumen.totalDevuelto}</Typography>
                                        </Box>
                                        <CheckCircle size={32} weight="duotone" color={theme.palette.success.main} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Card>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Total Prestado</Typography>
                                            <Typography variant="h4">{resumen.totalPrestado}</Typography>
                                        </Box>
                                        <Wrench size={32} weight="duotone" color={theme.palette.info.main} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, p: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilePdf />}
                                    size="small"
                                    fullWidth
                                    onClick={() => void handleDownloadPDF('cliente')}
                                    disabled={pdfLoading !== null}
                                >
                                    Informe Cliente
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<FilePdf />}
                                    size="small"
                                    fullWidth
                                    onClick={() => void handleDownloadPDF('interno')}
                                    disabled={pdfLoading !== null}
                                >
                                    Informe Interno
                                </Button>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Tabla de Datos */}
            {datos.Cliente && datos.Cliente !== OpcionPorDefecto.value && (
                <Paper sx={{ overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6">Detalle de Movimientos</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Historial completo de equipos entregados, en obra y devoluciones.
                        </Typography>
                    </Box>
                    <DataTable<EstadoDeCuenta>
                        data={filteredData}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onRefresh={handleRefresh}
                        emptyMessage="No se encontraron registros para los filtros seleccionados"
                        rowKey={(row) => row.IdDetalleRemison ?? Math.random()}
                        placeHolderBuscador='Buscar por equipo, remisión o proyecto...'
                    />
                </Paper>
            )}
        </Box>
    );
};
