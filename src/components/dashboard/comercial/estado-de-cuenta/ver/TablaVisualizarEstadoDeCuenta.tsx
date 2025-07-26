'use client';
import { useEffect, useState } from 'react';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import {
    Chip,
    SelectChangeEvent,
    Paper,
    Card,
    CardContent,
    Box
} from '@mui/material';
import { VerEstadoDeCuentaCliente } from '@/services/comercial/estado_de_cuenta/VerEstadoDeCuentaClienteService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';

interface EstadoDeCuenta {
    IdDetalleRemison: number;
    Cliente: string;
    DocumentoCliente: string;
    NoRemision: string;
    FechaPrestamo: string;
    FechaDevolucion: string;
    Proyecto: string;
    Categoría: string;
    Equipo: string;
    CantidadPrestada: number;
    CantidadDevuelta: number;
    CantidadPendiente: number;
    TiempoPrestamo: string;
    Estado: string;
    ValorPendiente: number;
    PrecioUnitario: number;
}

export function TablaVisualizarEstadoDeCuenta(): JSX.Element {
    const [data, setData] = useState<EstadoDeCuenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientes, setClientes] = useState<{ value: string | number; label: string }[]>([]);
    const [datos, setDatos] = useState({
        Cliente: ''
    });

    useEffect(() => {
        const CargarClientes = async () => {
            try {
                const respuesta = await ListarClientes();
                setClientes(respuesta);
            } catch (error) {
                console.error(`Error al listar los clientes: ${error}`);
            }
        };

        CargarClientes();
    }, []);

    useEffect(() => {
        handleRefresh();
    }, [datos.Cliente])

    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Completo': return 'success';
            case 'Pendiente': return 'warning';
            case 'Cancelada': return 'error';
            case 'En Proceso': return 'info';
            case 'Creado': return 'info'
            default: return 'default';
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await VerEstadoDeCuentaCliente(datos.Cliente);
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'NoRemision',
            header: 'No Remision'
        },
        {
            key: 'FechaPrestamo',
            header: 'Fecha Prestamo'
        },
        {
            key: 'FechaDevolucion',
            header: 'Fecha Devolucion'
        },
        {
            key: 'Proyecto',
            header: 'Proyecto'
        },
        {
            key: 'Categoria',
            header: 'Categoria'
        },
        {
            key: 'Equipo',
            header: 'Equipo'
        },
        {
            key: 'CantidadPrestada',
            header: 'Cantidad Prestada'
        },
        {
            key: 'CantidadDevuelta',
            header: 'Cantidad Devuelta'
        },
        {
            key: 'CantidadPendiente',
            header: 'Cantidad Pendiente'
        },
        {
            key: 'TiempoPrestamo',
            header: 'Tiempo Prestamo'
        },
        {
            key: 'Estado',
            header: 'Estado',
            render: (row: EstadoDeCuenta) => (
                <Chip
                    label={row.Estado}
                    color={getEstadoColor(row.Estado)}
                    size="small"
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        },
        {
            key: '',
            header: ''
        }
    ];

    const actions: ActionDefinition<EstadoDeCuenta>[] = [

    ];

    return (
        <>
            <Box mb={2}>
                <Card>
                    <CardContent>
                        <InputSelect
                            label="Empresa/Cliente"
                            value={datos.Cliente}
                            options={clientes}
                            size="small"
                            onChange={handleChange}
                            valorname="Cliente"
                            required
                        />
                    </CardContent>
                </Card>
            </Box>



            {datos.Cliente && (
                <DataTable<EstadoDeCuenta>
                    data={data}
                    columns={columns}
                    actions={actions}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onRefresh={handleRefresh}
                    emptyMessage="No se encontraron registros"
                    rowKey={(row) => row.IdDetalleRemison}
                    placeHolderBuscador='Buscar registro...'
                />
            )}
        </>
    );
};
