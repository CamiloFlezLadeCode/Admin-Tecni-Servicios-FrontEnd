'use client';
import { EliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/EliminarRegistro';
import { GenerarPDF } from '@/components/dashboard/componentes_generales/acciones/GenerarPDF';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { EliminarDevolucion } from '@/services/comercial/devoluciones/EliminarDevolucionService';
import { ObtenerPDFDevolucion } from '@/services/comercial/devoluciones/ObtenerPDFDevolucionService';
import { VerTodasLasDevoluciones } from '@/services/comercial/devoluciones/VerTodasLasDevolucionesService';
import {
    Chip
} from '@mui/material';
import * as React from 'react';


interface Devolucion {
    IdDevolucion: number;
    NoDevolucion: string;
    IdRemision: number;
    Cliente: string;
    Proyecto: string;
    CreadoPor: string;
    FechaCreacion: string;
    Estado: string;
}

export function TablaVisualizarDevoluciones(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();
    const [data, setData] = React.useState<Devolucion[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    // Estados para alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');
    const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await VerTodasLasDevoluciones();
                setData(response);
                console.log(response)
            } catch (err) {
                setError(`Error al cargar las devoluciones: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'devolucion-creada' || ultimomensajes.tipo === 'devolucion-eliminada') {
                handleRefresh();
            }
        }
    }, [messages]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await VerTodasLasDevoluciones();
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para mostrar mensajes de alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Activa': return 'success';
            case 'Pendiente': return 'warning';
            case 'Cancelada': return 'error';
            case 'En Proceso': return 'info';
            case 'Creado': return 'info'
            default: return 'default';
        }
    };

    const columns = [
        // {
        //     key: 'IdDevolucion',
        //     header: 'Id'
        // },
        {
            key: 'NoDevolucion',
            header: 'No Devolución'
        },
        {
            key: 'NoRemision',
            header: 'No Remisión'
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
            key: 'CreadoPor',
            header: 'Creado Por'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación'
        },
        {
            key: 'Estado',
            header: 'Estado',
            render: (row: Devolucion) => (
                <Chip
                    label={row.Estado}
                    color={getEstadoColor(row.Estado)}
                    size="small"
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        },
    ];

    // Función para mostrar/ocultar carga
    const manejarCarga = (mostrar: boolean, mensaje: string = '') => {
        setMostrarMensajeDeCarga(mostrar);
        setMensajeDeCarga(mensaje);
    };

    const actions: ActionDefinition<Devolucion>[] = [
        {
            render: (row: Devolucion) => (
                <GenerarPDF
                    servicioPDF={(id) => ObtenerPDFDevolucion(row.IdDevolucion)}
                    idRecurso={row.IdDevolucion}
                    nombreArchivo={`devolución-No${row.IdDevolucion}.pdf`}
                    mensajes={{
                        generando: 'Generando PDF de devolución. Por favor espere',
                        exito: 'PDF generado correctamente',
                        error: 'Error al generar el PDF de la devolución'
                    }}
                    onMostrarCarga={manejarCarga}
                    onMostrarMensaje={mostrarMensaje}
                    comportamiento="impresion"
                // icono={<Printer size={20} weight="bold" />}
                />
            ),
            tooltip: 'Imprimir devolución'
        },
        {
            render: (row: Devolucion) => (
                <EliminarRegistro
                    servicioEliminarRegistro={(id) => EliminarDevolucion(row.IdDevolucion)}
                    idRecurso={row.IdDevolucion}
                    sendMessage={sendMessage}
                    mostrarMensaje={mostrarMensaje}
                    mensajes={{
                        ariaLabel: `eliminar-devolucion-${row.IdDevolucion}`,
                        socket: 'devolucion-eliminada',
                        info: `¿Realmente quieres eliminar la devolución ${row.NoDevolucion}?`,
                        exito: 'Devolución eliminada correctamente',
                        error: 'Error al eliminar devolución'
                    }}
                />
            ),
            tooltip: 'Eliminar devolución'
        }
    ];

    return (
        <>
            <DataTable<Devolucion>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron devoluciones"
                rowKey={(row) => row.IdDevolucion}
                placeHolderBuscador='Buscar devoluciones...'
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
    )
}