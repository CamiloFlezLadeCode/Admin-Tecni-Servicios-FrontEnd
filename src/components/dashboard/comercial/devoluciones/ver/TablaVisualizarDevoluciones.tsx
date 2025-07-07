'use client';

import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { VerTodasLasDevoluciones } from '@/services/comercial/devoluciones/VerTodasLasDevolucionesService';
import { GenerarPDFDevolucion } from '../acciones/GenerarPDFDevolucion';
import {
    Chip
} from '@mui/material';

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


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await VerTodasLasDevoluciones();
                setData(response);
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
            if (ultimomensajes.tipo === 'devolucion-creada') {
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
        {
            key: 'IdDevolucion',
            header: 'Id'
        },
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

    const actions: ActionDefinition<Devolucion>[] = [
        {
            render: (row: Devolucion) => (
                <GenerarPDFDevolucion
                    IdDevolucion={row.IdDevolucion}
                />
            ),
            tooltip: 'Imprimir'
        }
    ];

    return (
        <DataTable<Devolucion>
            data={data}
            columns={columns}
            actions={actions}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            emptyMessage="No se encontraron remisiones"
            rowKey={(row) => row.IdDevolucion}
            placeHolderBuscador='Buscar remisiones...'
        />
    )
}