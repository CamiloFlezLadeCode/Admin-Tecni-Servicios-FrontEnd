'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { BotonEliminarRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/EliminarRemision';
import { GenerarPDFRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/GenerarPDFRemision';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarRemisiones } from '@/services/comercial/remisiones/ConsultarRemisionesService';
import { Chip } from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
// import { EditarRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/EditarRemision';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { GenerarPDF } from '@/components/dashboard/componentes_generales/acciones/GenerarPDF';
import { VisualizarPDFRemision } from '@/services/comercial/remisiones/ObtenerPDFRemisionService';


interface Remision {
    IdRemision: number;
    NoRemision: string;
    Cliente: string;
    Proyecto: string;
    CreadoPor: string;
    FechaCreacion: string;
    ObservacionesInternasEmpresa: string;
    EstadoRemision: string;
}

export function TablaVisualizarRemisiones(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();
    const [data, setData] = React.useState<Remision[]>([]);
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
                const response = await ConsultarRemisiones();
                setData(response);
            } catch (err) {
                setError(`Error al cargar las remisiones: ${err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'remision-creada' || ultimomensajes.tipo === 'remision-eliminada') {
                handleRefresh();
            }
        }
    }, [messages]);

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
        //     key: 'IdRemision',
        //     header: 'ID',
        //     width: '80px'
        // },
        {
            key: 'NoRemision',
            header: 'No. Remisión'
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
            header: 'Fecha Creación',
            // render: (row: Remision) => new Date(row.FechaCreacion).toLocaleDateString()
        },
        {
            key: 'ObservacionesInternasEmpresa',
            header: 'Observaciones',
            render: (row: Remision) => row.ObservacionesInternasEmpresa || '-'
        },
        {
            key: 'EstadoRemision',
            header: 'Estado',
            render: (row: Remision) => (
                <Chip
                    label={row.EstadoRemision}
                    color={getEstadoColor(row.EstadoRemision)}
                    size="small"
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        }
    ];

    // Función para mostrar/ocultar carga
    const manejarCarga = (mostrar: boolean, mensaje: string = '') => {
        setMostrarMensajeDeCarga(mostrar);
        setMensajeDeCarga(mensaje);
    };

    const actions: ActionDefinition<Remision>[] = [
        // {
        //     icon: <PencilSimple size={20} />,
        //     tooltip: 'Editar remisión',
        //     onClick: (row: Remision) => console.log('Editar:', row.IdRemision),
        //     color: 'primary'
        // },
        {
            render: (row: Remision) => (
                <GenerarPDFRemision
                    IdRemision={row.IdRemision}
                    onMostrarCarga={manejarCarga}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Imprimir remisión'
        },
        {
            render: (row: Remision) => (
                <GenerarPDF
                    servicioPDF={(id) => VisualizarPDFRemision(row.IdRemision)}
                    idRecurso={row.IdRemision}
                    nombreArchivo={`devolución-No${row.IdRemision}.pdf`}
                    mensajes={{
                        generando: 'Generando pdf de remisión. Por favor espere',
                        exito: 'PDF generado correctamente',
                        error: 'Error al generar el PDF de la remisión'
                    }}
                    onMostrarCarga={manejarCarga}
                    onMostrarMensaje={mostrarMensaje}
                    comportamiento="impresion"
                // icono={<Printer size={20} weight="bold" />}
                />
            ),
            tooltip: 'Imprimir'
        }
        // {
        //     render: (row: Remision) => (
        //         <BotonEliminarRemision
        //             IdRemision={row.IdRemision}
        //             NoRemision={row.NoRemision}
        //             sendMessage={sendMessage}
        //             mostrarMensaje={mostrarMensaje}
        //         />
        //     ),
        //     tooltip: 'Eliminar remisión',
        //     color: 'error'
        // }
    ];

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await ConsultarRemisiones();
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

    return (
        <>
            <DataTable<Remision>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron remisiones"
                rowKey={(row) => row.IdRemision}
                placeHolderBuscador='Buscar remisiones...'
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