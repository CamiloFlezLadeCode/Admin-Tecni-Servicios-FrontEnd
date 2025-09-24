'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
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
    const [data, setData] = React.useState<OrdenDeServicio[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // Estados para mensaje de carga - MOVIDOS AL PRINCIPAL
    const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);
    const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');

    const { sendMessage, messages } = useSocketIO();

    React.useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const response = await VerTodasLasOrdenesDeServicio();
                setData(response);
            } catch (err) {
                setError('Error al cargar las órdenes de servicio');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'orden-de-servicio-creada' || ultimomensajes.tipo === 'orden-de-servicio-eliminada') {
                handleRefresh();
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
                    sx={{ color: 'white', minWidth: 100 }}
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
            render: (row) => (
                <VerGenerarPDFOrdenDeServicio
                    IdOrdenDeServicio={row.IdOrdenDeServicio}
                    onMostrarCarga={manejarCarga} // Pasar función callback
                    onMostrarMensaje={mostrarMensaje} // Pasar función callback
                />
            ),
            tooltip: 'Imprimir orden de servicio'
        },
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

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Completado': return 'success';
            case 'Pendiente': return 'warning';
            case 'Cancelado': return 'error';
            case 'En Proceso': return 'info';
            case 'Creado': return 'info';
            default: return 'default';
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await VerTodasLasOrdenesDeServicio();
            setData(response);
        } catch (err) {
            setError('Error al actualizar las órdenes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<OrdenDeServicio>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
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