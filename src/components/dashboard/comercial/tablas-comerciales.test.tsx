import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { TablaVisualizarDevoluciones } from '@/components/dashboard/comercial/devoluciones/ver/TablaVisualizarDevoluciones';
import { TablaVisualizarOrdenesDeServicio } from '@/components/dashboard/comercial/ordenes-de-servicio/ver/TablaVisualizarOrdenesDeServicio';
import { TablaVisualizarRemisiones } from '@/components/dashboard/comercial/remisiones/ver/TablaVisualizarRemisiones';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, renderConProveedores, screen, waitFor, within } from '@test/utils';

/** Las tres tablas comerciales comparten listado paginado, imprimir PDF y eliminar con confirmación. */
interface Caso {
  nombre: string;
  Componente: React.ComponentType;
  rutaListado: string;
  fila: Record<string, unknown>;
  numero: string;
  columnas: string[];
  vacioObservaciones?: boolean;
  eventosRecarga: string[];
  pdf: { titulo: string; ruta: string; params?: Record<string, unknown> };
  eliminar: { aria: string; ruta: string; params: Record<string, unknown>; info: string; exito: string; error: string; evento: string };
  errorListado: string;
  vacio: string;
  editar?: string;
}

const casos: Caso[] = [
  {
    nombre: 'remisiones',
    Componente: TablaVisualizarRemisiones,
    rutaListado: '/ver-remisiones',
    fila: { IdRemision: 1, NoRemision: 'R-0001', Cliente: 'Constructora Andes', Proyecto: 'Torre', CreadoPor: 'Ana', FechaCreacion: '05/11/2026', ObservacionesInternasEmpresa: '', EstadoRemision: 'Creado' },
    numero: 'R-0001',
    columnas: ['No Remisión', 'Cliente', 'Proyecto', 'Creado Por', 'Fecha Creación', 'Observaciones', 'Estado'],
    vacioObservaciones: true,
    // 'remision-actualizada' lo espera la tabla, pero ni el backend lo emite ni use-WebSocket lo escucha.
    eventosRecarga: ['remision-creada', 'remision-eliminada'],
    pdf: { titulo: 'Generar PDF: remisión-No1.pdf', ruta: '/obtener-pdf-remision/1' },
    eliminar: {
      aria: 'eliminar-remision-1',
      ruta: '/eliminar-remision',
      params: { IdRemision: 1 },
      info: '¿Realmente quieres eliminar la remisión R-0001?',
      exito: 'Remisión eliminada correctamente',
      error: 'Error al eliminar remisión',
      evento: 'remision-eliminada',
    },
    errorListado: 'Error al cargar las remisiones',
    vacio: 'No se encontraron remisiones',
    editar: 'Editar remisión',
  },
  {
    nombre: 'devoluciones',
    Componente: TablaVisualizarDevoluciones,
    rutaListado: '/ver-todas-las-devoluciones',
    fila: { IdDevolucion: 1, IdRemision: 4, NoDevolucion: 'D-0001', NoRemision: 'R-0004', Cliente: 'Constructora Andes', Proyecto: 'Torre', CreadoPor: 'Ana', FechaCreacion: '05/11/2026', Estado: 'Anulado' },
    numero: 'D-0001',
    columnas: ['No Devolución', 'No Remisión', 'Cliente', 'Proyecto', 'Creado Por', 'Fecha Creación', 'Estado'],
    eventosRecarga: ['devolucion-creada', 'devolucion-eliminada', 'devolucion-actualizada'],
    pdf: { titulo: 'Generar PDF: devolución-No1.pdf', ruta: '/obtener-pdf-devolucion', params: { IdDevolucion: 1 } },
    eliminar: {
      aria: 'eliminar-devolucion-1',
      ruta: '/eliminar-devolucion',
      params: { IdDevolucion: 1 },
      info: '¿Realmente quieres eliminar la devolución D-0001?',
      exito: 'Devolución eliminada correctamente',
      error: 'Error al eliminar devolución',
      evento: 'devolucion-eliminada',
    },
    errorListado: 'Error al cargar las devoluciones',
    vacio: 'No se encontraron devoluciones',
    editar: 'Editar devolución',
  },
  {
    nombre: 'órdenes de servicio',
    Componente: TablaVisualizarOrdenesDeServicio,
    rutaListado: '/ver-todas-las-ordenes-de-servicio',
    fila: { IdOrdenDeServicio: 1, NoOrdenDeServicio: 'OS-0001', Cliente: 'Constructora Andes', Proyecto: 'Torre', Mecanico: 'Mario', CreadoPor: 'Ana', FechaCreacion: '05/11/2026', EstadoOrdenDeServicio: 'Creado' },
    numero: 'OS-0001',
    columnas: ['No Orden', 'Cliente', 'Proyecto', 'Mecánico', 'Fecha Creación', 'Creado Por', 'Estado'],
    eventosRecarga: ['orden-de-servicio-creada', 'orden-de-servicio-eliminada'],
    pdf: { titulo: 'Generar PDF: orden-de-servicio-No1.pdf', ruta: '/obtener-pdf-orden-de-servicio', params: { IdOrdenDeServicio: 1 } },
    eliminar: {
      aria: 'eliminar-orden-de-servicio-1',
      ruta: '/eliminar-orden-de-servicio',
      params: { IdOrdenDeServicio: 1 },
      info: '¿Realmente quieres eliminar la orden de servicio OS-0001?',
      exito: 'Orden de servicio eliminada correctamente',
      error: 'Error al eliminar orden de servicio',
      evento: 'orden-de-servicio-eliminada',
    },
    errorListado: 'Error al cargar las órdenes de servicio',
    vacio: 'No se encontraron órdenes de servicio',
  },
];

