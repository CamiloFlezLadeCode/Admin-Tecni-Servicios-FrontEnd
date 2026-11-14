import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { FormularioCrearOrdenDeServicio } from '@/components/dashboard/comercial/ordenes-de-servicio/crear/FormularioCrearOrdenDeServicio';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { rutasBase } from '@test/mocks/fixtures';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

const rutas = {
  ...rutasBase,
  'GET /listar-clientes': () => [{ value: '900', label: 'Constructora Andes' }],
  'GET /ver-profesionales-pertenecientes': () => [
    { value: 'p1', label: 'Pedro' },
    { value: 'p2', label: 'Paula' },
  ],
  'GET /listar-mecanicos': () => [{ value: 'm1', label: 'Mario Mecánico' }],
  'GET /ver-repuestos-disponibles': () => [
    { value: 5, label: 'Filtro' },
    { value: 6, label: 'Correa' },
  ],
  'GET /listar-proyectos': () => [{ value: 3, label: 'Torre' }],
  'GET /ver-equipos-del-cliente': () => [{ value: 70, label: 'Mezcladora' }],
  'GET /ver-disponibilidad-de-repuesto': () => [{ CantidadDisponibleRepuesto: 4 }],
};

/** Inputs del Autocomplete de repuestos (los Select de MUI son <div role="combobox">). */
const repuestos = () => screen.getAllByRole('combobox').filter((c) => c.tagName === 'INPUT');
const cantidades = () => screen.getAllByRole('spinbutton');

async function montar(extra = {}, opciones = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const utilidades = renderConProveedores(<FormularioCrearOrdenDeServicio />, opciones);
  await waitFor(() => expect(screen.getByLabelText('Orden No:')).toHaveValue('OS-0042'));
  return { ...utilidades, api };
}

async function elegirRepuesto(user: Usuario, fila: number, nombre: string) {
  await user.click(repuestos()[fila]);
  await user.click(within(await screen.findByRole('listbox')).getByText(nombre));
}

async function llenarEncabezado(user: Usuario) {
  await elegirOpcion(user, 'Empresa/Cliente', 'Constructora Andes');
  await elegirOpcion(user, 'Obra/Proyecto', 'Torre');
  await elegirOpcion(user, 'Mecánico', 'Mario Mecánico');
  await elegirOpcion(user, 'Equipo', 'Mezcladora');
  await user.click(screen.getByRole('checkbox', { name: 'Sí' }));
  await elegirOpcion(user, /^Persona que entrega/, 'Paula');
  await user.type(screen.getByLabelText(/^Persona que recibe/), 'Luis');
}

async function crearYVer(user: Usuario, texto: string) {
  await user.click(screen.getByRole('button', { name: 'Crear orden' }));
  const alerta = (await screen.findByText(texto)).closest('[role="alert"]') as HTMLElement;
  await user.click(within(alerta).getByRole('button'));
  await waitFor(() => expect(screen.queryByText(texto)).not.toBeInTheDocument());
}

