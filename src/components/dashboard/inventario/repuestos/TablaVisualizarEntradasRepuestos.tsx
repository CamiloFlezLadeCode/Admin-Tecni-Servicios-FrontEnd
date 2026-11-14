'use client';
import { useRecargaPorEventos } from '@/hooks/use-recarga-por-eventos';
import { CeldaObservaciones, accionVerDetalles } from '../comun/columnas-inventario';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerTodasLasEntradasDeRepuestosPaginado } from '@/services/inventario/repuestos/VerTodasLasEntradasDeRepuestosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { ModalRegistrarVisualizarEntradaRepuestos } from './ModalRegistrarVisualizarEntradaRepuestos';

// Interface para la lista principal (solo datos básicos)
interface EntradaDeRepuestosLista {
    NoEntradaRepuestos: number;
    FechaEntrada: string;
    Responsable: string;
    NombreResponsable: string;
    Observaciones: string;
    UsuarioCreacion: string;
    CreadoPor: string;
    FechaCreacion: string;
};

export function TablaVisualizarEntradasRepuestos(): React.JSX.Element {
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<EntradaDeRepuestosLista>({
        consultar: VerTodasLasEntradasDeRepuestosPaginado,
        mensajeError: (error) => `Error al cargar las entradas de los repuestos: ${error}`,
    });
    const [noEntradaParaVisualizar, setNoEntradaParaVisualizar] = React.useState<number | null>(null);
    const { sendMessage, messages } = useSocketIO();

    // Estados para el manejo de las alertas
    const {
        mostrarAlertas,
        mensajeAlerta,
        tipoAlerta,
        mostrarMensaje,
        ocultarAlerta
    } = useAlertas();


    useRecargaPorEventos(messages, ['entrada-repuestos-creada'], tabla.recargar);

    // Función para abrir modal de visualización
    const abrirModalVisualizacion = (entrada: EntradaDeRepuestosLista) => {
        setNoEntradaParaVisualizar(entrada.NoEntradaRepuestos);
    };

    // Función para cerrar modal de visualización
    const cerrarModalVisualizacion = () => {
        setNoEntradaParaVisualizar(null);
    };

    const columns = [
        {
            key: 'NoEntradaRepuestos',
            header: 'NoEntrada'
        },
        {
            key: 'FechaEntrada',
            header: 'Fecha Entrada',
        },
        {
            key: 'Responsable',
            header: 'Responsable'
        },
        {
            key: 'Observaciones',
            header: 'Observaciones',
            render: (row: EntradaDeRepuestosLista) => <CeldaObservaciones texto={row.Observaciones} />
        },
        {
            key: 'CreadoPor',
            header: 'Creado Por'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación',
        },
    ];

    const actions: ActionDefinition<EntradaDeRepuestosLista>[] = [
        accionVerDetalles<EntradaDeRepuestosLista>(abrirModalVisualizacion),
    ];


    return (
        <>
            <Card>
                <Typography variant='subtitle1' sx={{ p: '5px', fontWeight: 'normal' }}>
                    Visualización de entradas de repuestos
                </Typography>
                <Divider />
                <CardContent>
                    {/* Modal para crear nuevas entradas */}
                    <ModalRegistrarVisualizarEntradaRepuestos
                        modo="crear"
                        onMostrarMensaje={mostrarMensaje}
                        sendMessage={sendMessage}
                        mensajesSocket={messages}
                    />

                    {/* Modal para visualizar entradas existentes */}
                    {noEntradaParaVisualizar && (
                        <ModalRegistrarVisualizarEntradaRepuestos
                            modo="visualizar"
                            noEntradaRepuestos={noEntradaParaVisualizar}
                            onClose={cerrarModalVisualizacion}
                            onMostrarMensaje={mostrarMensaje}
                            sendMessage={sendMessage}
                            mensajesSocket={messages}
                        />
                    )}

                    <DataTable<EntradaDeRepuestosLista>
                        data={tabla.datos}
                        columns={columns}
                        actions={actions}
                        loading={tabla.cargando}
                        error={tabla.error}
                        searchTerm={tabla.busqueda}
                        onSearchChange={tabla.setBusqueda}
                        paginacionServidor={tabla.paginacionTabla}
                        onRefresh={tabla.refrescar}
                        emptyMessage="No se encontraron entradas"
                        rowKey={(row) => row.NoEntradaRepuestos}
                        placeHolderBuscador='Buscar entradas...'
                        vista={1}
                        MarginTop={2}
                    />
                </CardContent>
            </Card>

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={ocultarAlerta}
            />
        </>
    );
}