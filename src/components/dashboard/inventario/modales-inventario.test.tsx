import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ModalRegistrarEntradaEquipos } from '@/components/dashboard/inventario/equipos/ModalRegistrarVisualizarEntrada';
import { ModalRegistrarVisualizarSalidaEquipos } from '@/components/dashboard/inventario/equipos/ModalRegistrarVisualizarSalidaEquipos';
import { ModalRegistrarVisualizarEntradaRepuestos } from '@/components/dashboard/inventario/repuestos/ModalRegistrarVisualizarEntradaRepuestos';
import { ModalRegistrarVisualizarSalidaRepuestos } from '@/components/dashboard/inventario/repuestos/ModalRegistrarVisualizarSalidaRepuestos';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { rutasBase } from '@test/mocks/fixtures';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

/**
 * Los cuatro modales de inventario (entrada/salida × equipos/repuestos) comparten el flujo:
 * encabezado (responsable, observaciones) + ítems (elemento, cantidad, unidad automática,
 * estado, observación) + guardar; y el modo visualizar que pinta un movimiento existente.
 */
interface Caso {
  nombre: string;
  Componente: React.ComponentType<any>;
  propNumero: string;
  boton: string;
  titulo: string;
  tituloVer: string;
  etiquetaNumero: string;
  numeroComoTexto: boolean;
  elemento: string;
  rutaElementos: string;
  /** Consulta de la unidad de medida cuando el listado no la trae. */
  rutaPorId: string;
  rutaNumero: string;
  rutaGuardar: string;
  rutaVer: string;
  paramVer: string;
  guardar: string;
  exito: string;
  errorGuardar: (msg: string) => string;
  errorVer: string;
  evento: string;
  /** La salida de repuestos abre su propio socket en lugar de recibirlo por props. */
  socketPropio: boolean;
  salida: boolean;
  /** Respuesta del backend para el modo visualizar. */
  respuestaVer: unknown;
  /** Solo la entrada de equipos ofrece únicamente estados Nuevo/Usado. */
  filtraEstados: boolean;
}

const detalleVer = { IdEquipo: 70, IdRepuesto: 70, Cantidad: 2, IdUnidadMedida: 1, IdUnidadDeMedida: 1, IdEstado: 1, Observacion: 'golpe', Observaciones: 'golpe' };

