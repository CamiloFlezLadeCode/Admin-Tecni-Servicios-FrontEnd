'use client';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarRepuestos } from '@/services/gestionycontrol/repuestos/ConsultarRepuestosService';
import { Chip } from '@mui/material';
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

// Se implemente la configuración para los colores de los estados de los repuestos
type EstadoDb = 'Disponible' | 'No disponible' | 'Reparación';
type EstadoKey = 'active' | 'inactive' | 'pending';

const estadoMap: Record<EstadoDb, EstadoKey> = {
    'Disponible': 'active',
    'No disponible': 'inactive',
    'Reparación': 'pending',
};

const Estado: Record<EstadoKey, { label: string; color: 'success' | 'error' | 'warning' }> = {
    active: { label: 'Disponible', color: 'success' },
    inactive: { label: 'No disponible', color: 'error' },
    pending: { label: 'En reparación', color: 'warning' },
};

// const normalizarEstado = (EstadoRepuesto: string): EstadoDb | null => {
//     const limpio = EstadoRepuesto.trim().toLowerCase();
//     if (limpio === 'disponible') return 'Disponible';
//     if (limpio === 'no disponible') return 'No disponible';
//     if (limpio === 'reparación') return 'Reparación';
//     return null;
// };
const normalizarEstado = (EstadoRepuesto: string | null | undefined): EstadoDb | null => {
    if (!EstadoRepuesto || typeof EstadoRepuesto !== 'string') return null;

    const limpio = EstadoRepuesto.trim().toLowerCase();

    if (limpio === 'disponible') return 'Disponible';
    if (limpio === 'no disponible') return 'No disponible';
    if (limpio === 'reparación') return 'Reparación';

    return null;
};

export function TablaVisualizarProyectos(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();
    const [data, setData] = React.useState<Repuesto[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

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

    const CargarRepuestos = async () => {
        try {
            setError(null);
            const data = await ConsultarRepuestos();
            setData(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        CargarRepuestos();
    }, []);

    const OperacionesStandar = new Set([
        'repuesto-creado',
        'repuesto-actualizado',
        'repuesto-eliminado',
        'entrada-repuestos-creada',
        'salida-repuestos-creada',
        'orden-de-servicio-creada'
    ]);
    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];
            if (OperacionesStandar.has(ultimoMensaje.tipo)) {
                CargarRepuestos();
            }
        }
    }, [messages]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await ConsultarRepuestos();
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
            render: (row: Repuesto) => {
                const estadoDb = normalizarEstado(row.EstadoRepuesto);
                const estadoKey = estadoDb ? estadoMap[estadoDb] : null;
                return (
                    <Chip
                        label={estadoKey ? Estado[estadoKey].label : row.EstadoRepuesto}
                        color={estadoKey ? Estado[estadoKey].color : 'default'}
                        size="small"
                        sx={{ width: 120, justifyContent: 'center' }}
                    />
                )
            }
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
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron repuestos"
                rowKey={(row) => row.IdRepuesto}
                placeHolderBuscador='Buscar repuestos...'
            />
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </>
    )
}