'use client';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarProyectos } from '@/services/gestionycontrol/proyectos/ConsultarProyectosService';
import { Chip } from '@mui/material';
import * as React from 'react';
import { ModalFormularioEditarProyecto } from '../editar/ModalFormularioEditarProyecto';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface Proyecto {
    IdProyecto: number;
    NombreProyecto: string;
    Cliente: string;
    DireccionProyecto: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoProyecto: string;
}

type EstadoDb = 'activo' | 'inactivo';
type EstadoKey = 'active' | 'inactive';

const estadoMap: Record<EstadoDb, EstadoKey> = {
    activo: 'active',
    inactivo: 'inactive',
};

const Estado: Record<EstadoKey, { label: string; color: 'success' | 'error' }> = {
    active: { label: 'Activo', color: 'success' },
    inactive: { label: 'Inactivo', color: 'error' },
};

export function TablaVisualizarProyectos(): React.JSX.Element {
    const [data, setData] = React.useState<Proyecto[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { sendMessage, messages } = useSocketIO();

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    const cargarProyectos = async () => {
        try {
            setError(null);
            const data = await ConsultarProyectos();
            setData(data);
        } catch (error) {
            setError('Error al cargar los proyectos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        cargarProyectos();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];
            if (ultimoMensaje.tipo === 'proyecto-actualizado' || ultimoMensaje.tipo === 'proyecto-creado') {
                cargarProyectos();
            }
        }
    }, [messages]);

    // Función para mostrar mensajes de alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    const columns = [
        {
            key: 'NombreProyecto',
            header: 'Nombre'
        },
        {
            key: 'Cliente',
            header: 'Cliente'
        },
        {
            key: 'DireccionProyecto',
            header: 'Dirección'
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
            key: 'EstadoProyecto',
            header: 'Estado',
            render: (row: Proyecto) => {
                const estadoKey = estadoMap[row.EstadoProyecto.toLowerCase() as EstadoDb] ?? 'inactive';
                return (
                    <Chip
                        label={Estado[estadoKey].label}
                        color={Estado[estadoKey].color}
                        size="small"
                        sx={{ width: 90, justifyContent: 'center' }}
                    />
                );
            }
        }
    ];

    const actions = [
        {
            render: (row: Proyecto) => (
                <ModalFormularioEditarProyecto
                    onMostrarMensaje={mostrarMensaje}
                    ProyectoAEditar={{ IdProyecto: row.IdProyecto }}
                    sendMessage={sendMessage}
                />
            ),
            tooltip: 'Editar proyecto'
        }
    ];

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            await cargarProyectos();
        } catch (err) {
            setError('Error al actualizar proyectos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<Proyecto>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron proyectos"
                rowKey={(row) => row.IdProyecto}
                placeHolderBuscador='Buscar proyectos...'
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