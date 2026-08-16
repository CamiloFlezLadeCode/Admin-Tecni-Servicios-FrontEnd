'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarVehiculos } from '@/services/gestionycontrol/vehiculos/ConsultarVehiculosService';
import { Chip } from '@mui/material';
import * as React from 'react';
import { FormularioModalEditarVehiculo } from '../editar/FormularioEditarVehiculo';
// Acciones generales
import { EliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/EliminarRegistro';
// Servicios
import { EliminarVehiculo } from '@/services/gestionycontrol/vehiculos/EliminarVehiculoService';

interface Vehiculo {
    Estado: string;
    IdVehiculo: number;
    Placa: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
}

export function TablaVisualizarVehiculos(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();

    const [data, setData] = React.useState<Vehiculo[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Se implementó acá porque si se dejaba en el componente "AlertaEliminarVehiculo.tsx", se perdía al momento de eliminar el vehículo
    // ya que al no estar presente en la tabla, este desmontaba el componente por completo impidiendo la visualización de la alerta de confirmación
    // Se declaran los estados para las alertas para la eliminación del vehículo
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    // ...

    const CargarVehiculos = async () => {
        try {
            setError(null);
            const data = await ConsultarVehiculos();
            setData(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        CargarVehiculos();
    }, []);

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Activo': return 'success';
            case 'Inactivo': return 'error';
            default: return 'default';
        }
    };

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'vehiculo-creado' || ultimomensajes.tipo === 'vehiculo-actualizado' || ultimomensajes.tipo === 'vehiculo-eliminado') {
                CargarVehiculos();
            }
        }
    }, [messages]);

    const columns = [
        {
            key: 'IdVehiculo',
            header: 'IdVehículo'
        },
        {
            key: 'Placa',
            header: 'Placa'
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
            render: (row: Vehiculo) => {
                return (
                    <Chip
                        label={row.Estado}
                        color={getEstadoColor(row.Estado)}
                        size="small"
                        sx={{ minWidth: 100 }}
                    />
                )
            }
        }
    ];

    const actions: ActionDefinition<Vehiculo>[] = [
        {
            render: (row: Vehiculo) => (
                <FormularioModalEditarVehiculo
                    IdVehiculo={row.IdVehiculo}
                    sendMessage={sendMessage}
                    onMostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar vehiculo'
        },
        {
            render: (row: Vehiculo) => (
                <EliminarRegistro
                    servicioEliminarRegistro={(id) => EliminarVehiculo(row.IdVehiculo)}
                    idRecurso={row.IdVehiculo}
                    sendMessage={sendMessage}
                    mostrarMensaje={mostrarMensaje}
                    mensajes={{
                        ariaLabel: `eliminar-vehiculo-${row.Placa}`,
                        socket: 'vehiculo-eliminado',
                        info: `¿Realmente quieres eliminar el vehículo con placa ${row.Placa}?`,
                        exito: 'Vehículo eliminado correctamente',
                        error: 'Error al eliminar el vehículo'
                    }}
                />
            ),
            tooltip: 'Eliminar vehículo'
        }
        // {
        //     render: (row: Vehiculo) => (
        //         < AlertaEliminarVehiculo
        //             IdVehiculo={row.IdVehiculo}
        //             NombrePlacaVehiculo={row.Placa}
        //             sendMessage={sendMessage} // 👈 pásalo como prop
        //             mostrarMensaje={mostrarMensaje}
        //         />
        //     ),
        //     tooltip: 'Eliminar vehiculo'
        // }
    ];

    // Funcionalidad para abrir/mostrar la alerta para la eliminación del vehículo
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    // ...

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await ConsultarVehiculos();
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<Vehiculo>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron vehículos"
                rowKey={(row) => row.IdVehiculo}
                placeHolderBuscador='Buscar vehículos...'
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