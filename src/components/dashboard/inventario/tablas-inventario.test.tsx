import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { TablaVisualizarEntradasEquipos } from '@/components/dashboard/inventario/equipos/TablaVisualizarEntradasEquipos';
import { TablaVisualizarSalidasEquipos } from '@/components/dashboard/inventario/equipos/TablaVisualizarSalidasEquipos';
import { TablaVisualizarStockEquipos } from '@/components/dashboard/inventario/equipos/TablaVisualizarStockEquipos';
import { TablaVisualizarEntradasRepuestos } from '@/components/dashboard/inventario/repuestos/TablaVisualizarEntradasRepuestos';
import { TablaVisualizarSalidasRepuestos } from '@/components/dashboard/inventario/repuestos/TablaVisualizarSalidasRepuestos';
import { TablaVisualizarStockRepuestos } from '@/components/dashboard/inventario/repuestos/TablaVisualizarStockRepuestos';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { rutasBase } from '@test/mocks/fixtures';
import { emitirDesdeServidor } from '@test/mocks/socket';
import { act, renderConProveedores, screen, waitFor, within } from '@test/utils';

describe.each([
  {
    nombre: 'equipos',
    Componente: TablaVisualizarStockEquipos,
    ruta: '/ver-stock-equipos',
    filas: [
      { IdEquipo: 1, NombreEquipo: 'Andamio', Cantidad: 12, Estado: 'Disponible', UnidadMedida: 'Unidad', Extra: 'x' },
      { IdEquipo: 2, NombreEquipo: 'Formaleta', Cantidad: 3, Estado: 'Disponible' },
      { IdEquipo: 3, NombreEquipo: 'Puntal', Cantidad: 0, Estado: 'Agotado' },
      { IdEquipo: 4, NombreEquipo: 'Sin dato', Estado: 'Raro' },
    ],
    eventos: ['salida-equipos-creada', 'entrada-equipos-creada'],
    error: 'No fue posible cargar el stock de equipos',
  },
  {
    nombre: 'repuestos',
    Componente: TablaVisualizarStockRepuestos,
    ruta: '/ver-stock-repuestos',
    filas: [
      { IdRepuesto: 1, NombreRepuesto: 'Andamio', CantidadDisponible: 12, Estado: 'Disponible' },
      { IdRepuesto: 2, NombreRepuesto: 'Formaleta', CantidadDisponible: 3, Estado: 'Disponible' },
      { IdRepuesto: 3, NombreRepuesto: 'Puntal', CantidadDisponible: 0, Estado: 'Agotado' },
      { IdRepuesto: 4, NombreRepuesto: 'Sin dato', Estado: 'Raro' },
    ],
    eventos: ['salida-repuestos-creada', 'entrada-repuestos-creada'],
    error: 'No fue posible cargar el stock de repuestos',
  },
])('Stock de $nombre', ({ Componente, ruta, filas, eventos, error }) => {
  const fila = (nombre: string) => screen.getByText(nombre).closest('tr') as HTMLElement;

  it('clasifica la disponibilidad (OK / Bajo / Agotado) y filtra solo bajo stock en el servidor', async () => {
    const api = simularApi({ [`GET ${ruta}`]: () => paginar<unknown>(filas) });
    const { user } = renderConProveedores(<Componente />);
    await screen.findByText('Andamio');
    expect(api.llamadasA(ruta)[0].params).toEqual({ pagina: 1, limite: 10 });
    expect(within(fila('Andamio')).getByText('OK')).toBeInTheDocument();
    expect(within(fila('Formaleta')).getByText('Bajo')).toBeInTheDocument();
    expect(within(fila('Puntal')).getAllByText('Agotado')).toHaveLength(2);
    expect(within(fila('Sin dato')).getByText('0')).toBeInTheDocument();

    await user.click(screen.getByText('Todos los niveles'));
    await waitFor(() => expect(api.llamadasA(ruta).at(-1)!.params).toEqual({ pagina: 1, limite: 10, SoloBajoStock: true }));
    expect(screen.getByText('Solo bajo stock')).toBeInTheDocument();
    await user.click(screen.getByText('Solo bajo stock'));
    await waitFor(() => expect(api.llamadasA(ruta).at(-1)!.params).toEqual({ pagina: 1, limite: 10 }));
  });

  it('recarga con entradas y salidas, y avisa si no puede cargar', async () => {
    const api = simularApi({ [`GET ${ruta}`]: () => paginar<unknown>(filas) });
    const { unmount } = renderConProveedores(<Componente />);
    await screen.findByText('Andamio');
    act(() => emitirDesdeServidor('bodega-creada', {}));
    for (const [i, evento] of eventos.entries()) {
      act(() => emitirDesdeServidor(evento, {}));
      await waitFor(() => expect(api.llamadasA(ruta)).toHaveLength(i + 2));
    }
    unmount();
    simularApi({ [`GET ${ruta}`]: new ErrorApi('caído') });
    renderConProveedores(<Componente />);
    expect(await screen.findByText(error)).toBeInTheDocument();
  });
});

const comunes = {
  'GET /ver-profesionales-pertenecientes': () => [{ value: 'p1', label: 'Pedro' }],
  'GET /listar-unidades-de-medida': () => [{ value: 1, label: 'Unidad' }],
  'GET /listar-estados': () => [{ value: 1, label: 'Nuevo' }],
  'GET /listar-equipos-propios': () => [{ value: 70, label: 'Mezcladora', IdUnidadMedida: 1 }],
  'GET /listar-repuestos': () => [{ value: 70, label: 'Mezcladora', IdUnidadMedida: 1 }],
};