describe.each(casos)('Tabla de $nombre', (c) => {
  const pdf = new Blob(['%PDF'], { type: 'application/pdf' });
  const rutas = (extra = {}) => ({
    [`GET ${c.rutaListado}`]: () => paginar([c.fila]),
    [`GET ${c.pdf.ruta}`]: () => pdf,
    [`DELETE ${c.eliminar.ruta}`]: () => ({ message: 'eliminada' }),
    ...extra,
  });

  async function montar(extra = {}) {
    const api = simularApi(rutas(extra));
    const utilidades = renderConProveedores(<c.Componente />);
    await screen.findByText(c.numero);
    return { ...utilidades, api };
  }

  const fila = () => screen.getByText(c.numero).closest('tr') as HTMLElement;

  it('lista paginado en el servidor con sus columnas y acciones', async () => {
    const { api } = await montar();
    expect(api.llamadasA(c.rutaListado)[0].params).toEqual({ pagina: 1, limite: 10 });
    for (const columna of c.columnas) expect(screen.getByRole('columnheader', { name: columna })).toBeInTheDocument();
    expect(within(fila()).getByText('Constructora Andes')).toBeInTheDocument();
    if (c.vacioObservaciones) expect(within(fila()).getByText('-')).toBeInTheDocument();
    expect(within(fila()).getByTitle(c.pdf.titulo)).toBeInTheDocument();
    expect(within(fila()).getByRole('button', { name: c.eliminar.aria })).toBeInTheDocument();
    if (c.editar) expect(within(fila()).getByRole('button', { name: c.editar })).toBeInTheDocument();
  });

  it('recarga con sus eventos de socket y no con otros', async () => {
    const { api } = await montar();
    act(() => emitirDesdeServidor('bodega-creada', {}));
    let esperadas = 1;
    for (const evento of c.eventosRecarga) {
      act(() => emitirDesdeServidor(evento, {}));
      esperadas += 1;
      await waitFor(() => expect(api.llamadasA(c.rutaListado)).toHaveLength(esperadas));
    }
  });

  it('elimina tras confirmar, avisa por socket y muestra el éxito', async () => {
    const { user, api } = await montar();
    await user.click(within(fila()).getByRole('button', { name: c.eliminar.aria }));
    expect(await screen.findByText(c.eliminar.info)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sí' }));
    expect(await screen.findByText(c.eliminar.exito)).toBeInTheDocument();
    expect(api.llamadasA(c.eliminar.ruta)[0].params).toEqual(c.eliminar.params);
    expect(sockets[0].emit).toHaveBeenCalledWith(c.eliminar.evento, {});
  });

  it('muestra el error del backend al eliminar', async () => {
    const { user } = await montar({ [`DELETE ${c.eliminar.ruta}`]: new ErrorApi('Tiene movimientos') });
    await user.click(within(fila()).getByRole('button', { name: c.eliminar.aria }));
    await user.click(await screen.findByRole('button', { name: 'Sí' }));
    expect(await screen.findByText(`${c.eliminar.error} Tiene movimientos`)).toBeInTheDocument();
  });

  it('imprime el PDF del registro', async () => {
    const iframes = document.querySelectorAll('iframe').length;
    const { user, api } = await montar();
    await user.click(within(fila()).getByTitle(c.pdf.titulo));
    await waitFor(() => expect(api.llamadasA(c.pdf.ruta)).toHaveLength(1));
    if (c.pdf.params) expect(api.llamadasA(c.pdf.ruta)[0].params).toEqual(c.pdf.params);
    await waitFor(() => expect(document.querySelectorAll('iframe').length).toBe(iframes + 1), { timeout: 3000 });
  });

  it('informa el error del listado y el listado vacío', async () => {
    simularApi(rutas({ [`GET ${c.rutaListado}`]: new ErrorApi('caído') }));
    const { unmount } = renderConProveedores(<c.Componente />);
    expect(await screen.findByText(new RegExp(c.errorListado))).toBeInTheDocument();
    unmount();
    simularApi(rutas({ [`GET ${c.rutaListado}`]: () => paginar([]) }));
    renderConProveedores(<c.Componente />);
    expect(await screen.findByText(c.vacio)).toBeInTheDocument();
  });
});
