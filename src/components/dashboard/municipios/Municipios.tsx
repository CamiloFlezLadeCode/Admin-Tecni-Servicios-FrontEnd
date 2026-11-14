'use client';
import React from 'react';
import { PencilSimple, Trash } from '@phosphor-icons/react/dist/ssr';
import { ListarMunicipiosPaginado } from '@/services/generales/ListarMunicipiosServices';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';

export function Municipios(): React.JSX.Element {
    const tabla = usePaginacionServidor<any>({
        consultar: ListarMunicipiosPaginado,
        mensajeError: () => 'Error al cargar municipios',
    });

    return (
        <DataTable
            data={tabla.datos}
            columns={[
                { key: 'IdMunicipio', header: 'ID' },
                { key: 'Nombre', header: 'Nombre' },
                { key: 'Codigo', header: 'Código' },
                { key: 'CodigoDepartamento', header: 'Código Departamento' },
            ]}
            actions={[
                {
                    icon: <PencilSimple size={18} />,
                    tooltip: 'Editar',
                    onClick: (row: any) => console.log('Editar', row),
                },
                {
                    icon: <Trash size={18} />,
                    tooltip: 'Eliminar',
                    onClick: (row: any) => console.log('Eliminar', row),
                },
            ]}
            loading={tabla.cargando}
            error={tabla.error}
            searchTerm={tabla.busqueda}
            onSearchChange={tabla.setBusqueda}
            pagination={true}
            rowsPerPageOptions={[5, 10, 25]}
            defaultRowsPerPage={10}
            onRefresh={tabla.refrescar}
            emptyMessage={'No se encontraron municipios'}
            rowKey={(row: any) => row.IdMunicipio}
            stickyHeader={true}
            placeHolderBuscador="Buscar municipios"
            vista={1}
            MarginTop={2}
            paginacionServidor={tabla.paginacionTabla}
        />
    )
}
