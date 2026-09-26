'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarVehiculosPaginado } from '@/services/gestionycontrol/vehiculos/ConsultarVehiculosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
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

    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<Vehiculo>({
        consultar: ConsultarVehiculosPaginado,
        mensajeError: (error) => `Error al cargar los equipos: ${error}`,
    });

    // Se implementó acá porque si se dejaba en el componente "AlertaEliminarVehiculo.tsx", se perdía al momento de eliminar el vehículo
    // ya que al no estar presente en la tabla, este desmontaba el componente por completo impidiendo la visualización de la alerta de confirmación
    // Se declaran los estados para las alertas para la eliminación del vehículo
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    // ...


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
                tabla.recargar();
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


    return (
        <>
            <DataTable<Vehiculo>
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                onRefresh={tabla.refrescar}
                paginacionServidor={tabla.paginacionTabla}
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