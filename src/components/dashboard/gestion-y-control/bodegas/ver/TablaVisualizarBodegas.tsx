'use client';
import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { useRecargaPorEventos, ChipEstadoTexto } from '../../comun/tabla-comun';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerBodegasPaginado } from '@/services/gestionycontrol/bodegas/VerBodegasService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import * as React from 'react';
import { FormularioEditarBodega } from '../editar/FormularioEditarBodega';

// 1. INTERFACES Ó TYPES
interface Bodega {
    IdBodega: number;
    NombreBodega: string;
    DescripcionBodega: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoBodega: string;
};

// 2. COMPONENTE PRINCIPAL
export function TablaVisualizarBodegas(): React.JSX.Element {
    // 3. HOOKS DE REACT Y OTROS HOOKS DE LIBRERÍAS

    // 4. ESTADOS
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<Bodega>({
        consultar: VerBodegasPaginado,
        mensajeError: () => 'Error al actualizar las bodegas',
    });
    const { sendMessage, messages } = useSocketIO();
    //Estados para el manejo de las notificaciones/alertas
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();
    //....

    // 5. USEEFFECT PARA CARGA DE DATOS INICIALES Y SOCKETS
    // Carga las bodegas cuando se emite un evento socket
    useRecargaPorEventos(messages, ['bodega-creada', 'bodega-actualizada'], tabla.recargar);
    // ....
    // 6. FUNCIONES DEL COMPONENTE
    //....
    // ....

    const columns = [
        {
            key: 'IdBodega',
            header: 'Id',
        },
        // {
        //     key: 'TipoBodega',
        //     header: 'Tipo'
        // },
        {
            key: 'NombreBodega',
            header: 'Bodega',
        },
        {
            key: 'DescripcionBodega',
            header: 'Descripción'
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
            key: 'EstadoBodega',
            header: 'Estado',
            render: (row: Bodega) => <ChipEstadoTexto estado={row.EstadoBodega} />
        }
    ];

    const actions: ActionDefinition<Bodega>[] = [
        {
            render: (row: Bodega) => (
                <FormularioEditarBodega
                    IdBodega={row.IdBodega}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar bodega'
        }
    ]

    // 7. RENDERIZADO DEL COMPONENTE PRINCIPAL JSX
    return (
        <>
            <DataTable<Bodega>
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                onRefresh={tabla.refrescar}
                paginacionServidor={tabla.paginacionTabla}
                emptyMessage='No se encontraron bodegas'
                rowKey={(row) => row.IdBodega}
                placeHolderBuscador='Buscar bodegas...'
            />

            <MensajeAlerta {...propsAlerta} />
        </>
    );
};