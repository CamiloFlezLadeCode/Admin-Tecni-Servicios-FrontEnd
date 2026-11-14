import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { EditarDevolucion } from '@/components/dashboard/comercial/devoluciones/acciones/EditarDevolucion';
import { ConEstado, ErrorApi, simularApi } from '@test/mocks/api';
import { comboPorEtiqueta, elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

const EMPRESA = '901893972-3';

const devolucion = {
  NoDevolucion: 'D-5',
  Cliente: 'Constructora Andes',
  DocumentoCliente: '900',
  Proyecto: 'Torre',
  IdProyecto: 3,
  Observaciones: '',
  PersonaQueRecibe: 'p1',
  PersonaQueEntrega: 'JUAN',
  FechaDevolucion: '05/03/2026 02:30 PM',
  IncluyeTransporte: 0,
  ValorTransporte: 0,
  Detalles: [
    {
      IdDetalleDevolucion: 11,
      IdDetalleRemision: 101,
      IdEquipo: 7,
      NombreEquipo: 'Andamio',
      CantidadArrendada: 5,
      CantidadADevolver: 2,
      EstadoEquipo: 1,
      IdRemision: 1,
      NoRemision: 'R-1',
      Subarrendatario: EMPRESA,
      NombreSubarrendatario: 'TECNISERVICIOS',
    },
    {
      IdDetalleDevolucion: 12,
      IdDetalleRemision: 102,
      IdEquipo: 8,
      Equipo: 'Formaleta',
      Cantidad: 3,
      CantidadDevuelta: 1,
      EstadoEquipo: 'x',
      IdRemision: 2,
      DocumentoSubarrendatario: '800',
      NombreSubarrendatario: 'Sub S.A.S',
    },
  ],
};

const pendientes = [
  { IdDetalleRemision: 201, IdRemision: 3, NoRemision: 'R-3', IdEquipo: 7, NombreEquipo: 'Andamio', CantidadArrendada: 4, CantidadPendiente: 2, Subarrendatario: EMPRESA },
  { IdDetalleRemision: 101, IdRemision: 1, NoRemision: 'R-1', IdEquipo: 7, NombreEquipo: 'Andamio', CantidadPendiente: 1, Subarrendatario: EMPRESA },
  { IdDetalleRemision: 301, IdRemision: 4, NoRemision: 'R-4', IdEquipo: 9, NombreEquipo: 'Puntal', CantidadPendiente: 3, Subarrendatario: '800', NombreSubarrendatario: 'Sub S.A.S' },
  { IdDetalleRemision: 302, IdRemision: 5, NoRemision: 'R-5', IdEquipo: 9, NombreEquipo: 'Puntal', CantidadPendiente: 2, Subarrendatario: '800', NombreSubarrendatario: 'Sub S.A.S' },
  { IdDetalleRemision: 401, IdRemision: 6, IdEquipo: 10, NombreEquipo: 'Devuelto', CantidadPendiente: 0 },
];

const rutas = {
  'GET /ver-devolucion-por-id': [devolucion],
  'GET /listar-estados': [
    { value: 1, label: 'Buen estado' },
    { value: 2, label: 'Dañado' },
    { value: 3, label: ' Perdido ' },
    { value: 4, label: 'Activo' },
  ],
  'GET /ver-profesionales-pertenecientes': [
    { value: 'p1', label: 'Pedro' },
    { value: 'p2', label: 'Paula' },
    { value: 'p3', label: 'Retirado', Activo: false },
  ],
  'GET /equipos-pendientes-por-devolver': pendientes,
};

const PUNTAL = 'Puntal | Subarren: Sub S.A.S | Pendiente: 5';

async function abrir(extra = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const sendMessage = vi.fn();
  const mostrarMensaje = vi.fn();
  const utilidades = renderConProveedores(
    <EditarDevolucion IdDevolucion={5} NoDevolucion="D-5" sendMessage={sendMessage} mostrarMensaje={mostrarMensaje} />
  );
  await utilidades.user.click(screen.getByRole('button', { name: 'Editar devolución' }));
  return { ...utilidades, api, sendMessage, mostrarMensaje };
}

const fila = (equipo: string) => screen.getByText(equipo).closest('tr')!;
const cantidad = (equipo: string) => within(fila(equipo)).getByRole('spinbutton');
const celdas = (equipo: string) => within(fila(equipo)).getAllByRole('cell').map((c) => c.textContent);

async function cargada() {
  await screen.findByText('Formaleta');
}

describe('EditarDevolucion', () => {
  it('carga la devolución y consolida los pendientes del mismo equipo', async () => {
    const { user, api } = await abrir();
    await cargada();
    expect(screen.getByText('Editar devolución: D-5')).toBeInTheDocument();
    expect(api.llamadasA('/ver-devolucion-por-id')[0].params).toEqual({ IdDevolucion: 5 });
    expect(api.llamadasA('/equipos-pendientes-por-devolver')[0].params).toMatchObject({ IdProyecto: 3, DocumentoCliente: '900' });
    expect(screen.getByLabelText('Cliente')).toHaveValue('Constructora Andes');
    expect(screen.getByLabelText('Proyecto')).toBeDisabled();
    expect(comboPorEtiqueta('Persona que recibe')).toHaveTextContent('Pedro');
    expect(comboPorEtiqueta('¿Incluye transporte?')).toHaveTextContent('NO');
    expect(screen.queryByLabelText(/^Valor transporte/)).not.toBeInTheDocument();
    // Andamio: 5 arrendadas en esta devolución + 2 pendientes de otra remisión.
    expect(celdas('Andamio').slice(1, 3)).toEqual(['R-1', '7']);
    expect(cantidad('Andamio')).toHaveValue(2);
    expect(celdas('Formaleta').slice(1, 3)).toEqual(['2', '3']);
    expect(within(fila('Formaleta')).getByRole('combobox')).toHaveTextContent('Sin seleccionar');
    expect(screen.getByText('Seleccione un equipo para agregarlo y ajustar cantidad/estado en la tabla inferior.')).toBeInTheDocument();

    await user.click(comboPorEtiqueta('Equipo pendiente'));
    const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(['Seleccione equipo pendiente', PUNTAL]);
    await user.keyboard('{Escape}');

    await user.click(within(fila('Andamio')).getByRole('combobox'));
    const estados = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(estados).toEqual(['Sin seleccionar', 'Buen estado', 'Dañado', ' Perdido ']);
    await user.keyboard('{Escape}');

    await user.click(comboPorEtiqueta('Persona que recibe'));
    expect(within(await screen.findByRole('listbox')).queryByText('Retirado')).not.toBeInTheDocument();
  });

  it('limita la cantidad devuelta entre 0 y la cantidad arrendada', async () => {
    await abrir();
    await cargada();
    fireEvent.change(cantidad('Andamio'), { target: { value: '99' } });
    expect(cantidad('Andamio')).toHaveValue(7);
    fireEvent.change(cantidad('Andamio'), { target: { value: '-3' } });
    expect(cantidad('Andamio')).toHaveValue(0);
    fireEvent.change(cantidad('Andamio'), { target: { value: '' } });
    expect(cantidad('Andamio')).toHaveValue(0);
  });

  it('valida transporte, quién recibe, valor y cantidades antes de guardar', async () => {
    const { user, api, mostrarMensaje } = await abrir({
      'GET /ver-devolucion-por-id': [{ ...devolucion, IncluyeTransporte: null }],
    });
    await cargada();
    const guardar = () => user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await guardar();
    expect(mostrarMensaje).toHaveBeenLastCalledWith('Debe indicar si incluye transporte', 'error');

    await elegirOpcion(user, '¿Incluye transporte?', 'SI');
    await elegirOpcion(user, 'Persona que recibe', 'Sin seleccionar');
    await guardar();
    expect(mostrarMensaje).toHaveBeenLastCalledWith('Debe especificar quién recibe los equipos cuando se incluye transporte', 'error');

    await elegirOpcion(user, 'Persona que recibe', 'Paula');
    await guardar();
    expect(mostrarMensaje).toHaveBeenLastCalledWith('El valor del transporte debe ser mayor a 0', 'error');

    fireEvent.change(screen.getByLabelText(/^Valor transporte/), { target: { value: '5000' } });
    fireEvent.change(cantidad('Formaleta'), { target: { value: '0' } });
    await guardar();
    expect(mostrarMensaje).toHaveBeenLastCalledWith('La cantidad devuelta debe ser mayor a 0 en todos los ítems', 'error');

    await elegirOpcion(user, '¿Incluye transporte?', 'Sin seleccionar');
    await guardar();
    expect(mostrarMensaje).toHaveBeenLastCalledWith('Debe indicar si incluye transporte', 'error');
    expect(api.llamadasA('/actualizar-devolucion')).toHaveLength(0);
  });

  it('reparte las cantidades entre el detalle existente y las remisiones pendientes', async () => {
    const { user, api, sendMessage, mostrarMensaje } = await abrir();
    await cargada();
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(mostrarMensaje).toHaveBeenLastCalledWith('Seleccione un equipo pendiente para agregar', 'error');

    await elegirOpcion(user, 'Equipo pendiente', PUNTAL);
    expect(screen.getByText('Pendiente total agrupado: 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(celdas('Puntal').slice(1, 3)).toEqual(['R-4, R-5', '5']);
    expect(cantidad('Puntal')).toHaveValue(1);
    expect(screen.getByText('No hay equipos pendientes disponibles para agregar.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDisabled();

    fireEvent.change(cantidad('Andamio'), { target: { value: '4' } });
    fireEvent.change(cantidad('Puntal'), { target: { value: '4' } });
    await user.click(within(fila('Andamio')).getByRole('combobox'));
    await user.click(within(await screen.findByRole('listbox')).getByRole('option', { name: 'Dañado' }));
    await elegirOpcion(user, '¿Incluye transporte?', 'SI');
    fireEvent.change(screen.getByLabelText(/^Valor transporte/), { target: { value: '5000' } });
    await elegirOpcion(user, 'Persona que recibe', 'Paula');
    await user.clear(screen.getByLabelText('Persona que entrega'));
    await user.type(screen.getByLabelText('Persona que entrega'), 'ana ruiz');
    expect(screen.getByLabelText('Persona que entrega')).toHaveValue('ANA RUIZ');
    await user.type(screen.getByLabelText('Observaciones'), 'ok');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => expect(mostrarMensaje).toHaveBeenLastCalledWith('Devolución actualizada con éxito', 'success'));
    const cuerpo = api.llamadasA('/actualizar-devolucion')[0].cuerpo as any;
    expect(cuerpo).toMatchObject({
      Observaciones: 'ok',
      PersonaQueRecibe: 'p2',
      PersonaQueEntrega: 'ANA RUIZ',
      IncluyeTransporte: true,
      ValorTransporte: 5000,
      UsuarioQueActualiza: '1001',
    });
    expect(cuerpo.FechaDevolucion).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/);
    const base = { Observaciones: '' };
    expect(cuerpo.Detalles).toEqual([
      { ...base, IdDetalleDevolucion: 11, IdDetalleRemision: 101, IdEquipo: '7', IdRemision: '1', CantidadDevuelta: 2, EstadoEquipo: 2, DocumentoSubarrendatario: EMPRESA },
      { ...base, IdDetalleRemision: 201, IdEquipo: '7', IdRemision: '3', CantidadDevuelta: 2, EstadoEquipo: 2, DocumentoSubarrendatario: EMPRESA },
      { ...base, IdDetalleDevolucion: 12, IdDetalleRemision: 102, IdEquipo: '8', IdRemision: '2', CantidadDevuelta: 1, EstadoEquipo: -1, DocumentoSubarrendatario: '800' },
      { ...base, IdDetalleRemision: 301, IdEquipo: '9', IdRemision: '4', CantidadDevuelta: 3, EstadoEquipo: -1, DocumentoSubarrendatario: '800' },
      { ...base, IdDetalleRemision: 302, IdEquipo: '9', IdRemision: '5', CantidadDevuelta: 1, EstadoEquipo: -1, DocumentoSubarrendatario: '800' },
    ]);
    expect(sendMessage).toHaveBeenCalledWith('devolucion-actualizada', { id: 5, numero: 'D-5', timestamp: expect.any(String) });
    await waitFor(() => expect(screen.queryByText('Editar devolución: D-5')).not.toBeInTheDocument(), { timeout: 3000 });
  });

  it('no deja devolver más de lo que suman el detalle original y los pendientes', async () => {
    const { mostrarMensaje, user, api } = await abrir();
    await cargada();
    fireEvent.change(cantidad('Andamio'), { target: { value: '7' } });
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() =>
      expect(mostrarMensaje).toHaveBeenLastCalledWith('Error al actualizar la devolución: La cantidad para Andamio supera la disponibilidad agrupada', 'error')
    );
    expect(api.llamadasA('/actualizar-devolucion')).toHaveLength(0);
  });

  it.each([
    [new ConEstado(201), 'La devolución fue eliminado por no contener items', 'success'],
    [new ConEstado(204), 'No se realizó ningún cambio', 'warning'],
    [new ErrorApi('La fecha es anterior a la remisión'), 'Error al actualizar la devolución: La fecha es anterior a la remisión', 'error'],
  ])('respuesta del backend %#', async (respuesta, mensaje, tipo) => {
    const { user, mostrarMensaje, sendMessage } = await abrir({ 'PUT /actualizar-devolucion': respuesta });
    await cargada();
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(mostrarMensaje).toHaveBeenLastCalledWith(mensaje, tipo));
    if (tipo === 'success') {
      expect(sendMessage).toHaveBeenCalledWith('devolucion-eliminada', expect.objectContaining({ id: 5 }));
    } else {
      expect(sendMessage).not.toHaveBeenCalled();
    }
  });

  it('cambiar a NO borra el valor del transporte y se pueden quitar ítems', async () => {
    const { user, api } = await abrir({ 'GET /ver-devolucion-por-id': [{ ...devolucion, IncluyeTransporte: true, ValorTransporte: 9000 }] });
    await cargada();
    expect(screen.getByLabelText(/^Valor transporte/)).toHaveValue(9000);
    await elegirOpcion(user, '¿Incluye transporte?', 'NO');
    await user.click(within(fila('Formaleta')).getAllByRole('button').at(-1)!);
    expect(screen.queryByText('Formaleta')).not.toBeInTheDocument();
    await user.click(within(fila('Andamio')).getAllByRole('button').at(-1)!);
    expect(screen.getByText('No se encontraron items para esta devolución')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(api.llamadasA('/actualizar-devolucion')).toHaveLength(1));
    expect(api.llamadasA('/actualizar-devolucion')[0].cuerpo).toMatchObject({ IncluyeTransporte: false, ValorTransporte: 0, Detalles: [] });
  });

  it('sin cliente/proyecto no consulta pendientes y acepta DetallesDevolucion', async () => {
    const { api } = await abrir({
      'GET /ver-devolucion-por-id': {
        ...devolucion,
        NoDevolucion: undefined,
        DocumentoCliente: undefined,
        Cliente: undefined,
        Detalles: undefined,
        DetallesDevolucion: [{ IdDetalleRemision: 55, IdEquipo: null, Equipo: undefined, IdRemision: null }],
      },
    });
    await screen.findByText('No hay equipos pendientes disponibles para agregar.');
    expect(screen.getByText('Editar devolución: D-5')).toBeInTheDocument();
    expect(api.llamadasA('/equipos-pendientes-por-devolver')).toHaveLength(0);
    expect(screen.getAllByRole('spinbutton')).toHaveLength(1);
  });

  it('informa si no puede cargar y se cierra con la X, Cancelar o Escape', async () => {
    const { user, mostrarMensaje } = await abrir({ 'GET /ver-devolucion-por-id': new ErrorApi('no existe') });
    await waitFor(() => expect(mostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al cargar la devolución'), 'error'));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.queryByText(/Editar devolución:/)).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Editar devolución' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText(/Editar devolución:/)).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Editar devolución' }));
    const cerrar = within(screen.getByText(/Editar devolución:/).parentElement!).getByRole('button');
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByText(/Editar devolución:/)).not.toBeInTheDocument());
  });
});
