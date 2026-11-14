'use client';
import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { useRecargaPorEventos, ChipDisponibilidad } from '../../comun/tabla-comun';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { TraerEquiposPaginado } from '@/services/gestionycontrol/equipos/TraerEquiposRegistradosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import * as React from 'react';
import { FormularioEditarEquipo } from '../editar/FormularioEditarEquipo';

interface Equipo {
    IdEquipo: number;
    NombreEquipo: string;
    CategoriaEquipo: string;
    Cantidad: number;
    Subarrendatario: string;
    PrecioVenta: number;
    PrecioAlquiler: number;
    PrecioReparacion: number;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
}

export function TablaVisualizarEquipos(): React.JSX.Element {
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<Equipo>({
        consultar: TraerEquiposPaginado,
        mensajeError: (error) => `Error al cargar los equipos: ${error}`,
    });
    const { sendMessage, messages } = useSocketIO();
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();

    useRecargaPorEventos(messages, ['equipo-actualizado', 'equipo-creado', 'remision-creada', 'remision-anulada'], tabla.recargar);

    const columns = [
        {
            key: 'NombreEquipo',
            header: 'Nombre'
        },
        {
            key: 'CategoriaEquipo',
            header: 'Categoría'
        },
        {
            key: 'BodegaUbicacion',
            header: 'Bodega'
        },
        {
            key: 'Cantidad',
            header: 'Cantidad Total',
            align: 'right' as const
        },
        {
            key: 'CantidadDisponible',
            header: 'Cantidad Disponible',
            align: 'right' as const
        },
        {
            key: 'PrecioVenta',
            header: 'Precio Venta',
            align: 'right' as const
        },
        {
            key: 'PrecioAlquiler',
            header: 'Precio Alquiler',
            align: 'right' as const
        },
        {
            key: 'PrecioReparacion',
            header: 'Precio Reparación',
            align: 'right' as const
        },
        {
            key: 'UsuarioCreacion',
            header: 'Creado Por'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación'
        },
        {
            key: 'Estado',
            header: 'Estado',
            render: (row: Equipo) => <ChipDisponibilidad estado={row.Estado} />
        }
    ];

    const actions = [
        {
            render: (row: Equipo) => (
                <FormularioEditarEquipo
                    IdEquipo={row.IdEquipo}
                    sendMessage={sendMessage}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar equipo'
        }
    ];

    return (
        <>
            <DataTable<Equipo>
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                paginacionServidor={tabla.paginacionTabla}
                onRefresh={tabla.refrescar}
                emptyMessage="No se encontraron equipos"
                rowKey={(row) => row.IdEquipo}
                placeHolderBuscador='Buscar equipos...'
            />

            <MensajeAlerta {...propsAlerta} />
        </>
    );
}