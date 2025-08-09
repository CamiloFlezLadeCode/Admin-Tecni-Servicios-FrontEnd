'use client';
import { useSocketIO } from '@/hooks/use-WebSocket';
import * as React from 'react';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { Chip } from '@mui/material';
import { VerBodegas } from '@/services/gestionycontrol/bodegas/VerBodegasService';
import { FormularioEditarBodega } from '../editar/FormularioEditarBodega';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

// 1. INTERFACES Ó TYPES
interface Bodega {
    IdBodega: number;
    NombreBodega: string;
    DescripcionBodega: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoBodega: string;
};

// 2. COMPONENTE PRINCIPAL
export function TablaVisualizarBodegas(): React.JSX.Element {
    // 3. HOOKS DE REACT Y OTROS HOOKS DE LIBRERÍAS

    // 4. ESTADOS
    const [data, setData] = React.useState<Bodega[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { sendMessage, messages } = useSocketIO();
    //Estados para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    //....

    // 5. USEEFFECT PARA CARGA DE DATOS INICIALES Y SOCKETS
    // Carga las bodegas al cargar la página
    React.useEffect(() => {
        CargarBodegas();
    }, []);
    // ....
    // Carga las bodegas cuando se emite un evento socket
    React.useEffect(() => {
        if (messages.length > 0) {
            const UltimoMensajeEmitido = messages[messages.length - 1];
            if (UltimoMensajeEmitido.tipo === 'bodega-creada' || UltimoMensajeEmitido.tipo === 'bodega-actualizada') {
                handleRefresh();
            }
        }
    }, [messages]);
    // ....
    // 6. FUNCIONES DEL COMPONENTE
    //Función para abrir la alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //....
    // Función para mostrar las bodegas
    const CargarBodegas = async () => {
        try {
            setError(null);
            const Bodegas = await VerBodegas();
            setData(Bodegas);
        } catch (error) {
            console.error(`Error al cargar las bodegas: ${error}`);
        } finally {
            setLoading(false);
        }
    };
    // ....
    // Función para refrescar los datos de la tabla
    const handleRefresh = async () => {
        try {
            setLoading(false);
            setError(null);
            setSearchTerm('');
            const response = await VerBodegas();
            setData(response);
        } catch (error) {
            setError('Error al actualizar las bodegas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // ....
    // Función para retornar el color dependiendo del estado
    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Activo': return 'success';
            case 'Inactivo': return 'error';
            default: return 'default';
        }
    };
    // ....

    const columns = [
        {
            key: 'IdBodega',
            header: 'Id',
        },
        {
            key: 'TipoBodega',
            header: 'Tipo'
        },
        {
            key: 'Subarrendatario',
            header: 'Propietario'
        },
        {
            key: 'NombreBodega',
            header: 'Bodega',
        },
        {
            key: 'DescripcionBodega',
            header: 'Descripción'
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
            key: 'EstadoBodega',
            header: 'Estado',
            render: (row: Bodega) => (
                <Chip
                    label={row.EstadoBodega}
                    color={getEstadoColor(row.EstadoBodega)}
                    size='small'
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        }
    ];

    const actions: ActionDefinition<Bodega>[] = [
        {
            render: (row: Bodega) => (
                <FormularioEditarBodega
                    IdBodega={row.IdBodega}
                />
            ),
            tooltip: 'Editar bodega'
        }
    ]

    // 7. RENDERIZADO DEL COMPONENTE PRINCIPAL JSX
    return (
        <>
            <DataTable<Bodega>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage='No se encontraron bodegas'
                rowKey={(row) => row.IdBodega}
                placeHolderBuscador='Buscar bodegas...'
            />

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </>
    );
};