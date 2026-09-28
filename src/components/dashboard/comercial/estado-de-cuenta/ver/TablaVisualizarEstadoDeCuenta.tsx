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
    Paper,
    IconButton,
    LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FilePdf, Buildings, Wrench, CheckCircle, Clock, Money, Truck, Receipt, TrendUp } from '@phosphor-icons/react';
import { VerEstadoDeCuentaClientePaginado, type RespuestaEstadoDeCuenta } from '@/services/comercial/estado_de_cuenta/VerEstadoDeCuentaClienteService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { InformeClienteEquiposEnObra } from '@/services/comercial/estado_de_cuenta/InformeClienteEquiposEnObraService';
import { InformeInternoEmpresaEquiposEnObra } from '@/services/comercial/estado_de_cuenta/InformeInternoEmpresaEquiposEnObraService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { OpcionPorDefecto } from '@/lib/constants/option-default';
import dayjs from 'dayjs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ModalDetalleEstadoCuenta } from './ModalDetalleEstadoCuenta';
import { Eye } from '@phosphor-icons/react/dist/ssr';
import { getEstadoColor } from '@/utils/getEstadoColor';
import { type EstadoDeCuenta, REGLA_DIAS_COBRADOS, diasCobradosTexto, formatoMoneda } from './estado-de-cuenta';

