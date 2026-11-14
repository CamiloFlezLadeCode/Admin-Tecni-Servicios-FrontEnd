import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { FormularioCrearRemision } from '@/components/dashboard/comercial/remisiones/crear/FormularioCrearRemision';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { rutasBase } from '@test/mocks/fixtures';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

const EMPRESA = '901893972-3';

const rutas = {
  ...rutasBase,
  'GET /listar-clientes': () => [{ value: '900', label: 'Constructora Andes' }],
  'GET /listar-subarrendatarios': () => [
    { value: '800', label: 'Sub S.A.S' },
    { value: EMPRESA, label: 'TECNISERVICIOS' },
  ],
  'GET /listar-bodegueros': () => [{ value: 'b1', label: 'Bodeguero Uno' }],
  'GET /listar-despachadores': () => [{ value: 'd1', label: 'Despachador Uno' }],
  'GET /listar-transportadores': () => [{ value: 't1', label: 'Conductor Uno' }],
  'GET /listar-vehiculos': () => [{ value: 'v1', label: 'XYZ999' }],
  'GET /listar-proyectos': () => [{ value: 3, label: 'Torre' }],
  'GET /listar-categorias': () => [{ value: 4, label: 'Andamios' }],
  'GET /ver-disponibilidad-equipos': () => [
    { value: 7, label: 'Andamio', estado: 'Disponible', CantidadDisponible: 5 },
    { value: 9, label: 'Agotado', estado: 'Disponible', CantidadDisponible: 0 },
  ],
  'GET /ver-disponibilidad-equipos-generales': () => [{ value: 11, label: 'Equipo ajeno', estado: 'Disponible' }],
  'GET /ver-cantidad-disponible-equipo/*': ({ ruta }: { ruta: string }) => [
    {
      CantidadDisponible: ruta.endsWith('/9') ? 0 : 5,
      PrecioAlquiler: 100,
      PrecioVenta: 1,
      PrecioReparacion: 2,
      UnidadDeMedida: 'Unidad',
    },
  ],
};

const campo = (etiqueta: RegExp) => screen.getByLabelText(etiqueta);
const CANTIDAD = /^Cantidad\s*\*/;

async function montar(extra = {}, opciones = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const utilidades = renderConProveedores(<FormularioCrearRemision />, opciones);
  await waitFor(() => expect(campo(/^Remisión No:/)).toHaveValue('R-0042'));
  return { ...utilidades, api };
}

async function elegirEquipoPropio(user: Usuario, equipo = 'Andamio') {
  await elegirOpcion(user, /^Subarrendatario/, 'TECNISERVICIOS J.F S.A.S');
  await waitFor(() => expect(screen.getByRole('combobox', { name: /Categoría/ })).toBeInTheDocument());
  await elegirOpcion(user, /^Categoría/, 'Andamios');
  await elegirOpcion(user, /^Equipo disponible/, equipo);
}

async function llenarEncabezado(user: Usuario) {
  await elegirOpcion(user, /^Empresa\/Cliente/, 'Constructora Andes');
  await elegirOpcion(user, /^Proyecto/, 'Torre');
  await elegirOpcion(user, /^Bodeguero/, 'Bodeguero Uno');
  await elegirOpcion(user, /^Despachador/, 'Despachador Uno');
}

