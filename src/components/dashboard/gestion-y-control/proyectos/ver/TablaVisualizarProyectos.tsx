'use client';
import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { useRecargaPorEventos } from '@/hooks/use-recarga-por-eventos';
import { ChipActivoInactivo } from '../../comun/tabla-comun';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarProyectosPaginado } from '@/services/gestionycontrol/proyectos/ConsultarProyectosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import * as React from 'react';
import { ModalFormularioEditarProyecto } from '../editar/ModalFormularioEditarProyecto';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface Proyecto {
    IdProyecto: number;
    NombreProyecto: string;
    Cliente: string;
    DireccionProyecto: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoProyecto: string;
}


export function TablaVisualizarProyectos(): React.JSX.Element {
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<Proyecto>({
        consultar: ConsultarProyectosPaginado,
        mensajeError: () => 'Error al cargar los proyectos',
    });
    const { sendMessage, messages } = useSocketIO();

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();



    useRecargaPorEventos(messages, ['proyecto-actualizado', 'proyecto-creado'], tabla.recargar);


    const columns = [
        {
            key: 'NombreProyecto',
            header: 'Nombre'
        },
        {
            key: 'Cliente',
            header: 'Cliente'
        },
        {
            key: 'DireccionProyecto',
            header: 'Dirección'
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
            key: 'EstadoProyecto',
            header: 'Estado',
            render: (row: Proyecto) => <ChipActivoInactivo estado={row.EstadoProyecto} />
        }
    ];

    const actions = [
        {
            render: (row: Proyecto) => (
                <ModalFormularioEditarProyecto
                    onMostrarMensaje={mostrarMensaje}
                    ProyectoAEditar={{ IdProyecto: row.IdProyecto }}
                    sendMessage={sendMessage}
                />
            ),
            tooltip: 'Editar proyecto'
        }
    ];


    return (
        <>
            <DataTable<Proyecto>
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                paginacionServidor={tabla.paginacionTabla}
                onRefresh={tabla.refrescar}
                emptyMessage="No se encontraron proyectos"
                rowKey={(row) => row.IdProyecto}
                placeHolderBuscador='Buscar proyectos...'
            />
            <MensajeAlerta {...propsAlerta} />
        </>
    );
}