const casos: Caso[] = [
  {
    nombre: 'entrada de equipos',
    Componente: ModalRegistrarEntradaEquipos,
    propNumero: 'noEntradaEquipos',
    boton: '+ Nueva Entrada Equipos',
    titulo: 'Nueva entrada equipos',
    tituloVer: 'Detalles de entrada de equipos',
    etiquetaNumero: 'No Entrada',
    numeroComoTexto: false,
    elemento: 'Equipo',
    rutaElementos: 'GET /listar-equipos-propios',
    rutaPorId: '/ver-equipo',
    rutaNumero: '/siguiente-no-entrada-equipos',
    rutaGuardar: '/guardar-entrada-equipos',
    rutaVer: '/visualizar-entrada-equipos',
    paramVer: 'NoEntradaEquipos',
    guardar: 'Guardar Entrada',
    exito: 'Entrada de equipos creada correctamente',
    errorGuardar: (m) => `Hubo un error al crear la entrada de los equipos. Error: ${m}`,
    errorVer: 'Error al cargar los detalles de la entrada',
    evento: 'entrada-equipos-creada',
    socketPropio: false,
    salida: false,
    respuestaVer: [{ FechaEntrada: '10/11/2026 10:30 AM', Responsable: 'p1', Observaciones: 'Llegó', NoEntradaEquipos: 7, Equipos: [detalleVer] }],
    filtraEstados: true,
  },
  {
    nombre: 'salida de equipos',
    Componente: ModalRegistrarVisualizarSalidaEquipos,
    propNumero: 'noSalidaEquipos',
    boton: '+ Nueva Salida Equipos',
    titulo: 'Nueva salida equipos',
    tituloVer: 'Detalles de salida de equipos',
    etiquetaNumero: 'No. salida',
    numeroComoTexto: true,
    elemento: 'Equipo',
    rutaElementos: 'GET /listar-equipos-propios',
    rutaPorId: '/ver-equipo',
    rutaNumero: '/siguiente-no-salida-equipos',
    rutaGuardar: '/guardar-salida-equipos',
    rutaVer: '/visualizar-salida-equipos',
    paramVer: 'NoSalidaEquipos',
    guardar: 'Guardar Salida',
    exito: 'Salida registrada correctamente',
    errorGuardar: (m) => m,
    errorVer: 'Error al visualizar la salida',
    evento: 'salida-equipos-creada',
    socketPropio: false,
    salida: true,
    respuestaVer: { FechaSalida: '10/11/2026 10:30 AM', NoSalidaEquipos: 7, DocumentoResponsable: 'p1', Observaciones: 'Llegó', IdTipoMovimiento: 5, Equipos: [detalleVer] },
    filtraEstados: false,
  },
  {
    nombre: 'entrada de repuestos',
    Componente: ModalRegistrarVisualizarEntradaRepuestos,
    propNumero: 'noEntradaRepuestos',
    boton: '+ Nueva Entrada Repuestos',
    titulo: 'Nueva entrada repuestos',
    tituloVer: 'Detalles de entrada de repuestos',
    etiquetaNumero: 'No Entrada',
    numeroComoTexto: false,
    elemento: 'Repuesto',
    rutaElementos: 'GET /listar-repuestos',
    rutaPorId: '/ver-repuesto',
    rutaNumero: '/siguiente-no-entrada-repuestos',
    rutaGuardar: '/guardar-entrada-repuestos',
    rutaVer: '/visualizar-entrada-repuestos',
    paramVer: 'NoEntradaRepuestos',
    guardar: 'Guardar entrada',
    exito: 'Entrada de repuestos creada correctamente',
    errorGuardar: (m) => `Hubo un error al crear la entrada de repuestos. Error: ${m}`,
    errorVer: 'Error al cargar los detalles de la entrada',
    evento: 'entrada-repuestos-creada',
    socketPropio: false,
    salida: false,
    respuestaVer: { FechaEntrada: '2026-11-10T10:30:00', Responsable: 'p1', Observaciones: 'Llegó', NoEntradaRepuestos: 7, Repuestos: [detalleVer] },
    filtraEstados: false,
  },
  {
    nombre: 'salida de repuestos',
    Componente: ModalRegistrarVisualizarSalidaRepuestos,
    propNumero: 'noSalidaRepuestos',
    boton: '+ Nueva Salida Repuestos',
    titulo: 'Nueva salida repuestos',
    tituloVer: 'Detalles de salida de repuestos',
    etiquetaNumero: 'No. salida',
    numeroComoTexto: true,
    elemento: 'Repuesto',
    rutaElementos: 'GET /listar-repuestos',
    rutaPorId: '/ver-repuesto',
    rutaNumero: '/siguiente-no-salida-repuestos',
    rutaGuardar: '/guardar-salida-repuestos',
    rutaVer: '/visualizar-salida-repuestos',
    paramVer: 'NoSalidaRepuestos',
    guardar: 'Guardar salida',
    exito: 'Salida registrada correctamente',
    errorGuardar: (m) => m,
    errorVer: 'Error al visualizar la salida',
    evento: 'salida-repuestos-creada',
    socketPropio: true,
    salida: true,
    respuestaVer: { FechaSalida: '2026-11-10T10:30:00', NoSalidaRepuestos: 7, DocumentoResponsable: 'p1', Observaciones: 'Llegó', IdTipoMovimiento: 5, Repuestos: [detalleVer] },
    filtraEstados: false,
  },
];

