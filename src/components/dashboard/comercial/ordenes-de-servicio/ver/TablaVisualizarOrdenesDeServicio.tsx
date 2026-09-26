'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerTodasLasOrdenesDeServicioPaginado } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { Chip } from '@mui/material';
import * as React from 'react';
import { BotonEliminarOrdenDeServicio } from '../acciones/EliminarOrdenDeServicio';
import { VerGenerarPDFOrdenDeServicio } from '../acciones/VerGenerarPDFOrdenDeServicio';
// Servicios
import { ObtenerPDFOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ObtenerPDFOrdenDeServicioService';
import { EliminarOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/EliminarOrdenDeServicioService';
// Acciones Generales
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { GenerarPDF } from '@/components/dashboard/componentes_generales/acciones/GenerarPDF';
import { EliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/EliminarRegistro';
import { getEstadoColor } from '@/utils/getEstadoColor';

interface OrdenDeServicio {
    IdOrdenDeServicio: number;
    NoOrdenDeServicio: string;
    Cliente: string;
    Proyecto: string;
    Mecanico: string;
    CreadoPor: string;
    FechaCreacion: string;
    EstadoOrdenDeServicio: string;
}

export function TablaVisualizarOrdenesDeServicio() {
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<OrdenDeServicio>({
        consultar: VerTodasLasOrdenesDeServicioPaginado,
        mensajeError: () => 'Error al cargar las órdenes de servicio',
    });

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // Estados para mensaje de carga - MOVIDOS AL PRINCIPAL
    const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);
    const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');

    const { sendMessage, messages } = useSocketIO();


    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'orden-de-servicio-creada' || ultimomensajes.tipo === 'orden-de-servicio-eliminada') {
                tabla.recargar();
            }
        }
    }, [messages]);

    const columns = [
        {
            key: 'NoOrdenDeServicio',
            header: 'No Orden',
            width: '120px'
        },
        {
            key: 'Cliente',
            header: 'Cliente'
        },
        {
            key: 'Proyecto',
            header: 'Proyecto'
        },
        {
            key: 'Mecanico',
            header: 'Mecánico'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación',
        },
        {
            key: 'CreadoPor',
            header: 'Creado Por'
        },
        {
            key: 'EstadoOrdenDeServicio',
            header: 'Estado',
            render: (row: OrdenDeServicio) => (
                <Chip
                    label={row.EstadoOrdenDeServicio}
                    color={getEstadoColor(row.EstadoOrdenDeServicio)}
                    size="small"
                    sx={{ minWidth: 100 }}
                />
            )
        }
    ];

    // Función para mostrar mensajes de alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    // Función para mostrar/ocultar carga
    const manejarCarga = (mostrar: boolean, mensaje: string = '') => {
        setMostrarMensajeDeCarga(mostrar);
        setMensajeDeCarga(mensaje);
    };

    const actions: ActionDefinition<OrdenDeServicio>[] = [
        {
            render: (row: OrdenDeServicio) => (
                <GenerarPDF
                    servicioPDF={(id) => ObtenerPDFOrdenDeServicio(row.IdOrdenDeServicio)}
                    idRecurso={row.IdOrdenDeServicio}
                    nombreArchivo={`orden-de-servicio-No${row.IdOrdenDeServicio}.pdf`}
                    mensajes={{
                        generando: 'Generando pdf de orden de servicio. Por favor espere',
                        exito: 'PDF generado correctamente',
                        error: 'Error al generar el PDF de la orden de servicio'
                    }}
                    onMostrarCarga={manejarCarga}
                    onMostrarMensaje={mostrarMensaje}
                    comportamiento="impresion"
                />
            ),
            tooltip: 'Imprimir orden de servicio'
        },
        {
            render: (row: OrdenDeServicio) => (
                <EliminarRegistro
                    servicioEliminarRegistro={(id) => EliminarOrdenDeServicio(row.IdOrdenDeServicio)}
                    idRecurso={row.IdOrdenDeServicio}
                    sendMessage={sendMessage}
                    mostrarMensaje={mostrarMensaje}
                    mensajes={{
                        ariaLabel: `eliminar-orden-de-servicio-${row.IdOrdenDeServicio}`,
                        socket: 'orden-de-servicio-eliminada',
                        info: `¿Realmente quieres eliminar la orden de servicio ${row.NoOrdenDeServicio}?`,
                        exito: 'Orden de servicio eliminada correctamente',
                        error: 'Error al eliminar orden de servicio'
                    }}
                />
            ),
            tooltip: 'Eliminar remisión'
        }
    ];


    return (
        <>
            <DataTable<OrdenDeServicio>
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                paginacionServidor={tabla.paginacionTabla}
                onRefresh={tabla.refrescar}
                emptyMessage="No se encontraron órdenes de servicio"
                rowKey={(row) => row.IdOrdenDeServicio}
                placeHolderBuscador="Buscar órdenes..."
            />

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />

            <MensajeDeCarga
                Mensaje={mensajeDeCarga}
                MostrarMensaje={mostrarMensajeDeCarga}
            />
        </>
    );
}