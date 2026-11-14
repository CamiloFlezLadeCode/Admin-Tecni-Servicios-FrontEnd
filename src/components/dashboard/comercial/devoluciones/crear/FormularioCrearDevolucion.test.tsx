import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { FormularioCrearDevolucion } from '@/components/dashboard/comercial/devoluciones/crear/FormularioCrearDevolucion';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { rutasBase } from '@test/mocks/fixtures';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

const EMPRESA = '901893972-3';

const pendientes = [
  {
    IdEquipo: 7,
    NombreEquipo: 'Andamio',
    CantidadArrendada: 5,
    CantidadPendiente: '3',
    IdRemision: 1,
    NoRemision: 'R-1',
    Descripcion: 'Remisión R-1',
    Subarrendatario: EMPRESA,
    IdDetalleRemision: 101,
    FechaRemisionOrden: '2026-01-01 10:00',
  },
  {
    IdEquipo: 8,
    NombreEquipo: 'Formaleta',
    CantidadArrendada: 2,
    CantidadPendiente: '2',
    IdRemision: 2,
    NoRemision: 'R-2',
    Descripcion: 'Remisión R-2',
    Subarrendatario: '800',
    IdDetalleRemision: 102,
    FechaRemisionOrden: '2099-01-01 10:00',
  },
];

const rutas = {
  ...rutasBase,
  'GET /listar-clientes': () => [
    { value: '900', label: 'Constructora Andes' },
    { value: '901', label: 'Obras del Valle' },
  ],
  'GET /listar-estados': () => [
    { value: 1, label: 'Buen estado' },
    { value: 2, label: 'Dañado' },
    { value: 3, label: 'Perdido' },
    { value: 4, label: 'Activo' },
  ],
  'GET /ver-profesionales-pertenecientes': () => [
    { value: 'p1', label: 'Pedro' },
    { value: 'p2', label: 'Paula' },
  ],
  'GET /listar-proyectos': () => [{ value: 3, label: 'Torre' }],
  'GET /ver-subarrendatarios-con-remisiones-asignadas-para-cliente-proyecto': () => [{ value: EMPRESA, label: 'TECNI' }],
  'GET /equipos-pendientes-por-devolver': () => pendientes.map((p) => ({ ...p })),
};

const fila = (equipo: string) => screen.getByText(equipo, { selector: 'td' }).closest('tr')!;
const cantidad = (equipo: string) => within(fila(equipo)).getByRole('spinbutton');
const crear = () => screen.getByRole('button', { name: 'Crear devolución' });

async function montar(extra = {}, opciones = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const utilidades = renderConProveedores(<FormularioCrearDevolucion />, opciones);
  await waitFor(() => expect(screen.getByLabelText('Devolución No:')).toHaveValue('D-0042'));
  return { ...utilidades, api };
}

async function conPendientes(user: Usuario) {
  await elegirOpcion(user, 'Cliente', 'Constructora Andes');
  await elegirOpcion(user, 'Proyecto', 'Torre');
  await screen.findByText('Andamio', { selector: 'td' });
}

/** Pulsa crear, espera el aviso y lo cierra para que no interfiera con el siguiente. */
async function crearYVer(user: Usuario, texto: string) {
  await user.click(crear());
  const alerta = (await screen.findByText(texto)).closest('[role="alert"]') as HTMLElement;
  await user.click(within(alerta).getByRole('button'));
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
}

async function elegirEstado(user: Usuario, equipo: string, estado: string) {
  await user.click(within(fila(equipo)).getByRole('combobox'));
  await user.click(within(await screen.findByRole('listbox')).getByRole('option', { name: estado }));
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
}