describe.each([
  {
    nombre: 'entradas de equipos',
    Componente: TablaVisualizarEntradasEquipos,
    ruta: '/ver-entradas-de-equipos',
    rutaVer: '/visualizar-entrada-equipos',
    fila: { NoEntradaEquipos: 5, FechaEntrada: '05/11/2026', NombreResponsable: 'Pedro Pérez', Observaciones: '', CreadoPor: 'Ana', FechaCreacion: '05/11/2026' },
    respuestaVer: [{ NoEntradaEquipos: 5, FechaEntrada: '05/11/2026 10:00 AM', Responsable: 'p1', Observaciones: 'Ok', Equipos: [] }],
    evento: 'entrada-equipos-creada',
    nuevo: '+ Nueva Entrada Equipos',
    titulo: 'Detalles de entrada de equipos',
    error: 'Error al cargar las entradas de los equipos',
  },
  {
    nombre: 'entradas de repuestos',
    Componente: TablaVisualizarEntradasRepuestos,
    ruta: '/ver-entradas-de-repuestos',
    rutaVer: '/visualizar-entrada-repuestos',
    fila: { NoEntradaRepuestos: 5, FechaEntrada: '05/11/2026', Responsable: 'Pedro Pérez', Observaciones: '', CreadoPor: 'Ana', FechaCreacion: '05/11/2026' },
    respuestaVer: { NoEntradaRepuestos: 5, FechaEntrada: '2026-11-05T10:00:00', Responsable: 'p1', Observaciones: 'Ok', Repuestos: [] },
    evento: 'entrada-repuestos-creada',
    nuevo: '+ Nueva Entrada Repuestos',
    titulo: 'Detalles de entrada de repuestos',
    error: 'Error al cargar las entradas de los repuestos',
  },
  {
    nombre: 'salidas de equipos',
    Componente: TablaVisualizarSalidasEquipos,
    ruta: '/ver-salidas-de-equipos',
    rutaVer: '/visualizar-salida-equipos',
    fila: { NoSalidaEquipos: 5, FechaSalida: '05/11/2026', NombreResponsable: 'Pedro Pérez', TipoMovimiento: 'Venta', Observaciones: '', CreadoPor: 'Ana', FechaCreacion: '05/11/2026' },
    respuestaVer: { NoSalidaEquipos: 5, FechaSalida: '05/11/2026 10:00 AM', DocumentoResponsable: 'p1', Observaciones: 'Ok', Equipos: [] },
    evento: 'salida-equipos-creada',
    nuevo: '+ Nueva Salida Equipos',
    titulo: 'Detalles de salida de equipos',
    error: 'Error al cargar las salidas de equipos',
  },
  {
    nombre: 'salidas de repuestos',
    Componente: TablaVisualizarSalidasRepuestos,
    ruta: '/ver-salidas-de-repuestos',
    rutaVer: '/visualizar-salida-repuestos',
    fila: { NoSalidaRepuestos: 5, FechaSalida: '05/11/2026', NombreResponsable: 'Pedro Pérez', TipoMovimiento: 'Venta', Observaciones: '', CreadoPor: 'Ana', FechaCreacion: '05/11/2026' },
    respuestaVer: { NoSalidaRepuestos: 5, FechaSalida: '2026-11-05T10:00:00', DocumentoResponsable: 'p1', Observaciones: 'Ok', Repuestos: [] },
    evento: 'salida-repuestos-creada',
    nuevo: '+ Nueva Salida Repuestos',
    titulo: 'Detalles de salida de repuestos',
    error: 'Error al cargar las salidas de repuestos',
  },
])('Listado de $nombre', ({ Componente, ruta, rutaVer, fila, respuestaVer, evento, nuevo, titulo, error }) => {
  const rutas = { ...rutasBase, ...comunes, [`GET ${ruta}`]: () => paginar([fila]), [`GET ${rutaVer}`]: () => respuestaVer };

  it('lista, abre el detalle de un movimiento y lo cierra', async () => {
    const api = simularApi(rutas);
    const { user } = renderConProveedores(<Componente />);
    const celda = await screen.findByText('Pedro Pérez');
    expect(api.llamadasA(ruta)[0].params).toEqual({ pagina: 1, limite: 10 });
    const tr = celda.closest('tr') as HTMLElement;
    expect(within(tr).getByText('Sin observaciones')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: nuevo })).toBeInTheDocument();

    await user.click(within(tr).getByRole('button'));
    expect(await screen.findByText(titulo)).toBeInTheDocument();
    await waitFor(() => expect(api.llamadasA(rutaVer)).toHaveLength(1));
    const modal = screen.getByText(titulo).closest('.MuiModal-root') as HTMLElement;
    await user.click(within(modal).getAllByRole('button')[0]);
    await waitFor(() => expect(screen.queryByText(titulo)).not.toBeInTheDocument());
  });

  it('recarga cuando se registra un movimiento y avisa si no puede cargar', async () => {
    const api = simularApi(rutas);
    const { unmount } = renderConProveedores(<Componente />);
    await screen.findByText('Pedro Pérez');
    act(() => emitirDesdeServidor('bodega-creada', {}));
    act(() => emitirDesdeServidor(evento, {}));
    await waitFor(() => expect(api.llamadasA(ruta)).toHaveLength(2));
    unmount();
    simularApi({ ...rutas, [`GET ${ruta}`]: new ErrorApi('caído') });
    renderConProveedores(<Componente />);
    expect(await screen.findByText(new RegExp(error))).toBeInTheDocument();
  });
});
