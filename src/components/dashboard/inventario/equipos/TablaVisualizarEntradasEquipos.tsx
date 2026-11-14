'use client';
import { useRecargaPorEventos } from '@/hooks/use-recarga-por-eventos';
import { CeldaObservaciones, accionVerDetalles } from '../comun/columnas-inventario';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerTodasLasEntradasDeEquiposPaginado } from '@/services/inventario/equipos/VerTodasLasEntradasDeEquiposService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { ModalRegistrarEntradaEquipos } from './ModalRegistrarVisualizarEntrada';

// Interface para la lista principal (solo datos básicos)
interface EntradaDeEquiposLista {
    NoEntradaEquipos: number;
    FechaEntrada: string;
    Responsable: string;
    NombreResponsable: string;
    Observaciones: string;
    UsuarioCreacion: string;
    CreadoPor: string;
    FechaCreacion: string;
};

export function TablaVisualizarEntradasEquipos(): React.JSX.Element {
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<EntradaDeEquiposLista>({
        consultar: VerTodasLasEntradasDeEquiposPaginado,
        mensajeError: (error) => `Error al cargar las entradas de los equipos: ${error}`,
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


    useRecargaPorEventos(messages, ['entrada-equipos-creada'], tabla.recargar);

    // Función para abrir modal de visualización
    const abrirModalVisualizacion = (entrada: EntradaDeEquiposLista) => {
        setNoEntradaParaVisualizar(entrada.NoEntradaEquipos);
    };

    // Función para cerrar modal de visualización
    const cerrarModalVisualizacion = () => {
        setNoEntradaParaVisualizar(null);
    };

    const columns = [
        {
            key: 'NoEntradaEquipos',
            header: 'NoEntrada'
        },
        {
            key: 'FechaEntrada',
            header: 'Fecha Entrada',
        },
        {
            key: 'NombreResponsable',
            header: 'Responsable'
        },
        {
            key: 'Observaciones',
            header: 'Observaciones',
            render: (row: EntradaDeEquiposLista) => <CeldaObservaciones texto={row.Observaciones} />
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

    const actions: ActionDefinition<EntradaDeEquiposLista>[] = [
        accionVerDetalles<EntradaDeEquiposLista>(abrirModalVisualizacion),
    ];




    return (
        <>
            <Card>
                <Typography variant='subtitle1' sx={{ p: '5px', fontWeight: 'normal' }}>
                    Visualización de entradas de equipos
                </Typography>
                <Divider />
                <CardContent>
                    {/* Modal para crear nuevas entradas */}
                    <ModalRegistrarEntradaEquipos
                        modo="crear"
                        onMostrarMensaje={mostrarMensaje}
                        sendMessage={sendMessage}
                        mensajesSocket={messages}
                    />

                    {/* Modal para visualizar entradas existentes */}
                    {noEntradaParaVisualizar && (
                        <ModalRegistrarEntradaEquipos
                            modo="visualizar"
                            noEntradaEquipos={noEntradaParaVisualizar}
                            onClose={cerrarModalVisualizacion}
                            onMostrarMensaje={mostrarMensaje}
                            sendMessage={sendMessage}
                            mensajesSocket={messages}
                        />
                    )}

                    <DataTable<EntradaDeEquiposLista>
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
                        rowKey={(row) => row.NoEntradaEquipos}
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