export function TablaVisualizarEstadoDeCuenta(): JSX.Element {
    // Errores de los informes PDF (los de la tabla los maneja el hook de paginado)
    const [error, setError] = useState<string | null>(null);
    const [clientes, setClientes] = useState<{ value: string | number; label: string }[]>([]);
    const [pdfLoading, setPdfLoading] = useState<'cliente' | 'interno' | null>(null);

    // Filtros
    const [datos, setDatos] = useState({
        Cliente: OpcionPorDefecto.value,
        Proyecto: 'Todos',
        Equipo: 'Todos'
    });

    // Opciones dinámicas para filtros
    const clienteSeleccionado = datos.Cliente !== OpcionPorDefecto.value;

    // Paginado, búsqueda y filtros de proyecto/equipo resueltos en el servidor. La
    // respuesta trae además las opciones de los selects y el resumen de las tarjetas,
    // calculados sobre todo el estado de cuenta del cliente.
    const tabla = usePaginacionServidor<EstadoDeCuenta, RespuestaEstadoDeCuenta<EstadoDeCuenta>>({
        consultar: (parametros) =>
            VerEstadoDeCuentaClientePaginado<EstadoDeCuenta>(String(datos.Cliente), parametros, {
                Proyecto: datos.Proyecto !== 'Todos' ? String(datos.Proyecto) : undefined,
                Equipo: datos.Equipo !== 'Todos' ? String(datos.Equipo) : undefined,
            }),
        filtros: [datos.Cliente, datos.Proyecto, datos.Equipo],
        habilitado: clienteSeleccionado,
        mensajeError: (err) => `Error al actualizar: ${err}`,
    });
    const loading = tabla.cargando;

    // Estados para el Modal de Detalle
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
    const [registroSeleccionado, setRegistroSeleccionado] = useState<EstadoDeCuenta | null>(null);

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
    // Opciones de los selects: valores distintos de TODO el estado de cuenta del cliente
    const opcionesProyectos = useMemo<{ value: string | number; label: string }[]>(() => {
        const proyectos = tabla.respuesta?.Opciones.Proyectos ?? [];
        if (!clienteSeleccionado || proyectos.length === 0) return [];
        return [{ value: 'Todos', label: 'Todos los Proyectos' }, ...proyectos.map((p) => ({ value: p, label: p }))];
    }, [tabla.respuesta, clienteSeleccionado]);

    const opcionesEquipos = useMemo<{ value: string | number; label: string }[]>(() => {
        const equipos = tabla.respuesta?.Opciones.Equipos ?? [];
        if (!clienteSeleccionado || equipos.length === 0) return [];
        return [{ value: 'Todos', label: 'Todos los Equipos' }, ...equipos.map((e) => ({ value: e, label: e }))];
    }, [tabla.respuesta, clienteSeleccionado]);

    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'Cliente') {
            // Nuevo cliente: filtros y búsqueda desde cero, en el mismo cambio para que
            // no salga una consulta con el proyecto/equipo del cliente anterior
            setDatos(prev => ({ ...prev, Cliente: String(value), Proyecto: 'Todos', Equipo: 'Todos' }));
            tabla.refrescar();
            return;
        }
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    // Botón "Actualizar": vuelve a "Todos", limpia la búsqueda y recarga
    const handleRefresh = () => {
        if (!clienteSeleccionado) return;
        setDatos(prev => ({ ...prev, Proyecto: 'Todos', Equipo: 'Todos' }));
        tabla.refrescar();
    };

    const sameValue = (a: string | number, b: string | number) => String(a) === String(b);

    // Filtrado de datos en memoria
    // Resumen de las tarjetas, calculado en el servidor con los filtros de proyecto/equipo
    // (sin la búsqueda de texto, como antes)
    const resumen = tabla.respuesta?.Resumen ?? {
        totalPrestado: 0,
        totalDevuelto: 0,
        totalPendiente: 0,
        alquilerSinIVA: 0,
        alquilerConIVA: 0,
        causacionDiariaConIVA: 0,
        transportes: null,
        totalCausado: 0,
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
        if (blob) {
            const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (esMovil) {
                // window.open(URL.createObjectURL(blob), '_blank');
                // return;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `equipos-en-obra-${tipo}-${dayjs().format('YYYY-MM-DD')}.pdf`;
                link.click();
                return;
            }
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
        }
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

    // Tabla compacta: 5 columnas + acciones. Cada celda agrupa un dato principal y su
    // contexto en una segunda línea, para que quepa sin scroll horizontal. El detalle
    // completo (categoría, devoluciones, desglose del cobro) está en el modal.
    const textoSecundario = { display: 'block', lineHeight: 1.3 } as const;
    const columns = [
        {
            key: 'NoRemision',
            header: 'Remisión',
            width: 150,
            render: (row: EstadoDeCuenta) => (
                <Box>
                    <Typography variant="body2" fontWeight={700}>{row.NoRemision}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ...textoSecundario, whiteSpace: 'nowrap' }}>
                        {row.FechaRemision.replace(' a las ', ' · ')}
                    </Typography>
                </Box>
            )
        },
        {
            key: 'Equipo',
            header: 'Equipo',
            render: (row: EstadoDeCuenta) => (
                <Box sx={{ minWidth: 0, maxWidth: 280 }} title={`${row.Equipo} · ${row.Categoria}`}>
                    <Typography variant="body2" fontWeight={500} noWrap>{row.Equipo}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={textoSecundario}>
                        {row.Proyecto}
                    </Typography>
                </Box>
            )
        },
        {
            key: 'EstadoDevolucion',
            header: 'Devolución',
            width: 170,
            render: (row: EstadoDeCuenta) => {
                const prestada = Number(row.CantidadPrestada) || 0;
                const devuelta = Number(row.CantidadDevuelta) || 0;
                const completo = Number(row.CantidadPendiente) <= 0;
                return (
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                            <Chip
                                label={completo ? 'Completo' : `${row.CantidadPendiente} en obra`}
                                color={getEstadoColor(row.EstadoDevolucion)}
                                size="small"
                                sx={{ fontWeight: 700, height: 22 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                {devuelta} de {prestada}
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={prestada > 0 ? Math.min(100, (devuelta / prestada) * 100) : 0}
                            color={completo ? 'success' : 'warning'}
                            sx={{ mt: 0.75, height: 4, borderRadius: 2, bgcolor: 'var(--mui-palette-background-level2)' }}
                            aria-label={`${devuelta} de ${prestada} unidades devueltas`}
                        />
                    </Box>
                );
            }
        },
        {
            key: 'TiempoPrestamo',
            header: 'Días cobrados',
            width: 150,
            render: (row: EstadoDeCuenta) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>{diasCobradosTexto(row)}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                        <Clock size={12} />
                        <Typography variant="caption" sx={textoSecundario}>{row.TiempoPrestamo}</Typography>
                    </Stack>
                </Box>
            )
        },
        {
            key: 'ValorAlquilerConIVA',
            header: 'Alquiler causado',
            width: 150,
            align: 'right' as const,
            render: (row: EstadoDeCuenta) => (
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        {formatoMoneda(row.ValorAlquilerConIVA)}
                    </Typography>
                    {Number(row.CausacionDiariaConIVA) > 0 ? (
                        <Typography variant="caption" color="warning.main" sx={{ ...textoSecundario, whiteSpace: 'nowrap' }}>
                            +{formatoMoneda(row.CausacionDiariaConIVA)}/día
                        </Typography>
                    ) : (
                        <Typography variant="caption" color="text.secondary" sx={textoSecundario}>con IVA</Typography>
                    )}
                </Box>
            )
        }
    ];

    const actions: ActionDefinition<EstadoDeCuenta>[] = [
        {
            render: (row: EstadoDeCuenta) => (
                <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => {
                        setRegistroSeleccionado(row);
                        setModalDetalleOpen(true);
                    }}
                >
                    <Eye size={20} weight="bold" />
                </IconButton>
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
                            {/* Tarjeta destacada: fondo primario + texto de contraste del propio token */}
                            <Card sx={{ bgcolor: 'var(--mui-palette-primary-main)', color: 'var(--mui-palette-primary-contrastText)' }}>
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
                                        {/* El icono hereda `currentColor`, así el token se resuelve en CSS y sigue al modo */}
                                        <CheckCircle size={32} weight="duotone" style={{ color: 'var(--mui-palette-success-main)' }} />
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
                                        <Wrench size={32} weight="duotone" style={{ color: 'var(--mui-palette-info-main)' }} />
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

                    {/* Valores causados: misma fórmula de cobro que movimientos generales */}
                    <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid xs={12} sm={6} md={3}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Alquiler causado</Typography>
                                            <Typography variant="h5">{formatoMoneda(resumen.alquilerConIVA)}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatoMoneda(resumen.alquilerSinIVA)} + IVA
                                            </Typography>
                                        </Box>
                                        <Money size={28} weight="duotone" style={{ color: 'var(--mui-palette-primary-main)' }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Transportes</Typography>
                                            {resumen.transportes ? (
                                                <>
                                                    <Typography variant="h5">
                                                        {formatoMoneda(resumen.transportes.remisiones + resumen.transportes.devoluciones)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Remisiones {formatoMoneda(resumen.transportes.remisiones)} · Devoluciones {formatoMoneda(resumen.transportes.devoluciones)}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="h5">—</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        No aplica al filtrar por equipo: se cobra por documento
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                        <Truck size={28} weight="duotone" style={{ color: 'var(--mui-palette-info-main)' }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <Card sx={{ height: '100%', bgcolor: 'var(--mui-palette-primary-main)', color: 'var(--mui-palette-primary-contrastText)' }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Total causado a hoy</Typography>
                                            <Typography variant="h5">{formatoMoneda(resumen.totalCausado)}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                {resumen.transportes ? 'Alquiler con IVA + transportes' : 'Sólo alquiler con IVA'}
                                            </Typography>
                                        </Box>
                                        <Receipt size={28} weight="duotone" style={{ opacity: 0.6 }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Suma por cada día más</Typography>
                                            <Typography variant="h5" color={resumen.causacionDiariaConIVA > 0 ? 'warning.main' : undefined}>
                                                {formatoMoneda(resumen.causacionDiariaConIVA)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Equipos en obra, con IVA
                                            </Typography>
                                        </Box>
                                        <TrendUp size={28} weight="duotone" style={{ color: 'var(--mui-palette-warning-main)' }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="caption" color="text.secondary">
                                Valores a la fecha y hora actual. Precio por unidad y por día; el IVA se aplica al alquiler y el transporte se suma sin IVA. {REGLA_DIAS_COBRADOS}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Tabla de Datos */}
            {datos.Cliente && datos.Cliente !== OpcionPorDefecto.value && (
                <Paper sx={{ overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid var(--mui-palette-divider)' }}>
                        <Typography variant="h6">Detalle de Movimientos</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Historial completo de equipos entregados, en obra y devoluciones.
                        </Typography>
                    </Box>
                    <DataTable<EstadoDeCuenta>
                        data={tabla.datos}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        error={tabla.error ?? error}
                        searchTerm={tabla.busqueda}
                        onSearchChange={tabla.setBusqueda}
                        onRefresh={handleRefresh}
                        paginacionServidor={tabla.paginacionTabla}
                        emptyMessage="No se encontraron registros para los filtros seleccionados"
                        rowKey={(row) => row.IdDetalleRemision}
                        placeHolderBuscador='Buscar por equipo, remisión o proyecto...'
                    />
                </Paper>
            )}

            {/* Modal de Detalle */}
            <ModalDetalleEstadoCuenta
                open={modalDetalleOpen}
                onClose={() => setModalDetalleOpen(false)}
                data={registroSeleccionado}
            />
        </Box>
    );
};
