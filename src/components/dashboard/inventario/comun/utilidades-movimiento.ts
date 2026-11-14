import * as React from 'react';

import { OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import type { OpcionesSelectNumero } from '@/types/select_options';

/**
 * Utilidades compartidas por los modales de entradas y salidas de inventario
 * (equipos y repuestos).
 */

/** Ítem de un movimiento: el campo del id (`IdEquipo` / `IdRepuesto`) varía según el inventario. */
export type ItemMovimiento = Record<string, number | string> & {
    Cantidad: number;
    IdUnidadMedida: number;
    IdEstado: number;
    Observacion: string;
};

/** Ítem vacío con el que se reinicia el formulario de "Agregar". */
export function itemVacio(campoId: string): ItemMovimiento {
    return {
        [campoId]: OpcionPorDefectoNumber.value,
        Cantidad: 1,
        IdUnidadMedida: OpcionPorDefectoNumber.value,
        IdEstado: OpcionPorDefectoNumber.value,
        Observacion: '',
    } as ItemMovimiento;
}

/** Diccionario id → etiqueta para mostrar nombres en la tabla de ítems. */
export function useDiccionario(opciones: ReadonlyArray<{ value: number | string; label: string }>): Map<number, string> {
    return React.useMemo(() => {
        const m = new Map<number, string>();
        opciones.forEach((o) => { if (o?.value) m.set(Number(o.value), String(o.label ?? '')); });
        return m;
    }, [opciones]);
}

interface CamposElemento {
    /** `IdEquipo` / `IdRepuesto` en registros crudos. */
    campoId: string;
    campoCodigo: string;
    campoNombre: string;
    /** Etiqueta de respaldo: `Equipo 81`. */
    prefijo: string;
}

/**
 * Convierte el listado de equipos/repuestos en opciones del select (sin duplicados)
 * y en un mapa id → unidad de medida. Acepta `{ value, label }` ya normalizado o
 * registros crudos con id, código y nombre.
 */
export function opcionesDeElementos(listado: unknown, campos: CamposElemento): { opciones: OpcionesSelectNumero[]; unidades: Map<number, number> } {
    const registros = (Array.isArray(listado) ? listado : []) as any[];
    const opciones: OpcionesSelectNumero[] = [];
    const vistos = new Set<number>();
    registros.forEach((r) => {
        const hasValueLabel = r && 'value' in r && 'label' in r;
        const id = hasValueLabel ? Number(r.value) : Number(r[campos.campoId]);
        if (!id || vistos.has(id)) return;
        opciones.push({ value: id, label: hasValueLabel ? String(r.label ?? String(id)).trim() : etiquetaCruda(r, id, campos) });
        vistos.add(id);
    });

    const unidades = new Map<number, number>();
    registros.forEach((r) => {
        const id = Number((r && 'value' in r) ? r.value : r?.[campos.campoId]);
        const um = Number(r?.IdUnidadMedida ?? r?.IdUnidadDeMedida ?? 0);
        if (id && um) unidades.set(id, um);
    });

    return { opciones: [OpcionPorDefectoNumber, ...opciones], unidades };
}

function etiquetaCruda(r: any, id: number, campos: CamposElemento): string {
    const codigo = String(r[campos.campoCodigo] ?? '').trim();
    const nombre = String(r[campos.campoNombre] ?? '').trim();
    if (!codigo && !nombre) return `${campos.prefijo} ${id}`;
    return codigo && nombre ? `${codigo} ${nombre}` : `${codigo}${nombre}`;
}

/** Unidad de medida que trae el detalle de un equipo/repuesto (array u objeto). */
export function unidadMedidaDeDetalle(detalle: any): number {
    return Number(
        detalle?.[0]?.IdUnidadMedida ??
        detalle?.[0]?.IdUnidadDeMedida ??
        detalle?.IdUnidadMedida ??
        detalle?.IdUnidadDeMedida ??
        detalle?.UnidadMedidaId ??
        0
    );
}

/**
 * Unidad de medida automática del ítem: primero la del listado; si no la trae,
 * la consulta por id (y la recuerda). Sin unidad conocida queda sin seleccionar.
 */
export function useUnidadPorElemento(
    consultarPorId: (id: number) => Promise<any>,
    setItem: React.Dispatch<React.SetStateAction<ItemMovimiento>>
) {
    const [unidadPorElemento, setUnidadPorElemento] = React.useState<Map<number, number>>(new Map());

    const asignarUnidad = async (id: number) => {
        try {
            const existente = unidadPorElemento.get(id);
            if (existente) {
                setItem(prev => ({ ...prev, IdUnidadMedida: existente }));
                return;
            }
            const um = unidadMedidaDeDetalle(await consultarPorId(id));
            if (um > 0) {
                setUnidadPorElemento(prev => new Map(prev).set(id, um));
                setItem(prev => ({ ...prev, IdUnidadMedida: um }));
            } else {
                setItem(prev => ({ ...prev, IdUnidadMedida: OpcionPorDefectoNumber.value }));
            }
        } catch {
            setItem(prev => ({ ...prev, IdUnidadMedida: OpcionPorDefectoNumber.value }));
        }
    };

    return { setUnidadPorElemento, asignarUnidad };
}

/** `onChange` de los campos del ítem: los ids y la cantidad se guardan como número. */
export function manejadorCambioItem(campoId: string, setItem: React.Dispatch<React.SetStateAction<ItemMovimiento>>) {
    const numericos = new Set([campoId, 'Cantidad', 'IdUnidadMedida', 'IdEstado']);
    return (e: any) => {
        const { name, value } = e.target || {};
        if (!name) return;
        setItem(prev => ({
            ...prev,
            [name]: numericos.has(name) ? Number(value) : value
        }));
    };
}

/** Pide un catálogo y lo asigna en cuanto llega; si falla lo registra sin afectar a los demás. */
export async function cargarCatalogo<T>(nombre: string, consultar: () => Promise<T>, asignar: (datos: T) => void): Promise<void> {
    try {
        asignar(await consultar());
    } catch (error) {
        console.error(`Error al listar ${nombre}:`, error);
    }
}