const rutasComunes = (c: Caso) => ({
  ...rutasBase,
  'GET /ver-profesionales-pertenecientes': () => [
    { value: 'p1', label: 'Pedro' },
    { value: 'p9', label: 'Inactivo', Activo: false },
  ],
  'GET /listar-unidades-de-medida': () => [
    { value: 1, label: 'Unidad' },
    { value: 2, label: 'Metro' },
  ],
  'GET /listar-estados': () => [
    { value: 1, label: 'Nuevo' },
    { value: 2, label: 'Usado' },
    { value: 3, label: 'Dañado' },
  ],
  'GET /listar-tipos-movimiento-equipo': () => [
    { IdTipoMovimiento: 5, Nombre: 'Venta', Direccion: 'SALIDA' },
    { IdTipoMovimiento: 1, Nombre: 'Compra', Direccion: 'ENTRADA' },
  ],
  'GET /listar-tipos-movimiento-repuesto': () => [
    { IdTipoMovimiento: 5, Nombre: 'Venta', Direccion: 'SALIDA' },
    { IdTipoMovimiento: 1, Nombre: 'Compra', Direccion: 'ENTRADA' },
  ],
  // 70 trae su unidad en el listado; la de 71 se consulta al elegirlo.
  [c.rutaElementos]: () => [
    { value: 70, label: 'Mezcladora', IdUnidadMedida: 1 },
    { value: 71, label: 'Andamio' },
  ],
  [`GET ${c.rutaPorId}/*`]: () => [{ IdUnidadMedida: 2 }],
  [`GET ${c.rutaVer}`]: () => c.respuestaVer,
});

const filas = () => screen.getAllByRole('row').slice(1);
const fila = (texto: string) => filas().find((f) => f.textContent?.includes(texto))!;

