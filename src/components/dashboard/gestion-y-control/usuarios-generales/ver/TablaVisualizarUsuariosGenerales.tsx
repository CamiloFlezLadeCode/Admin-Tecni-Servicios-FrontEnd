'use client';
import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { useRecargaPorEventos, ChipEstadoTexto } from '../../comun/tabla-comun';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { FormularioEditarUsuarioGeneral } from '@/components/dashboard/gestion-y-control/usuarios-generales/editar/FormularioEditarUsuarioGeneral';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarUsuariosGeneralesPaginado } from '@/services/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
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


const COLORES_USUARIO = {
    Activo: 'success',
    Inactivo: 'error',
    Cancelada: 'error',
    'En Proceso': 'info',
    Creado: 'info',
} as const;

export function TablaVisualizarUsuariosGenerales(): React.JSX.Element {
    // Paginado, búsqueda y recargas contra el servidor
    const tabla = usePaginacionServidor<UsuarioGeneral>({
        consultar: ConsultarUsuariosGeneralesPaginado,
        mensajeError: (error) => `Error al cargar los usuarios generales: ${error}`,
    });
    const { sendMessage, messages } = useSocketIO();

    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();



    useRecargaPorEventos(messages, ['usuario-actualizado', 'usuario-creado'], tabla.recargar);




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
            render: (row: UsuarioGeneral) => <ChipEstadoTexto estado={row.Estado} colores={COLORES_USUARIO} />
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
                data={tabla.datos}
                columns={columns}
                actions={actions}
                loading={tabla.cargando}
                error={tabla.error}
                searchTerm={tabla.busqueda}
                onSearchChange={tabla.setBusqueda}
                paginacionServidor={tabla.paginacionTabla}
                onRefresh={tabla.refrescar}
                emptyMessage="No se encontraron usuarios"
                rowKey={(row) => row.Documento}
                placeHolderBuscador='Buscar usuarios...'
            />

            <MensajeAlerta {...propsAlerta} />
        </>
    )
}