describe('FormularioCrearRemision', () => {
  it('carga catálogos y el siguiente número; sin ítems no deja crear', async () => {
    const { api } = await montar();
    expect(api.llamadasA('/listar-proyectos')[0].params).toEqual({ Cliente: 'SinSeleccionar' });
    expect(screen.getByRole('button', { name: 'Crear remisión' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Agregar item' })).toBeDisabled();
    expect(screen.getByText('Total items: 0')).toBeInTheDocument();
  });

  it('equipo propio: trae precio y disponibilidad, calcula el total y no deja repetir', async () => {
    const { user, api } = await montar();
    await elegirEquipoPropio(user);
    expect(api.llamadasA('/ver-disponibilidad-equipos')[0].params).toEqual({ IdCategoria: 4, DocumentoSubarrendatario: EMPRESA });
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    expect(campo(CANTIDAD)).toHaveValue(1);
    expect(campo(/^Cantidad disponible/)).toHaveValue(5);
    fireEvent.change(campo(CANTIDAD), { target: { value: '3' } });
    await waitFor(() => expect(campo(/^Precio total/)).toHaveValue(357));

    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    expect(await screen.findByText('Item agregado correctamente')).toBeInTheDocument();
    expect(screen.getByText('Total items: 1')).toBeInTheDocument();
    expect(campo(CANTIDAD)).toHaveValue(0);

    await elegirOpcion(user, /^Equipo disponible/, 'Andamio');
    await waitFor(() => expect(campo(CANTIDAD)).toHaveValue(1));
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    expect(await screen.findByText('Este equipo ya fue agregado a la remisión')).toBeInTheDocument();
  });

  it('valida cantidades, disponibilidad, precio e IVA antes de agregar', async () => {
    const { user } = await montar();
    await elegirEquipoPropio(user);
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    const agregar = () => user.click(screen.getByRole('button', { name: 'Agregar item' }));

    fireEvent.change(campo(CANTIDAD), { target: { value: '8' } });
    await agregar();
    expect(await screen.findByText('La cantidad ingresada excede la disponible')).toBeInTheDocument();

    fireEvent.change(campo(CANTIDAD), { target: { value: '-1' } });
    await agregar();
    expect(await screen.findByText('La cantidad debe ser mayor a cero')).toBeInTheDocument();

    fireEvent.change(campo(CANTIDAD), { target: { value: '1' } });
    fireEvent.change(campo(/^Precio unidad/), { target: { value: '-5' } });
    await agregar();
    expect(await screen.findByText('El precio unidad no puede ser menor a cero')).toBeInTheDocument();

    fireEvent.change(campo(/^Precio unidad/), { target: { value: '5' } });
    fireEvent.change(campo(/^IVA %/), { target: { value: '-1' } });
    await agregar();
    expect(await screen.findByText('El IVA% no puede ser menor a cero')).toBeInTheDocument();
  });

  it('avisa cuando el equipo propio no tiene disponibilidad', async () => {
    const { user } = await montar();
    await elegirEquipoPropio(user, 'Agotado');
    expect(await screen.findByText('Equipo No Disponible', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText('La cantidad no puede ser mayor a la disponible')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(screen.queryByText('Equipo No Disponible')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    expect(await screen.findByText('La cantidad ingresada excede la disponible')).toBeInTheDocument();
  });

  it('crea la remisión con ítems propios y de subarrendatario, transporte y placa normalizada', async () => {
    const { user, api } = await montar();
    await llenarEncabezado(user);
    await elegirEquipoPropio(user);
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    fireEvent.change(campo(CANTIDAD), { target: { value: '2' } });
    await user.type(campo(/^Observaciones Cliente/), 'frágil');
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    await screen.findByText('Total items: 1');

    await elegirOpcion(user, /^Subarrendatario/, 'Sub S.A.S');
    expect(screen.queryByLabelText(/^Cantidad disponible/)).not.toBeInTheDocument();
    await elegirOpcion(user, /^Categoría/, 'Andamios');
    await waitFor(() => expect(api.llamadasA('/ver-disponibilidad-equipos-generales')).toHaveLength(1));
    expect(api.llamadasA('/ver-disponibilidad-equipos-generales')[0].params).toMatchObject({ IdCategoria: 4, IdTipoBodega: 3 });
    await elegirOpcion(user, /^Equipo disponible/, 'Equipo ajeno');
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    expect(campo(CANTIDAD)).toHaveValue(1);
    fireEvent.change(campo(/^IVA %/), { target: { value: '0' } });
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    await screen.findByText('Total items: 2');

    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'SÍ');
    fireEvent.change(campo(/^Valor Transporte/), { target: { value: '50000' } });
    await elegirOpcion(user, /^Conductor/, 'Conductor Uno');
    await elegirOpcion(user, /^Vehículo/, 'XYZ999');
    await user.type(campo(/^Recibe/), 'Ana');
    await user.type(campo(/^Placa/), 'abc-12x9');
    expect(campo(/^Placa/)).toHaveValue('ABC12X');
    await user.type(campo(/^Observaciones Empresa/), 'urgente');

    await user.click(screen.getByRole('button', { name: 'Crear remisión' }));
    expect(await screen.findByText('Remisión creada correctamente')).toBeInTheDocument();
    const cuerpo = api.llamadasA('/crear-remision')[0].cuerpo as any;
    expect(cuerpo).toMatchObject({
      NoRemision: 'R-0042',
      DocumentoCliente: '900',
      IdProyecto: 3,
      IdBodega: null,
      DocumentoBodeguero: 'b1',
      DocumentoDespachador: 'd1',
      DocumentoTransportador: 't1',
      IdVehiculo: 'v1',
      PlacaVehiculoRecibe: 'ABC12X',
      NombrePersonaRecibe: 'Ana',
      ObservacionesEmpresa: 'urgente',
      UsuarioCreacion: '1001',
      IdEstado: 8,
      PrecioTotalGeneralSinIVA: 300,
      PrecioTotalGeneralConIVA: 338,
      IncluyeTransporte: true,
      ValorTransporte: 50000,
    });
    expect(cuerpo.FechaRemision).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(cuerpo.Detalles).toEqual([
      { DocumentoSubarrendatario: EMPRESA, IdCategoria: 4, IdEquipo: 7, Cantidad: 2, PrecioUnidad: 100, PrecioTotal: 238, ObservacionesCliente: 'frágil' },
      { DocumentoSubarrendatario: '800', IdCategoria: 4, IdEquipo: 11, Cantidad: 1, PrecioUnidad: 100, PrecioTotal: 100, ObservacionesCliente: '' },
    ]);
    expect(sockets[0].emit).toHaveBeenCalledWith('remision-creada', {});
    await waitFor(() => expect(api.llamadasA('/siguiente-no-remision')).toHaveLength(2));
    expect(screen.getByText('Total items: 0')).toBeInTheDocument();
  });

  it('sin conductor ni vehículo, y transporte NO, envía nulos/ceros', async () => {
    const { user, api } = await montar({}, { usuario: null });
    await llenarEncabezado(user);
    await elegirEquipoPropio(user);
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'SÍ');
    fireEvent.change(campo(/^Valor Transporte/), { target: { value: '9' } });
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'NO');
    expect(screen.queryByLabelText(/^Valor Transporte/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Crear remisión' }));
    await waitFor(() => expect(api.llamadasA('/crear-remision')).toHaveLength(1));
    expect(api.llamadasA('/crear-remision')[0].cuerpo).toMatchObject({
      DocumentoTransportador: null,
      IdVehiculo: '',
      IncluyeTransporte: false,
      ValorTransporte: 0,
      UsuarioCreacion: null,
    });
  });

  it('valida el encabezado antes de crear', async () => {
    const { user, api } = await montar();
    await elegirEquipoPropio(user);
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'SÍ');
    await user.click(screen.getByRole('button', { name: 'Crear remisión' }));
    for (const mensaje of [
      'El cliente es obligatorio',
      'El proyecto es obligatorio',
      'El bodeguero es obligatorio',
      'El despachador es obligatorio',
      'El valor del transporte debe ser mayor a 0',
    ]) {
      expect(await screen.findByText(mensaje)).toBeInTheDocument();
    }
    expect(api.llamadasA('/crear-remision')).toHaveLength(0);
  });

  it('muestra los ítems en el modal y permite quitarlos', async () => {
    const { user } = await montar();
    await elegirEquipoPropio(user);
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    await user.click(screen.getByRole('button', { name: 'Ver' }));
    expect(await screen.findByText('Items remisión')).toBeInTheDocument();
    const fila = screen.getAllByText('Andamio').map((n) => n.closest('tr')).find(Boolean)!;
    expect(within(fila).getByText('TECNISERVICIOS J.F S.A.S')).toBeInTheDocument();
    await user.click(within(fila).getAllByRole('button').at(-1)!);
    expect(await screen.findByText('Item eliminado')).toBeInTheDocument();
    expect(screen.getByText('Total items: 0')).toBeInTheDocument();
  });

  it('informa errores de carga, de creación y recarga el número con remision-creada', async () => {
    const { user, api } = await montar({
      'GET /listar-proyectos': new ErrorApi('x'),
      'POST /crear-remision': new ErrorApi('Número duplicado'),
    });
    expect(await screen.findByText('Error al cargar proyectos del cliente')).toBeInTheDocument();
    api.definir({ 'GET /listar-proyectos': () => [{ value: 3, label: 'Torre' }] });
    await llenarEncabezado(user);
    await elegirEquipoPropio(user);
    await waitFor(() => expect(campo(/^Precio unidad/)).toHaveValue(100));
    await user.click(screen.getByRole('button', { name: 'Agregar item' }));
    await elegirOpcion(user, /^¿Incluye Transporte\?/, 'NO');
    await user.click(screen.getByRole('button', { name: 'Crear remisión' }));
    expect(await screen.findByText('Error al crear la remisión')).toBeInTheDocument();

    api.definir({ 'GET /siguiente-no-remision': [{ SiguienteNoRemision: 'R-0050' }] });
    act(() => emitirDesdeServidor('remision-creada', {}));
    await waitFor(() => expect(campo(/^Remisión No:/)).toHaveValue('R-0050'));
    api.definir({ 'GET /siguiente-no-remision': new ErrorApi('x') });
    act(() => emitirDesdeServidor('remision-creada', {}));
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error al consultar siguiente número de remisión:', expect.anything()));
  });

  it.each([
    [{ 'GET /listar-clientes': new ErrorApi('x') }, 'Error al cargar datos iniciales'],
    [{ 'GET /ver-disponibilidad-equipos': new ErrorApi('x') }, 'Error al cargar equipos por categoría'],
    [{ 'GET /ver-cantidad-disponible-equipo/*': new ErrorApi('x') }, 'Error al consultar disponibilidad del equipo'],
  ])('informa fallas de catálogos %#', async (extra, mensaje) => {
    const api = simularApi({ ...rutas, ...extra });
    const { user } = renderConProveedores(<FormularioCrearRemision />);
    if (mensaje !== 'Error al cargar datos iniciales') {
      await waitFor(() => expect(api.llamadasA('/siguiente-no-remision')).toHaveLength(1));
      await elegirOpcion(user, /^Subarrendatario/, 'TECNISERVICIOS J.F S.A.S');
      await elegirOpcion(user, /^Categoría/, 'Andamios');
      if (mensaje.includes('disponibilidad')) await elegirOpcion(user, /^Equipo disponible/, 'Andamio');
    }
    expect(await screen.findByText(mensaje)).toBeInTheDocument();
  });

  it('volver a "Sin seleccionar" en subarrendatario vacía las categorías y registra fallas al listarlas', async () => {
    const { user, api } = await montar({ 'GET /listar-categorias': new ErrorApi('x') });
    await elegirOpcion(user, /^Subarrendatario/, 'Sub S.A.S');
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error al listar categorias independientes:', expect.anything()));
    await elegirOpcion(user, /^Subarrendatario/, 'Sin seleccionar');
    expect(api.llamadasA('/listar-categorias')).toHaveLength(1);
  });
});
