'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { TraerEquipos } from '@/services/gestionycontrol/equipos/TraerEquiposRegistradosService';
import { Chip } from '@mui/material';
import * as React from 'react';
import { useCallback } from 'react'; // 🔥 Importar useCallback
import { FormularioEditarEquipo } from '../editar/FormularioEditarEquipo';

interface Equipo {
    IdEquipo: number;
    NombreEquipo: string;
    CategoriaEquipo: string;
    Cantidad: number;
    Subarrendatario: string;
    PrecioVenta: number;
    PrecioAlquiler: number;
    PrecioReparacion: number;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
}

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

const normalizarEstado = (estado: string): EstadoDb | null => {
    const limpio = estado.trim().toLowerCase();
    if (limpio === 'disponible') return 'Disponible';
    if (limpio === 'no disponible') return 'No disponible';
    if (limpio === 'reparación') return 'Reparación';
    return null;
};

type TipoMensaje =
    | 'equipo-actualizado'
    | 'equipo-creado'
    | 'remision-creada'
    | 'devolucion-creada'
    | 'remision-anulada';

interface Mensaje {
    tipo: TipoMensaje;
    [key: string]: any;
}

type Acciones = {
    [key in TipoMensaje]: () => Promise<void>;
};

export function TablaVisualizarEquipos(): React.JSX.Element {
    const [data, setData] = React.useState<Equipo[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { sendMessage, messages } = useSocketIO();
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // 🔥 Memoizar cargarEquipos con useCallback
    const cargarEquipos = async () => {
        try {
            const data = await TraerEquipos();
            setData(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    }; // 🔥 Dependencias vacías

    // 🔥 Memoizar mostrarMensaje con useCallback
    const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    }, []);

    React.useEffect(() => {
        cargarEquipos();
    }, []); // 🔥 cargarEquipos es estable ahora

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];

            if (ultimoMensaje.tipo === 'equipo-actualizado' || ultimoMensaje.tipo === 'equipo-creado' || ultimoMensaje.tipo === 'remision-creada' || ultimoMensaje.tipo === 'remision-anulada') {
                cargarEquipos();
            }
        }
    }, [messages]); // 🔥 Ambas funciones son estables ahora

    const columns = [
        {
            key: 'NombreEquipo',
            header: 'Nombre'
        },
        {
            key: 'CategoriaEquipo',
            header: 'Categoría'
        },
        {
            key: 'BodegaUbicacion',
            header: 'Bodega'
        },
        {
            key: 'Cantidad',
            header: 'Cantidad Total',
            align: 'right' as const
        },
        {
            key: 'CantidadDisponible',
            header: 'Cantidad Disponible',
            align: 'right' as const
        },
        {
            key: 'PrecioVenta',
            header: 'Precio Venta',
            align: 'right' as const
        },
        {
            key: 'PrecioAlquiler',
            header: 'Precio Alquiler',
            align: 'right' as const
        },
        {
            key: 'PrecioReparacion',
            header: 'Precio Reparación',
            align: 'right' as const
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
            key: 'Estado',
            header: 'Estado',
            render: (row: Equipo) => {
                const estadoDb = normalizarEstado(row.Estado);
                const estadoKey = estadoDb ? estadoMap[estadoDb] : null;

                return (
                    <Chip
                        label={estadoKey ? Estado[estadoKey].label : row.Estado}
                        color={estadoKey ? Estado[estadoKey].color : 'default'}
                        size="small"
                        sx={{ width: 120, justifyContent: 'center' }}
                    />
                );
            }
        }
    ];

    const actions = [
        {
            render: (row: Equipo) => (
                <FormularioEditarEquipo
                    IdEquipo={row.IdEquipo}
                    sendMessage={sendMessage}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar equipo'
        }
    ];

    // 🔥 Memoizar handleRefresh también
    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            await cargarEquipos();
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<Equipo>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron equipos"
                rowKey={(row) => row.IdEquipo}
                placeHolderBuscador='Buscar equipos...'
            />

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </>
    );
}