import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FormularioCrearRepuesto } from '@/components/dashboard/gestion-y-control/repuestos/crear/FormularioCrearRepuesto';
import { FormularioEditarRepuesto } from '@/components/dashboard/gestion-y-control/repuestos/editar/FormularioEditarRepuesto';
import { TablaVisualizarProyectos as TablaVisualizarRepuestos } from '@/components/dashboard/gestion-y-control/repuestos/ver/TablaVisualizarRepuestos';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

const catalogos = {
  'GET /listar-bodegas-subarrendatario': () => [{ value: 5, label: 'Bodega repuestos' }],
  'GET /listar-unidades-de-medida': [{ value: 2, label: 'Unidad' }],
};

describe('FormularioCrearRepuesto', () => {
  it('busca solo bodegas de repuestos', async () => {
    const api = simularApi(catalogos);
    renderConProveedores(<FormularioCrearRepuesto />);
    await waitFor(() => expect(api.llamadasA('/listar-bodegas-subarrendatario')).toHaveLength(1));
    expect(api.llamadasA('/listar-bodegas-subarrendatario')[0].params).toEqual({ IdTipoBodega: 2 });
  });

  it('exige todos los campos', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearRepuesto />);
    await user.click(screen.getByRole('button', { name: 'Crear repuesto' }));
    expect(await screen.findByText('Por favor complete todos los campos requeridos correctamente')).toBeInTheDocument();
    for (const mensaje of [
      'El nombre del repuesto es obligatorio.',
      'El estado es obligatorio.',
      'La bodega es obligatoria',
      'La unidad de medida es obligatoria.',
    ]) {
      expect(screen.getByText(mensaje)).toBeInTheDocument();
    }
    expect(api.llamadasA('/crear-repuesto')).toHaveLength(0);
  });

  it('valida al vuelo: volver a "Sin seleccionar" muestra el error', async () => {
    simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearRepuesto />);
    await elegirOpcion(user, 'Estado*', 'Disponible');
    expect(screen.queryByText('El estado es obligatorio.')).not.toBeInTheDocument();
    await elegirOpcion(user, 'Estado*', 'Sin seleccionar');
    expect(screen.getByText('El estado es obligatorio.')).toBeInTheDocument();
    await elegirOpcion(user, 'Bodega*', 'Sin seleccionar');
    expect(screen.getByText('La bodega es obligatoria')).toBeInTheDocument();
  });

  it('crea el repuesto con bodega y unidad numéricas y limpia', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearRepuesto />);
    await waitFor(() => expect(api.llamadasA('/listar-unidades-de-medida')).toHaveLength(1));
    await elegirOpcion(user, 'Bodega*', 'Bodega repuestos');
    await user.type(screen.getByLabelText('Nombre*'), 'Filtro de aceite');
    await elegirOpcion(user, 'Unidad de medida*', 'Unidad');
    await elegirOpcion(user, 'Estado*', 'No disponible');
    await user.click(screen.getByRole('button', { name: 'Crear repuesto' }));

    expect(await screen.findByText('Repuesto creado exitosamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-repuesto')[0].cuerpo).toEqual({
      NombreRepuesto: 'Filtro de aceite',
      UsuarioCreacion: '1001',
      Estado: '4',
      Bodega: 5,
      IdUnidadMedida: 2,
    });
    expect(sockets[0].emit).toHaveBeenCalledWith('repuesto-creado', {});
    expect(screen.getByLabelText('Nombre*')).toHaveValue('');
  });

  it('muestra el error del backend', async () => {
    simularApi({ ...catalogos, 'POST /crear-repuesto': new ErrorApi('Repuesto duplicado') });
    const { user } = renderConProveedores(<FormularioCrearRepuesto />, { usuario: null });
    await waitFor(() => comboPorEtiqueta('Bodega*'));
    await elegirOpcion(user, 'Bodega*', 'Bodega repuestos');
    await user.type(screen.getByLabelText('Nombre*'), 'X');
    await elegirOpcion(user, 'Unidad de medida*', 'Unidad');
    await elegirOpcion(user, 'Estado*', 'Disponible');
    await user.click(screen.getByRole('button', { name: 'Crear repuesto' }));
    expect(await screen.findByText(/^Error al crear repuesto: /)).toBeInTheDocument();
  });

  it('registra el error si fallan los catálogos', async () => {
    simularApi({ 'GET /listar-bodegas-subarrendatario': new ErrorApi('caído') });
    renderConProveedores(<FormularioCrearRepuesto />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar datos iniciales')));
  });
});

