'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerTodasLasEntradasDeEquipos } from '@/services/inventario/equipos/VerTodasLasEntradasDeEquiposService';
import {
    Card,
    CardContent,
    Divider,
    IconButton,
    Typography
} from '@mui/material';
import { Eye } from '@phosphor-icons/react/dist/ssr';
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
    const [data, setData] = React.useState<EntradaDeEquiposLista[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('')
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

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await VerTodasLasEntradasDeEquipos();
                setData(response);
            } catch (err) {
                setError(`Error al cargar las entradas de los equipos: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Socket
    React.useEffect(() => {
        if (messages.length > 0) {
            const UltimoMensaje = messages[messages.length - 1];
            if (UltimoMensaje.tipo === 'entrada-equipos-creada') {
                handleRefresh();
            }
        }
    }, [messages]);

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
            render: (row: EntradaDeEquiposLista) => (
                <Typography
                    variant="body2"
                    sx={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    title={row.Observaciones}
                >
                    {row.Observaciones || 'Sin observaciones'}
                </Typography>
            )
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
        {
            render: (row: EntradaDeEquiposLista) => (
                <IconButton
                    size="small"
                    onClick={() => abrirModalVisualizacion(row)}
                    color="primary"
                >
                    <Eye size={20} />
                </IconButton>
            ),
            tooltip: 'Ver detalles'
        },
    ];

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await VerTodasLasEntradasDeEquipos();
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Card>
                <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>
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
                        data={data}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onRefresh={handleRefresh}
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