describe('FormularioCrearOrdenDeServicio', () => {
  it('carga el número, catálogos y repuestos de las bodegas de repuestos', async () => {
    const { api } = await montar();
    expect(api.llamadasA('/ver-repuestos-disponibles')[0].params).toEqual({ IdTipoBodega: 2 });
    expect(api.llamadasA('/ver-equipos-del-cliente')[0].params).toEqual({ IdTipoBodega: 1, DocumentoPropietario: 'SinSeleccionar' });
    expect(cantidades()[0]).toBeDisabled();
    expect(screen.getByLabelText('Cantidad disponible')).toHaveValue('N/A');
  });

  it('valida los obligatorios (incluida la garantía)', async () => {
    const { user, api } = await montar();
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));
    for (const mensaje of [
      'El cliente es obligatorio.',
      'La obra es obligatoria.',
      'La garantía es obligatoria.',
      'El mecánico es obligatorio.',
      'La persona que entrega es obligatoria.',
      'La persona que recibe es obligatoria.',
      'El equipo es obligatorio',
    ]) {
      expect(await screen.findByText(mensaje)).toBeInTheDocument();
    }
    expect(api.llamadasA('/crear-orden-de-servicio')).toHaveLength(0);
  });

  it('crea la orden con los repuestos usados y avisa', async () => {
    const { user, api } = await montar();
    await llenarEncabezado(user);
    expect(api.llamadasA('/ver-equipos-del-cliente').at(-1)!.params).toEqual({ IdTipoBodega: 1, DocumentoPropietario: '900' });
    await user.type(screen.getByLabelText('Descripción del servicio'), 'Cambio de filtro');
    await user.type(screen.getByLabelText('Observaciones generales'), 'Sin novedad');

    await elegirRepuesto(user, 0, 'Filtro');
    await waitFor(() => expect(screen.getByLabelText('Cantidad disponible')).toHaveValue('4'));
    expect(api.llamadasA('/ver-disponibilidad-de-repuesto')[0].params).toEqual({ IdTipoBodega: 2, IdRepuesto: 5 });
    fireEvent.change(cantidades()[0], { target: { value: '2' } });
    await user.type(screen.getAllByLabelText('Descripción adicional (opcional)')[0], 'motor');

    await user.click(screen.getByRole('button', { name: '+' }));
    expect(repuestos()).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(repuestos()).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Crear orden' }));
    expect(await screen.findByText('Orden de servicio creada correctamente.')).toBeInTheDocument();
    const cuerpo = api.llamadasA('/crear-orden-de-servicio')[0].cuerpo as any;
    expect(cuerpo).toMatchObject({
      NoOrdenDeServicio: 'OS-0042',
      DocumentoCliente: '900',
      IdProyecto: 3,
      Garantia: 1,
      Descripcion: 'Cambio de filtro',
      Observaciones: 'Sin novedad',
      DocumentoMecanico: 'm1',
      PersonaQueEntrega: 'p2',
      PersonaQueRecibe: 'Luis',
      UsuarioCreacion: '1001',
      IdEstado: 8,
      IdEquipoCliente: 70,
      Detalles: [{ Cantidad: 2, DescripcionEquipo: 'motor', IdRepuesto: 5 }],
    });
    expect(cuerpo.FechaOrdenDeServicio).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(sockets[0].emit).toHaveBeenCalledWith('orden-de-servicio-creada', {});
    await waitFor(() => expect(screen.getByLabelText(/^Persona que recibe/)).toHaveValue(''));
    expect(screen.getByLabelText('Orden No:')).toHaveValue('OS-0042');
    expect(screen.getByRole('checkbox', { name: 'Sí' })).not.toBeChecked();
  });

  it('sin repuestos envía Detalles vacío; garantía No', async () => {
    const { user, api } = await montar();
    await llenarEncabezado(user);
    await user.click(screen.getByRole('checkbox', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(repuestos()).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));
    await waitFor(() => expect(api.llamadasA('/crear-orden-de-servicio')).toHaveLength(1));
    expect(api.llamadasA('/crear-orden-de-servicio')[0].cuerpo).toMatchObject({ Garantia: 0, Detalles: [] });
  });

  it('valida cantidades de repuestos contra la disponibilidad', async () => {
    const { user, api } = await montar();
    await llenarEncabezado(user);
    await elegirRepuesto(user, 0, 'Filtro');
    await waitFor(() => expect(screen.getByLabelText('Cantidad disponible')).toHaveValue('4'));

    await crearYVer(user, 'El repuesto 1 debe tener una cantidad');

    fireEvent.change(cantidades()[0], { target: { value: '9' } });
    expect(screen.getByText('Máximo: 4')).toBeInTheDocument();
    await crearYVer(user, 'La cantidad del repuesto 1 excede la disponibilidad (4 disponibles)');

    fireEvent.change(cantidades()[0], { target: { value: '0' } });
    await crearYVer(user, 'La cantidad del repuesto 1 debe ser mayor a 0');

    fireEvent.change(cantidades()[0], { target: { value: '3' } });
    await user.click(screen.getByTitle('Clear'));
    expect(screen.getByLabelText('Cantidad disponible')).toHaveValue('N/A');
    await crearYVer(user, 'Debes seleccionar un repuesto válido en la posición 1 cuando ingresas una cantidad');
    expect(api.llamadasA('/crear-orden-de-servicio')).toHaveLength(0);
  });

  it('elegir un repuesto con cantidad ya escrita marca el exceso', async () => {
    const { user } = await montar({ 'GET /ver-disponibilidad-de-repuesto': () => [{ CantidadDisponibleRepuesto: 1 }] });
    await elegirRepuesto(user, 0, 'Filtro');
    await waitFor(() => expect(cantidades()[0]).toBeEnabled());
    fireEvent.change(cantidades()[0], { target: { value: '3' } });
    await elegirRepuesto(user, 0, 'Correa');
    expect(await screen.findByText('Máximo: 1')).toBeInTheDocument();
  });

  it('si falla la disponibilidad deja el repuesto sin cantidad disponible', async () => {
    await montar({ 'GET /ver-disponibilidad-de-repuesto': new ErrorApi('x') });
    const user = (await import('@testing-library/user-event')).default.setup();
    await elegirRepuesto(user, 0, 'Filtro');
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al ver la disponibilidad del repuesto')));
    expect(screen.getByLabelText('Cantidad disponible')).toHaveValue('N/A');
  });

  it('muestra el error del backend y recarga el número con el evento', async () => {
    const { user, api } = await montar({ 'POST /crear-orden-de-servicio': new ErrorApi('Equipo en reparación') }, { usuario: null });
    await llenarEncabezado(user);
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));
    expect(await screen.findByText('Hubo un error al crear la orden de servicio: Error: Equipo en reparación')).toBeInTheDocument();
    expect(api.llamadasA('/crear-orden-de-servicio')[0].cuerpo).toMatchObject({ UsuarioCreacion: null });

    api.definir({ 'GET /siguiente-no-orden-de-servicio': [{ SiguienteNoOrdenDeServicio: 'OS-0050' }] });
    act(() => emitirDesdeServidor('remision-creada', {}));
    act(() => emitirDesdeServidor('orden-de-servicio-creada', {}));
    await waitFor(() => expect(screen.getByLabelText('Orden No:')).toHaveValue('OS-0050'));
    api.definir({ 'GET /siguiente-no-orden-de-servicio': new ErrorApi('x') });
    act(() => emitirDesdeServidor('orden-de-servicio-creada', {}));
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al describir la acción')));
  });

  it('registra los errores de carga', async () => {
    simularApi({
      ...rutas,
      'GET /listar-clientes': new ErrorApi('x'),
      'GET /listar-proyectos': new ErrorApi('x'),
      'GET /ver-equipos-del-cliente': new ErrorApi('x'),
    });
    renderConProveedores(<FormularioCrearOrdenDeServicio />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar datos')));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al listar los proyectos'));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al describir la acción'));
  });
});
