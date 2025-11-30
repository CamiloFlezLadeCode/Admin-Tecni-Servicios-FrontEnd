'use client';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { FormularioEditarUsuarioGeneral } from '@/components/dashboard/gestion-y-control/usuarios-generales/editar/FormularioEditarUsuarioGeneral';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarUsuariosGenerales } from '@/services/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesService';
import {
    Chip
} from '@mui/material';
import * as React from 'react';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

interface UsuarioGeneral {
    IdUsuario: number;
    Nombre: string;
    TipoDocumento: string;
    Documento: string;
    Correo: string;
    Direccion: string;
    Celular1: string;
    Celular2: string;
    RolesLabel: string;
    Nivel: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
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

export function TablaVisualizarUsuariosGenerales(): React.JSX.Element {
    const [data, setData] = React.useState<UsuarioGeneral[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { sendMessage, messages } = useSocketIO();

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    const CargarUsuariosGenerales = async () => {
        try {
            const data = await ConsultarUsuariosGenerales();
            setData(data);
        } catch (error) {
            console.error(`Error al cargar los usuarios generales: ${error}`);
            setError(`Error al cargar los usuarios: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        CargarUsuariosGenerales();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];

            if (ultimoMensaje.tipo === 'usuario-actualizado' || ultimoMensaje.tipo === 'usuario-creado') {
                CargarUsuariosGenerales();
            }
        }
    }, [messages]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            await CargarUsuariosGenerales();
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Activo': return 'success';
            case 'Inactivo': return 'error';
            case 'Cancelada': return 'error';
            case 'En Proceso': return 'info';
            case 'Creado': return 'info'
            default: return 'default';
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
            key: 'Nombre',
            header: 'Nombre'
        },
        {
            key: 'TipoDocumento',
            header: 'Tipo Documento'
        },
        {
            key: 'Documento',
            header: 'Documento'
        },
        {
            key: 'Correo',
            header: 'Correo'
        },
        {
            key: 'Direccion',
            header: 'Dirección'
        },
        {
            key: 'Celular1',
            header: 'Celular 1'
        },
        {
            key: 'Celular2',
            header: 'Celular 2'
        },
        {
            key: 'RolesLabel',
            header: 'Roles'
        },
        {
            key: 'Nivel',
            header: 'Nivel'
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
            render: (row: UsuarioGeneral) => (
                <Chip
                    label={row.Estado}
                    color={getEstadoColor(row.Estado)}
                    size="small"
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        },
    ];

    const actions = [
        {
            render: (row: UsuarioGeneral) => (
                <FormularioEditarUsuarioGeneral
                    DatosUsuarioAActualizar={row.Documento}
                    sendMessage={sendMessage}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar usuario'
        }
    ]
    return (
        <>
            <DataTable<UsuarioGeneral>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron usuarios"
                rowKey={(row) => row.Documento}
                placeHolderBuscador='Buscar usuarios...'
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