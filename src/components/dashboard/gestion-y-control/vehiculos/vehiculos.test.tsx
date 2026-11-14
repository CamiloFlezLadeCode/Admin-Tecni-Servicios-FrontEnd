import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FormularioCrearVehiculo } from '@/components/dashboard/gestion-y-control/vehiculos/crear/FormularioCrearVehiculo';
import { FormularioModalEditarVehiculo } from '@/components/dashboard/gestion-y-control/vehiculos/editar/FormularioEditarVehiculo';
import { TablaVisualizarVehiculos } from '@/components/dashboard/gestion-y-control/vehiculos/ver/TablaVisualizarVehiculos';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

describe('FormularioCrearVehiculo', () => {
  it('exige placa y estado', async () => {
    const api = simularApi();
    const { user } = renderConProveedores(<FormularioCrearVehiculo />);
    await user.click(screen.getByRole('button', { name: 'Crear vehículo' }));
    expect(await screen.findByText('Por favor complete todos los campos requeridos')).toBeInTheDocument();
    expect(screen.getByText('La placa es obligatoria')).toBeInTheDocument();
    expect(screen.getByText('El estado es obligatorio')).toBeInTheDocument();
    expect(api.llamadasA('/crear-vehiculo')).toHaveLength(0);
  });

  it('valida el campo al editarlo: borrar la placa vuelve a mostrar el error', async () => {
    simularApi();
    const { user } = renderConProveedores(<FormularioCrearVehiculo />);
    await user.type(screen.getByLabelText('Placa*'), 'a');
    expect(screen.queryByText('La placa es obligatoria')).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText('Placa*'));
    expect(screen.getByText('La placa es obligatoria')).toBeInTheDocument();
  });

  it('guarda la placa en mayúsculas con el usuario creador, avisa y limpia', async () => {
    const api = simularApi();
    const { user } = renderConProveedores(<FormularioCrearVehiculo />);
    await user.type(screen.getByLabelText('Placa*'), 'abc123');
    expect(screen.getByLabelText('Placa*')).toHaveValue('ABC123');
    await elegirOpcion(user, 'Estado*', 'Activo');
    await user.click(screen.getByRole('button', { name: 'Crear vehículo' }));

    expect(await screen.findByText('Vehículo creado correctamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-vehiculo')[0].cuerpo).toEqual({ Placa: 'ABC123', IdEstado: '1', UsuarioCreacion: '1001' });
    expect(sockets[0].emit).toHaveBeenCalledWith('vehiculo-creado', {});
    expect(screen.getByLabelText('Placa*')).toHaveValue('');
  });

  it('no avisa si el backend no confirma, y muestra los errores', async () => {
    const api = simularApi({ 'POST /crear-vehiculo': '' });
    const { user } = renderConProveedores(<FormularioCrearVehiculo />, { usuario: null });
    await user.type(screen.getByLabelText('Placa*'), 'x1');
    await elegirOpcion(user, 'Estado*', 'Inactivo');
    await user.click(screen.getByRole('button', { name: 'Crear vehículo' }));
    await waitFor(() => expect(api.llamadasA('/crear-vehiculo')).toHaveLength(1));
    expect(api.llamadasA('/crear-vehiculo')[0].cuerpo).toMatchObject({ UsuarioCreacion: null });
    expect(sockets[0].emit).not.toHaveBeenCalled();

    api.definir({ 'POST /crear-vehiculo': new ErrorApi('Placa duplicada') });
    await user.click(screen.getByRole('button', { name: 'Crear vehículo' }));
    // Comportamiento actual: el servicio propaga el error de axios y se pierde el mensaje del backend.
    expect(await screen.findByText('Error al crear el vehículo: Request failed with status code 400')).toBeInTheDocument();

    api.definir({ 'POST /crear-vehiculo': () => Promise.reject('texto') });
    await user.click(screen.getByRole('button', { name: 'Crear vehículo' }));
    expect(await screen.findByText('Error al crear el vehículo: texto')).toBeInTheDocument();
  });
});

