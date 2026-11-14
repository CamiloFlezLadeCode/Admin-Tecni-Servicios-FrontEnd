'use client';
import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { useRecargaPorEventos, ChipDisponibilidad } from '../../comun/tabla-comun';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarRepuestosPaginado } from '@/services/gestionycontrol/repuestos/ConsultarRepuestosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import * as React from 'react';
import { FormularioEditarRepuesto } from '../editar/FormularioEditarRepuesto';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface Repuesto {
    EstadoRepuesto: string;
    IdRepuesto: number;
    NombreRepuesto: string;
    CantidadRepuesto: number;
    UsuarioCreacion: string;
    FechaCreacion: string;
}



export function TablaVisualizarProyectos(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<Repuesto>({
        consultar: ConsultarRepuestosPaginado,
        mensajeError: (error) => `Error al cargar los repuestos: ${error}`,
    });

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);
    //             const response = await ConsultarRepuestos();
    //             setData(response);
    //         } catch (err) {
    //             setError(`Error al cargar los repuestos: ${err}`);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);



    const OperacionesStandar = [
        'repuesto-creado',
        'repuesto-actualizado',
        'repuesto-eliminado',
        'entrada-repuestos-creada',
        'salida-repuestos-creada',
        'orden-de-servicio-creada'
    ];
    useRecargaPorEventos(messages, OperacionesStandar, tabla.recargar);



    const columns = [
        {
            key: 'IdRepuesto',
            header: 'Id'
        },
        {
            key: 'NombreRepuesto',
            header: 'Nombre'
        },
        // {
        //     key: 'CantidadRepuesto',
        //     header: 'Cantidad Total'
        // },
        {
            key: 'CantidadDisponibleRepuesto',
            header: 'Cantidad Disponible'
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
            key: 'EstadoRepuesto',
            header: 'Estado',
            render: (row: Repuesto) => <ChipDisponibilidad estado={row.EstadoRepuesto} />
        },
    ]

    const actions: ActionDefinition<Repuesto>[] = [
        {
            render: (row: Repuesto) => (
                <FormularioEditarRepuesto
                    IdRepuesto={row.IdRepuesto}
                    sendMessage={sendMessage}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar repuesto'
        }
    ]
    return (
        <>
            <DataTable<Repuesto>
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                paginacionServidor={tabla.paginacionTabla}
                onRefresh={tabla.refrescar}
                emptyMessage="No se encontraron repuestos"
                rowKey={(row) => row.IdRepuesto}
                placeHolderBuscador='Buscar repuestos...'
            />
            <MensajeAlerta {...propsAlerta} />
        </>
    )
}