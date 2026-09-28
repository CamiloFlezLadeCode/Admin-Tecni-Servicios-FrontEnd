/**
 * Tipos y helpers compartidos por la tabla y el modal del estado de cuenta.
 *
 * Los valores en dinero los calcula el backend con la fórmula única de cobro
 * (`utils/cobroAlquiler.js`), la misma de movimientos generales:
 *   alquiler = precio por día × unidades·día cobradas, más IVA; el transporte va aparte.
 */

/** Una devolución (vigente) de un renglón de remisión. */
export interface DevolucionRenglon {
    NoDevolucion: string;
    /** 'DD/MM/YYYY a las h:mm AM' */
    Fecha: string;
    /** 'YYYY-MM-DD HH:mm:ss', sólo para ordenar */
    FechaOrden: string;
    Cantidad: number;
    DiasCobrados: number;
    /** La devolución quedó registrada con fecha/hora anterior a la de la remisión. */
    AnteriorARemision: boolean | number;
}

/** Un renglón (equipo) de una remisión del cliente. */
export interface EstadoDeCuenta {
    IdDetalleRemision: number;
    Cliente: string;
    DocumentoCliente: string;
    NoRemision: string;
    FechaRemision: string;
    FechaUltimaDevolucion?: string | null;
    Proyecto: string;
    Categoria: string;
    Equipo: string;
    CantidadPrestada: number | string;
    CantidadDevuelta: number | string;
    CantidadPendiente: number | string;
    /** Tiempo real transcurrido (informativo), nunca negativo. */
    TiempoPrestamo: string;
    EstadoDevolucion: string;
    /** Precio por unidad y por día, sin IVA. */
    PrecioUnitario: number | string;
    /** % de IVA de la remisión. */
    IVA: number | string;
    /** Días que se cobran por cada unidad que sigue en obra (null si no queda nada en obra). */
    DiasCobradosEnObra: number | string | null;
    /** Σ(unidades × días cobrados) del renglón. */
    UnidadesDiaCobradas: number | string;
    ValorAlquiler: number | string;
    ValorAlquilerConIVA: number | string;
    /** Lo que el renglón suma por cada día más en obra, con IVA. */
    CausacionDiariaConIVA: number | string;
    Devoluciones: DevolucionRenglon[] | null;
}

export const REGLA_DIAS_COBRADOS =
    'Cada fracción de día se cobra como día completo y el mínimo es 1 día. Las unidades devueltas se cobran hasta su fecha de devolución; las que siguen en obra, hasta hoy.';

export const formatoMoneda = (valor: unknown, decimales = 0): string =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
    }).format(Number(valor) || 0);

export const devolucionesOrdenadas = (fila: EstadoDeCuenta): DevolucionRenglon[] =>
    [...(fila.Devoluciones ?? [])].sort((a, b) => a.FechaOrden.localeCompare(b.FechaOrden));

/**
 * Días cobrados del renglón como texto. Si todas sus unidades llevan los mismos días
 * (lo normal) se muestra el número; con devoluciones parciales en fechas distintas cada
 * grupo de unidades tiene sus propios días y se remite al detalle.
 */
export const diasCobradosTexto = (fila: EstadoDeCuenta): string => {
    const dias = new Set<number>();
    for (const d of fila.Devoluciones ?? []) dias.add(Number(d.DiasCobrados));
    if (Number(fila.CantidadPendiente) > 0 && fila.DiasCobradosEnObra !== null) dias.add(Number(fila.DiasCobradosEnObra));
    if (dias.size === 0) return '-';
    if (dias.size > 1) return 'Varios (ver detalle)';
    const [n] = [...dias];
    return `${n} ${n === 1 ? 'día' : 'días'}`;
};

export const tieneDevolucionAnteriorARemision = (fila: EstadoDeCuenta): boolean =>
    (fila.Devoluciones ?? []).some((d) => Boolean(Number(d.AnteriorARemision)));