describe('FormularioEditarRepuesto', () => {
  const rutas = {
    'GET /listar-estados': [
      { value: 3, label: 'Disponible' },
      { value: 4, label: 'No disponible' },
      { value: 1, label: 'Activo' },
    ],
    'GET /ver-repuesto/*': [{ Nombre: 'Filtro', Estado: 3 }],
  };

  async function abrir(extra = {}) {
    const api = simularApi({ ...rutas, ...extra });
    const sendMessage = vi.fn();
    const onMostrarMensaje = vi.fn();
    const utilidades = renderConProveedores(
      <FormularioEditarRepuesto IdRepuesto={8} sendMessage={sendMessage} onMostrarMensaje={onMostrarMensaje} />
    );
    await utilidades.user.click(screen.getByRole('button'));
    return { ...utilidades, api, sendMessage, onMostrarMensaje };
  }

  it('precarga nombre y estado y solo ofrece Disponible/No disponible', async () => {
    const { user, api } = await abrir();
    await waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue('Filtro'));
    expect(api.llamadasA('/ver-repuesto/8')).toHaveLength(1);
    await user.click(comboPorEtiqueta('Estado'));
    const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(['Disponible', 'No disponible']);
  });

  it('guarda los cambios y avisa', async () => {
    const { user, api, sendMessage, onMostrarMensaje } = await abrir();
    await waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue('Filtro'));
    await user.type(screen.getByLabelText('Nombre'), ' grande');
    await elegirOpcion(user, 'Estado', 'No disponible');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('Repuesto actualizado correctamente.', 'success'));
    expect(api.llamadasA('/actualizar-repuesto')[0].cuerpo).toEqual({
      NuevoNombreRepuesto: 'Filtro grande',
      NuevoEstadoRepuesto: 4,
      IdRepuesto: 8,
    });
    expect(sendMessage).toHaveBeenCalledWith('repuesto-actualizado', {});
  });

  it('informa el error al guardar y registra el de carga', async () => {
    const { user, onMostrarMensaje } = await abrir({
      'PUT /actualizar-repuesto': new ErrorApi('falló'),
      'GET /ver-repuesto/*': new ErrorApi('no existe'),
    });
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar los estados')));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al actualizar el repuesto'), 'error'));
  });

  it('se cierra con la X pero no con Escape', async () => {
    const { user } = await abrir();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Actualizar repuesto')).toBeInTheDocument();
    const cerrar = screen.getAllByRole('button').find((b) => !b.textContent && b.closest('[role="presentation"]'))!;
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByText('Actualizar repuesto')).not.toBeInTheDocument());
  });
});

describe('TablaVisualizarRepuestos', () => {
  const repuestos = [
    { IdRepuesto: 1, NombreRepuesto: 'Filtro', CantidadRepuesto: 3, UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoRepuesto: ' disponible ' },
    { IdRepuesto: 2, NombreRepuesto: 'Correa', CantidadRepuesto: 0, UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoRepuesto: 'No disponible' },
    { IdRepuesto: 3, NombreRepuesto: 'Motor', CantidadRepuesto: 1, UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoRepuesto: 'Reparación' },
    { IdRepuesto: 4, NombreRepuesto: 'Raro', CantidadRepuesto: 1, UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoRepuesto: 'Otro' },
    { IdRepuesto: 5, NombreRepuesto: 'Nulo', CantidadRepuesto: 1, UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoRepuesto: null },
  ];

  it('normaliza el estado y lo muestra con su color', async () => {
    simularApi({ 'GET /ver-repuestos': paginar(repuestos) });
    renderConProveedores(<TablaVisualizarRepuestos />);
    expect(await screen.findByText('Filtro')).toBeInTheDocument();
    expect(screen.getByText('Disponible').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
    expect(screen.getByText('No disponible').closest('.MuiChip-root')).toHaveClass('MuiChip-colorError');
    expect(screen.getByText('En reparación').closest('.MuiChip-root')).toHaveClass('MuiChip-colorWarning');
    expect(screen.getByText('Otro').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault');
  });

  it.each([
    'repuesto-creado',
    'repuesto-actualizado',
    'entrada-repuestos-creada',
    'salida-repuestos-creada',
    'orden-de-servicio-creada',
  ])('recarga con el evento %s', async (evento) => {
    const api = simularApi({ 'GET /ver-repuestos': paginar(repuestos) });
    renderConProveedores(<TablaVisualizarRepuestos />);
    await screen.findByText('Filtro');
    act(() => emitirDesdeServidor(evento, {}));
    await waitFor(() => expect(api.llamadasA('/ver-repuestos')).toHaveLength(2));
  });

  it('no recarga con eventos ajenos y muestra errores', async () => {
    const api = simularApi({ 'GET /ver-repuestos': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarRepuestos />);
    expect(await screen.findByText('Error al cargar los repuestos: Error: caído')).toBeInTheDocument();
    act(() => emitirDesdeServidor('bodega-creada', {}));
    expect(api.llamadasA('/ver-repuestos')).toHaveLength(1);
  });

  it('el mensaje de edición aparece en la tabla', async () => {
    simularApi({ 'GET /ver-repuestos': paginar(repuestos.slice(0, 1)), 'GET /ver-repuesto/*': [{ Nombre: 'Filtro', Estado: 3 }] });
    const { user } = renderConProveedores(<TablaVisualizarRepuestos />);
    const fila = (await screen.findByText('Filtro')).closest('tr')!;
    await user.click(within(fila).getByRole('button'));
    await user.click(await screen.findByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Repuesto actualizado correctamente.')).toBeInTheDocument();
  });
});
