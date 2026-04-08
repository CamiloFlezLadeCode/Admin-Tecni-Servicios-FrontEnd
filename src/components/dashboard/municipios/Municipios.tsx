'use client';
import React from 'react';
import { PencilSimple, Trash } from '@phosphor-icons/react/dist/ssr';
import { ListarMunicipios } from '@/services/generales/ListarMunicipiosServices';
import { DataTableWithPaginationInServer } from '@/components/dashboard/componentes_generales/tablas/TablaReutilizableConPaginadoEnServidor';

export function Municipios(): React.JSX.Element {
    const [municipios, setMunicipios] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchMunicipios = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await ListarMunicipios({
                Page: page + 1,
                Limit: rowsPerPage,
                Search: debouncedSearchTerm,
            });
            const data = (res.data || res.Data || []) as any[];
            setMunicipios(data);
            const total =
                typeof res.totalItems === 'number'
                    ? res.totalItems
                    : typeof res.total === 'number'
                        ? res.total
                        : typeof res.Total === 'number'
                            ? res.Total
                            : Array.isArray(data)
                                ? data.length
                                : 0;
            setTotalCount(total);
        } catch (e) {
            setError('Error al cargar municipios');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearchTerm]);

    React.useEffect(() => {
        fetchMunicipios();
    }, [fetchMunicipios]);

    return (
        <>
            <DataTableWithPaginationInServer
                data={municipios}
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
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setPage(0);
                }}
                pagination={true}
                rowsPerPageOptions={[5, 10, 25]}
                defaultRowsPerPage={10}
                onRefresh={fetchMunicipios}
                emptyMessage={'No se encontraron municipios'}
                rowKey={(row: any) => row.IdMunicipio || Math.random()}
                stickyHeader={true}
                placeHolderBuscador="Buscar municipios"
                vista={1}
                MarginTop={2}
                serverPagination={true}
                serverPage={page}
                serverRowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onServerPageChange={setPage}
                onServerRowsPerPageChange={(rows) => {
                    setRowsPerPage(rows);
                    setPage(0);
                }}
            />
        </>
    )
}