describe('FormularioCrearDevolucion', () => {
  it('carga el número y, al elegir cliente y proyecto, los equipos pendientes', async () => {
    const { user, api } = await montar();
    expect(crear()).toBeDisabled();
    await conPendientes(user);
    expect(api.llamadasA('/listar-proyectos').at(-1)!.params).toEqual({ Cliente: '900' });
    expect(api.llamadasA('/equipos-pendientes-por-devolver').at(-1)!.params).toMatchObject({ IdProyecto: 3 });
    expect(api.llamadasA('/ver-subarrendatarios-con-remisiones-asignadas-para-cliente-proyecto')).toHaveLength(1);
    expect(within(fila('Andamio')).getByText('Remisión R-1')).toBeInTheDocument();
    await user.click(within(fila('Andamio')).getByRole('combobox'));
    const estados = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(estados).toEqual(['Sin seleccionar', 'Buen estado', 'Dañado', 'Perdido']);
  });

  it('limita la cantidad a devolver a lo pendiente', async () => {
    const { user } = await montar();
    await conPendientes(user);
    fireEvent.change(cantidad('Andamio'), { target: { value: '9' } });
    expect(cantidad('Andamio')).toHaveValue(3);
    fireEvent.change(cantidad('Andamio'), { target: { value: '02' } });
    expect(cantidad('Andamio')).toHaveValue(2);
    fireEvent.change(cantidad('Andamio'), { target: { value: '' } });
    expect(cantidad('Andamio')).toHaveValue(null);
  });

  it('no deja devolver antes de la fecha de la remisión', async () => {
    const { user } = await montar();
    await conPendientes(user);
    fireEvent.change(cantidad('Formaleta'), { target: { value: '1' } });
    expect(await screen.findByText(/es anterior a la remisión No\. R-2 \(01\/01\/2099 10:00 AM\)/)).toHaveTextContent('quite ese equipo');
    expect(crear()).toBeDisabled();
    fireEvent.change(cantidad('Formaleta'), { target: { value: '0' } });
    expect(screen.queryByText(/es anterior a/)).not.toBeInTheDocument();
    expect(crear()).toBeEnabled();
  });

  it('valida transporte, valor, cantidades y quién recibe', async () => {
    const { user, api } = await montar();
    await conPendientes(user);
    await crearYVer(user, 'Debe indicar si incluye transporte');
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'SI');
    await crearYVer(user, 'El valor del transporte debe ser mayor a 0');
    fireEvent.change(screen.getByLabelText(/^Valor Transporte/), { target: { value: '5000' } });
    await crearYVer(user, 'Debe ingresar una cantidad a devolver mayor a 0');
    fireEvent.change(cantidad('Andamio'), { target: { value: '2' } });
    await crearYVer(user, 'Debe especificar quién recibe los equipos cuando se incluye transporte');
    expect(api.llamadasA('/crear-devolucion')).toHaveLength(0);
  });

  it('crea la devolución solo con los ítems con cantidad y recarga los pendientes', async () => {
    const { user, api } = await montar();
    await conPendientes(user);
    fireEvent.change(cantidad('Andamio'), { target: { value: '2' } });
    await elegirEstado(user, 'Andamio', 'Dañado');
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'SI');
    fireEvent.change(screen.getByLabelText(/^Valor Transporte/), { target: { value: '5000' } });
    await elegirOpcion(user, /^Recibe/, 'Paula');
    await user.type(screen.getByLabelText('Entrega'), 'ana ruiz');
    expect(screen.getByLabelText('Entrega')).toHaveValue('ANA RUIZ');
    await user.type(screen.getByLabelText('Observaciones'), 'ok');
    await user.click(crear());

    expect(await screen.findByText('Devolución creada correctamente')).toBeInTheDocument();
    const cuerpo = api.llamadasA('/crear-devolucion')[0].cuerpo as any;
    expect(cuerpo).toMatchObject({
      NoDevolucion: 'D-0042',
      DocumentoCliente: '900',
      IdRemision: null,
      IdProyecto: 3,
      Observaciones: 'ok',
      UsuarioCreacion: '1001',
      IdEstado: 8,
      PersonaQueRecibe: 'p2',
      PersonaQueEntrega: 'ANA RUIZ',
      DocumentoSubarrendatario: '',
      IncluyeTransporte: true,
      ValorTransporte: 5000,
    });
    expect(cuerpo.FechaDevolucion).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(cuerpo.Detalles).toEqual([
      {
        IdEquipo: 7,
        NombreEquipo: 'Andamio',
        CantidadArrendada: 5,
        CantidadPendiente: '3',
        CantidadADevolver: 2,
        EstadoEquipo: 2,
        Observaciones: '',
        IdRemision: 1,
        DocumentoSubarrendatario: EMPRESA,
        IdDetalleRemision: 101,
      },
    ]);
    expect(sockets[0].emit).toHaveBeenCalledWith('devolucion-creada', {});
    await waitFor(() => expect(api.llamadasA('/equipos-pendientes-por-devolver')).toHaveLength(2));
    expect(screen.getByLabelText('Entrega')).toHaveValue('');
  });

  it('transporte NO: no exige quién recibe y envía valor 0; muestra el error del backend', async () => {
    const { user, api } = await montar({ 'POST /crear-devolucion': new ErrorApi('Fecha inválida') }, { usuario: null });
    await conPendientes(user);
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'SI');
    fireEvent.change(screen.getByLabelText(/^Valor Transporte/), { target: { value: '9' } });
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'NO');
    fireEvent.change(cantidad('Andamio'), { target: { value: '1' } });
    await user.click(crear());
    expect(await screen.findByText('Hubo un error al crear la devolución: Fecha inválida')).toBeInTheDocument();
    expect(api.llamadasA('/crear-devolucion')[0].cuerpo).toMatchObject({ IncluyeTransporte: false, ValorTransporte: 0, UsuarioCreacion: '' });
  });

  it('exige remisión asociada en cada ítem', async () => {
    const { user } = await montar({
      'GET /equipos-pendientes-por-devolver': () => [{ ...pendientes[0], IdRemision: null }],
    });
    await conPendientes(user);
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'NO');
    fireEvent.change(cantidad('Andamio'), { target: { value: '1' } });
    await user.click(crear());
    expect(await screen.findByText('Todos los items deben tener una remisión asociada')).toBeInTheDocument();
  });

  it('si nada queda pendiente bloquea el formulario', async () => {
    const { user } = await montar({
      'GET /equipos-pendientes-por-devolver': () => [{ ...pendientes[0], CantidadPendiente: '0' }],
    });
    await conPendientes(user);
    expect(fila('Andamio').querySelector('input[type="number"]')).toBeDisabled();
    expect(screen.getByLabelText('Observaciones')).toBeDisabled();
    expect(crear()).toBeDisabled();
  });

  it('cambiar de cliente limpia proyecto y equipos', async () => {
    const { user } = await montar();
    await conPendientes(user);
    await elegirOpcion(user, 'Cliente', 'Obras del Valle');
    await waitFor(() => expect(screen.queryByText('Items a devolver')).not.toBeInTheDocument());
    expect(crear()).toBeDisabled();
  });

  it('recarga el número con devolucion-creada', async () => {
    const { api } = await montar();
    api.definir({ 'GET /siguiente-no-devolucion': [{ SiguienteNoDevolucion: 'D-0050' }] });
    act(() => emitirDesdeServidor('remision-creada', {}));
    act(() => emitirDesdeServidor('devolucion-creada', {}));
    await waitFor(() => expect(screen.getByLabelText('Devolución No:')).toHaveValue('D-0050'));
  });

  it.each([
    ['GET /siguiente-no-devolucion', 'Error al cargar número de devolución'],
    ['GET /listar-clientes', 'Error al cargar clientes'],
    ['GET /listar-estados', 'Error al cargar estados'],
    ['GET /ver-profesionales-pertenecientes', 'Error al cargar profesionales'],
    ['GET /listar-proyectos', 'Error al cargar proyectos'],
  ])('informa si falla %s', async (ruta, mensaje) => {
    simularApi({ ...rutas, [ruta]: new ErrorApi('x') });
    renderConProveedores(<FormularioCrearDevolucion />);
    expect(await screen.findByText(mensaje)).toBeInTheDocument();
  });

  it('informa si fallan los pendientes y registra el error de subarrendatarios', async () => {
    simularApi({
      ...rutas,
      'GET /equipos-pendientes-por-devolver': new ErrorApi('x'),
      'GET /ver-subarrendatarios-con-remisiones-asignadas-para-cliente-proyecto': new ErrorApi('x'),
    });
    const { user } = renderConProveedores(<FormularioCrearDevolucion />);
    await elegirOpcion(user, 'Cliente', 'Constructora Andes');
    await elegirOpcion(user, 'Proyecto', 'Torre');
    expect(await screen.findByText('Error al cargar equipos pendientes')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al consultar subarrendatarios'));
  });
});