describe.each(casos)('Modal de $nombre', (c) => {
  async function montar(extra = {}, props: Record<string, unknown> = {}) {
    const api = simularApi({ ...rutasComunes(c), ...extra });
    const onMostrarMensaje = vi.fn();
    const sendMessage = vi.fn();
    const propsBase = c.socketPropio ? { onMostrarMensaje } : { onMostrarMensaje, sendMessage };
    const utilidades = renderConProveedores(<c.Componente {...propsBase} {...props} />);
    return { ...utilidades, api, onMostrarMensaje, sendMessage, propsBase };
  }

  async function abrir(user: Usuario) {
    await user.click(screen.getByRole('button', { name: c.boton }));
    expect(await screen.findByText(c.titulo)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(new RegExp(`^${c.etiquetaNumero}`))).toHaveValue(c.numeroComoTexto ? '42' : 42));
  }

  async function elegirElemento(user: Usuario, nombre: string) {
    await user.click(screen.getByLabelText(new RegExp(`^${c.elemento}`)));
    await user.click(within(await screen.findByRole('listbox')).getByText(nombre));
  }

  async function agregarItem(user: Usuario, nombre: string, unidad: string, cantidad: string, estado: string) {
    await elegirElemento(user, nombre);
    await waitFor(() => expect(screen.getByLabelText(/^Unidad de medida/)).toHaveValue(unidad));
    fireEvent.change(screen.getByLabelText(/^Cantidad/), { target: { value: cantidad } });
    await elegirOpcion(user, /^Estado/, estado);
    await user.type(screen.getByLabelText(/^Observación/), `obs ${nombre}`);
    const agregar = screen.getByRole('button', { name: 'Agregar' });
    await waitFor(() => expect(agregar).toBeEnabled());
    await user.click(agregar);
  }

  it('registra el movimiento con sus ítems, avisa y recarga el número', async () => {
    const { user, api, onMostrarMensaje, sendMessage } = await montar();
    await abrir(user);
    const guardar = screen.getByRole('button', { name: c.guardar });
    expect(guardar).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDisabled();

    await elegirOpcion(user, /^Responsable/, 'Pedro');
    if (c.salida) await elegirOpcion(user, 'Tipo de movimiento', 'Venta');
    await user.type(screen.getByLabelText(/^Observaciones/), 'Mantenimiento');

    if (c.filtraEstados) {
      await user.click(screen.getByLabelText(new RegExp(`^${c.elemento}`)));
      await user.keyboard('{Escape}');
      await user.click(screen.getByLabelText(/^Estado/));
      const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
      expect(opciones).not.toContain('Dañado');
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    }

    await agregarItem(user, 'Mezcladora', 'Unidad', '3', 'Nuevo');
    expect(fila('Mezcladora')).toHaveTextContent('3');
    await agregarItem(user, 'Andamio', 'Metro', '1', 'Usado');
    expect(api.llamadasA(`${c.rutaPorId}/71`)).toHaveLength(1);
    expect(fila('Andamio')).toHaveTextContent('Metro');
    expect(filas()).toHaveLength(2);
    await user.click(within(fila('Andamio')).getByRole('button'));
    expect(filas()).toHaveLength(1);

    await waitFor(() => expect(guardar).toBeEnabled());
    await user.click(guardar);
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(c.exito, 'success'));
    const cuerpo = api.llamadasA(c.rutaGuardar)[0].cuerpo as any;
    const lista = cuerpo.Equipos ?? cuerpo.Repuestos;
    expect(cuerpo).toMatchObject({ DocumentoResponsable: 'p1', Observaciones: 'Mantenimiento', UsuarioCreacion: '1001' });
    expect(cuerpo[c.salida ? 'FechaSalida' : 'FechaEntrada']).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    if (c.salida) expect(cuerpo.IdTipoMovimiento).toBe(5);
    expect(lista).toHaveLength(1);
    expect(lista[0]).toMatchObject({ Cantidad: 3, IdUnidadMedida: 1, IdEstado: 1, Observacion: 'obs Mezcladora' });
    expect(lista[0].IdEquipo ?? lista[0].IdRepuesto).toBe(70);

    const emitir = c.socketPropio ? sockets[0].emit : sendMessage;
    expect(emitir).toHaveBeenCalledWith(c.evento, expect.anything());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(0));
    await waitFor(() => expect(api.llamadasA(c.rutaNumero).length).toBeGreaterThanOrEqual(2));
    expect(screen.getByRole('button', { name: c.guardar })).toBeDisabled();
  });

  it('muestra el error del backend al guardar', async () => {
    const { user, onMostrarMensaje } = await montar({ [`POST ${c.rutaGuardar}`]: new ErrorApi('Sin stock') });
    await abrir(user);
    await elegirOpcion(user, /^Responsable/, 'Pedro');
    await agregarItem(user, 'Mezcladora', 'Unidad', '1', 'Nuevo');
    await user.click(screen.getByRole('button', { name: c.guardar }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(c.errorGuardar('Sin stock'), 'error'));
    expect(filas()).toHaveLength(1);
  });

  it('si el elemento no tiene unidad conocida deja la unidad vacía y no permite agregar', async () => {
    const { user } = await montar({ [`GET ${c.rutaPorId}/*`]: new ErrorApi('x') });
    await abrir(user);
    await elegirElemento(user, 'Andamio');
    await elegirOpcion(user, /^Estado/, 'Nuevo');
    expect(screen.getByLabelText(/^Unidad de medida/)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDisabled();
  });

  it('recarga el número cuando otro usuario registra un movimiento', async () => {
    const { user, api, rerender, propsBase } = await montar();
    await abrir(user);
    const antes = api.llamadasA(c.rutaNumero).length;
    api.definir({ [`GET ${c.rutaNumero}`]: [{ [Object.keys((rutasBase as any)[`GET ${c.rutaNumero}`][0])[0]]: 43 }] });
    if (c.socketPropio) {
      act(() => emitirDesdeServidor('otro-evento', {}));
      act(() => emitirDesdeServidor(c.evento, {}));
    } else {
      rerender(<c.Componente {...propsBase} mensajesSocket={[{ tipo: 'otro-evento' }]} />);
      rerender(<c.Componente {...propsBase} mensajesSocket={[{ tipo: 'otro-evento' }, { tipo: c.evento }]} />);
    }
    await waitFor(() => expect(screen.getByLabelText(new RegExp(`^${c.etiquetaNumero}`))).toHaveValue(c.numeroComoTexto ? '43' : 43));
    expect(api.llamadasA(c.rutaNumero).length).toBe(antes + 1);
  });

  it('visualiza un movimiento existente sin permitir editarlo y se cierra', async () => {
    const onClose = vi.fn();
    const { user, api } = await montar({}, { modo: 'visualizar', [c.propNumero]: 7, onClose });
    expect(await screen.findByText(c.tituloVer)).toBeInTheDocument();
    await waitFor(() => expect(fila('Mezcladora')).toBeTruthy());
    expect(api.llamadasA(c.rutaVer)[0].params).toEqual({ [c.paramVer]: 7 });
    expect(api.llamadasA(c.rutaNumero)).toHaveLength(0);
    expect(fila('Mezcladora')).toHaveTextContent('Unidad');
    expect(fila('Mezcladora')).toHaveTextContent('Nuevo');
    expect(fila('Mezcladora')).toHaveTextContent('golpe');
    expect(screen.getByLabelText(/^Observaciones/)).toHaveValue('Llegó');
    expect(screen.queryByRole('button', { name: 'Agregar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: c.guardar })).not.toBeInTheDocument();
    expect(within(fila('Mezcladora')).queryByRole('button')).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('button')[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('avisa si no puede cargar el movimiento a visualizar', async () => {
    const { onMostrarMensaje } = await montar({ [`GET ${c.rutaVer}`]: new ErrorApi('no existe') }, { modo: 'visualizar', [c.propNumero]: 7 });
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining(c.errorVer), 'error'));
  });

  it('registra en consola los catálogos que no cargan', async () => {
    await montar({
      'GET /ver-profesionales-pertenecientes': new ErrorApi('x'),
      [c.rutaElementos]: new ErrorApi('x'),
      'GET /listar-unidades-de-medida': new ErrorApi('x'),
      'GET /listar-estados': new ErrorApi('x'),
      [`GET ${c.rutaNumero}`]: new ErrorApi('x'),
    });
    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});

describe('Modal de entrada de equipos (casos propios)', () => {
  it('sin datos en la respuesta avisa que no encontró la entrada', async () => {
    simularApi({ ...rutasComunes(casos[0]), 'GET /visualizar-entrada-equipos': [] });
    const onMostrarMensaje = vi.fn();
    renderConProveedores(<ModalRegistrarEntradaEquipos modo="visualizar" noEntradaEquipos={7} onMostrarMensaje={onMostrarMensaje} />);
    await waitFor(() =>
      expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('No se encontraron datos para esta entrada'), 'error')
    );
  });

  it('arma la etiqueta con código y nombre cuando el listado viene crudo y sin duplicados', async () => {
    simularApi({
      ...rutasComunes(casos[0]),
      'GET /listar-equipos-propios': () => [
        { IdEquipo: 80, CodigoEquipo: 'EQ-80', NombreEquipo: 'Vibrador', IdUnidadDeMedida: 2 },
        { IdEquipo: 80, CodigoEquipo: 'EQ-80', NombreEquipo: 'Vibrador' },
        { IdEquipo: 81 },
        { IdEquipo: 0 },
      ],
    });
    const { user } = renderConProveedores(<ModalRegistrarEntradaEquipos />);
    await user.click(screen.getByRole('button', { name: '+ Nueva Entrada Equipos' }));
    await user.click(await screen.findByLabelText(/^Equipo/));
    const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(expect.arrayContaining(['EQ-80 Vibrador', 'Equipo 81']));
    expect(opciones.filter((o) => o === 'EQ-80 Vibrador')).toHaveLength(1);
    await user.click(screen.getByText('EQ-80 Vibrador'));
    await waitFor(() => expect(screen.getByLabelText(/^Unidad de medida/)).toHaveValue('Metro'));
  });
});
