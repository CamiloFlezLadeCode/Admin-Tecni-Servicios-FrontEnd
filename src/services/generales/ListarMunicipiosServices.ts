import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import type { ParametrosPaginacion, RespuestaPaginada } from '@/types/paginacion';

interface Params {
    Page: number,
    Limit: number,
    Search: string,
}
export const ListarMunicipios = async (Params: Params) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarmunicipios,
            {
                params: {
                    page: Params.Page,
                    limit: Params.Limit,
                    search: Params.Search,
                }
            }
        );
        return data;
    } catch (error) {
        console.error('Error al listar municipios:', error);
        throw error;
    }
}
/**
 * Adapta el listado de municipios (que pagina con `page`/`limit`/`search` y responde
 * `{ data, totalItems, totalPages }`) al contrato de `usePaginacionServidor`.
 */
export const ListarMunicipiosPaginado = async ({ pagina, limite, busqueda }: ParametrosPaginacion): Promise<RespuestaPaginada<any>> => {
    const res = await ListarMunicipios({ Page: pagina, Limit: limite, Search: busqueda ?? '' });
    const Datos = (res.data || res.Data || []) as any[];
    const Total = [res.totalItems, res.total, res.Total].find((valor) => typeof valor === 'number') ?? Datos.length;
    return { Datos, Total, Pagina: pagina, Limite: limite, TotalPaginas: Math.ceil(Total / limite) };
}