describe('FormularioModalEditarVehiculo', () => {
  const rutas = {
    'GET /ver-vehiculo/*': [{ Placa: 'ABC123', IdEstado: 1 }],
    'GET /listar-estados': [
      { value: 1, label: 'Activo' },
      { value: 2, label: ' Inactivo ' },
      { value: 3, label: 'Dañado' },
    ],
  };

  async function abrir() {
    const api = simularApi(rutas);
    const sendMessage = vi.fn();
    const onMostrarMensaje = vi.fn();
    const utilidades = renderConProveedores(
      <FormularioModalEditarVehiculo IdVehiculo={4} sendMessage={sendMessage} onMostrarMensaje={onMostrarMensaje} />
    );
    await utilidades.user.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByLabelText('Placa')).toHaveValue('ABC123'));
    return { ...utilidades, api, sendMessage, onMostrarMensaje };
  }

  it('consulta el vehículo por id y solo ofrece estados Activo/Inactivo', async () => {
    const { user, api } = await abrir();
    expect(api.llamadasA('/ver-vehiculo/4')).toHaveLength(1);
    await user.click(comboPorEtiqueta('Estado'));
    const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(['Activo', ' Inactivo ']);
  });

  it('guarda la placa en mayúsculas y avisa por WebSocket', async () => {
    const { user, api, sendMessage, onMostrarMensaje } = await abrir();
    await user.clear(screen.getByLabelText('Placa'));
    await user.type(screen.getByLabelText('Placa'), 'xyz9');
    await elegirOpcion(user, 'Estado', 'Inactivo');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('Vehículo actualizado correctamente', 'success'));
    expect(api.llamadasA('/actualizar-vehiculo')[0].cuerpo).toEqual({ IdVehiculo: 4, Placa: 'XYZ9', IdEstado: 2 });
    expect(sendMessage).toHaveBeenCalledWith('vehiculo-actualizado', {});
  });

  it('informa el error al actualizar', async () => {
    const { user, api, onMostrarMensaje, sendMessage } = await abrir();
    api.definir({ 'PUT /actualizar-vehiculo': new ErrorApi('No se pudo') });
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al actualizar el vehículo.'), 'error'));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('se cierra con la X y no con Escape', async () => {
    const { user } = await abrir();
    await user.keyboard('{Escape}');
    expect(screen.getByLabelText('Placa')).toBeInTheDocument();
    const cerrar = screen.getAllByRole('button').find((b) => !b.textContent && b.closest('[role="presentation"]'))!;
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByLabelText('Placa')).not.toBeInTheDocument());
  });

  it('si la consulta falla abre el modal vacío y lo registra', async () => {
    simularApi({ 'GET /ver-vehiculo/*': new ErrorApi('no existe') });
    const { user } = renderConProveedores(
      <FormularioModalEditarVehiculo IdVehiculo={4} sendMessage={vi.fn()} onMostrarMensaje={vi.fn()} />
    );
    await user.click(screen.getByRole('button'));
    expect(await screen.findByLabelText('Placa')).toHaveValue('');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Error al consultar el vehículo'));
  });
});

describe('TablaVisualizarVehiculos', () => {
  const vehiculos = [
    { IdVehiculo: 1, Placa: 'ABC123', UsuarioCreacion: 'Ana', FechaCreacion: '01/01/2026', Estado: 'Activo' },
    { IdVehiculo: 2, Placa: 'XYZ999', UsuarioCreacion: 'Ana', FechaCreacion: '01/01/2026', Estado: 'Inactivo' },
    { IdVehiculo: 3, Placa: 'QQQ000', UsuarioCreacion: 'Ana', FechaCreacion: '01/01/2026', Estado: 'Otro' },
  ];

  it('lista vehículos con colores por estado', async () => {
    simularApi({ 'GET /ver-vehiculos': paginar(vehiculos) });
    renderConProveedores(<TablaVisualizarVehiculos />);
    expect(await screen.findByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Inactivo').closest('.MuiChip-root')).toHaveClass('MuiChip-colorError');
    expect(screen.getByText('Otro').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault');
  });

  it('elimina un vehículo tras confirmar y recarga con el evento', async () => {
    const api = simularApi({ 'GET /ver-vehiculos': paginar(vehiculos) });
    const { user } = renderConProveedores(<TablaVisualizarVehiculos />);
    await user.click(await screen.findByRole('button', { name: 'eliminar-vehiculo-XYZ999' }));
    expect(await screen.findByText('¿Realmente quieres eliminar el vehículo con placa XYZ999?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sí' }));
    expect(await screen.findByText('Vehículo eliminado correctamente')).toBeInTheDocument();
    expect(api.llamadasA('/eliminar-vehiculo/2', 'delete')).toHaveLength(1);
    expect(sockets.some((s) => s.emit.mock.calls.some(([e]) => e === 'vehiculo-eliminado'))).toBe(true);

    for (const evento of ['vehiculo-creado', 'vehiculo-actualizado', 'vehiculo-eliminado']) {
      const antes = api.llamadasA('/ver-vehiculos').length;
      act(() => emitirDesdeServidor(evento, {}));
      await waitFor(() => expect(api.llamadasA('/ver-vehiculos').length).toBeGreaterThan(antes));
    }
  });

  it('muestra el error de la consulta', async () => {
    simularApi({ 'GET /ver-vehiculos': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarVehiculos />);
    expect(await screen.findByText('Error al cargar los equipos: Error: caído')).toBeInTheDocument();
  });

  it('el mensaje de edición se muestra en la tabla', async () => {
    simularApi({ 'GET /ver-vehiculos': paginar(vehiculos), 'GET /ver-vehiculo/*': [{ Placa: 'ABC123', IdEstado: 1 }] });
    const { user } = renderConProveedores(<TablaVisualizarVehiculos />);
    await screen.findByText('ABC123');
    const fila = screen.getByText('ABC123').closest('tr')!;
    await user.click(within(fila).getAllByRole('button')[0]);
    await user.click(await screen.findByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Vehículo actualizado correctamente')).toBeInTheDocument();
  });
});
