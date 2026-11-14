import * as React from 'react';
import { describe, expect, it } from 'vitest';

import FormularioCrearBodega from '@/components/dashboard/gestion-y-control/bodegas/crear/FormularioCrearBodega';
import { FormularioEditarBodega } from '@/components/dashboard/gestion-y-control/bodegas/editar/FormularioEditarBodega';
import { TablaVisualizarBodegas } from '@/components/dashboard/gestion-y-control/bodegas/ver/TablaVisualizarBodegas';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

const tiposDeBodega = [
  { value: '1', label: 'Reparación' },
  { value: '3', label: 'Alquiler' },
];
const estados = [
  { value: 1, label: 'Activo' },
  { value: 2, label: 'Inactivo' },
  { value: 3, label: 'Dañado' },
];
const rutasCatalogos = {
  'GET /listar-tipo-de-bodegas': () => tiposDeBodega.map((t) => ({ ...t })),
  'GET /listar-estados': () => estados.map((e) => ({ ...e })),
  'GET /listar-subarrendatarios': [{ value: '800', label: 'Sub S.A.S' }],
};

describe('FormularioCrearBodega', () => {
  it('carga tipos de bodega y solo los estados Activo/Inactivo', async () => {
    simularApi(rutasCatalogos);
    const { user } = renderConProveedores(<FormularioCrearBodega />);
    await waitFor(() => expect(comboPorEtiqueta('Estado')).toBeInTheDocument());
    await user.click(comboPorEtiqueta('Estado'));
    await screen.findByText('Inactivo');
    const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(['Sin seleccionar', 'Activo', 'Inactivo']);
  });

  it('valida los campos obligatorios antes de enviar', async () => {
    const api = simularApi(rutasCatalogos);
    const { user } = renderConProveedores(<FormularioCrearBodega />);
    await waitFor(() => comboPorEtiqueta('Tipo de bodega'));
    await user.click(screen.getByRole('button', { name: 'Crear bodega' }));
    expect(await screen.findByText('Debe seleccionar un tipo de bodega válido')).toBeInTheDocument();
    expect(screen.getByText('El nombre de la bodega es obligatorio')).toBeInTheDocument();
    expect(api.llamadasA('/crear-bodega')).toHaveLength(0);
  });

  it('crea la bodega con el usuario de la sesión y avisa por WebSocket', async () => {
    const api = simularApi(rutasCatalogos);
    const { user } = renderConProveedores(<FormularioCrearBodega />);
    await waitFor(() => expect(api.llamadasA('/listar-tipo-de-bodegas')).toHaveLength(1));
    await elegirOpcion(user, 'Tipo de bodega', 'Alquiler');
    await user.type(screen.getByLabelText('Nombre de bodega'), 'Bodega Norte');
    await user.type(screen.getByLabelText('Descripción'), 'Principal');
    await user.click(screen.getByRole('button', { name: 'Crear bodega' }));

    expect(await screen.findByText('Bodega creada correctamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-bodega')[0].cuerpo).toEqual({
      TipoDeBodega: '3',
      NombreDeBodega: 'Bodega Norte',
      Descripcion: 'Principal',
      Estado: 1,
      UsuarioCreacion: '1001',
    });
    expect(sockets[0].emit).toHaveBeenCalledWith('bodega-creada', {});
    expect(screen.getByLabelText('Nombre de bodega')).toHaveValue('');
  });

  it('muestra el error del backend al crear', async () => {
    simularApi({ ...rutasCatalogos, 'POST /crear-bodega': new ErrorApi('Ya existe una bodega con ese nombre') });
    const { user } = renderConProveedores(<FormularioCrearBodega />, { usuario: null });
    await elegirOpcion(user, 'Tipo de bodega', 'Reparación');
    await user.type(screen.getByLabelText('Nombre de bodega'), 'Repetida');
    await user.click(screen.getByRole('button', { name: 'Crear bodega' }));
    expect(await screen.findByText(/Hubo un error al crear la bodega: Error: Ya existe una bodega con ese nombre/)).toBeInTheDocument();
  });

  it('si fallan los catálogos lo registra sin romper la pantalla', async () => {
    simularApi({ 'GET /listar-tipo-de-bodegas': new ErrorApi('caído') });
    renderConProveedores(<FormularioCrearBodega />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar los datos')));
    expect(screen.getByRole('button', { name: 'Crear bodega' })).toBeInTheDocument();
  });
});

describe('FormularioEditarBodega', () => {
  const infoBodega = [{ IdTipoBodega: 3, NombreBodega: 'Bodega Norte', Descripcion: 'Principal', IdEstado: 2 }];

  async function abrir(rutas = {}) {
    const api = simularApi({ ...rutasCatalogos, 'GET /ver-bodega': infoBodega, ...rutas });
    const mensajes: [string, string][] = [];
    const utilidades = renderConProveedores(
      <FormularioEditarBodega IdBodega={7} onMostrarMensaje={(m, t) => mensajes.push([m, t])} />
    );
    await utilidades.user.click(screen.getByTitle('Editar'));
    await waitFor(() => expect(screen.getByLabelText('Nombre de bodega')).toHaveValue('Bodega Norte'));
    return { ...utilidades, api, mensajes };
  }

  it('al abrir consulta la bodega por id y precarga el formulario', async () => {
    const { api } = await abrir();
    expect(api.llamadasA('/ver-bodega')[0].params).toEqual({ IdBodega: 7 });
    expect(comboPorEtiqueta('Tipo de bodega')).toHaveTextContent('Alquiler');
    expect(comboPorEtiqueta('Estado')).toHaveTextContent('Inactivo');
    expect(screen.getByLabelText('Descripción')).toHaveValue('Principal');
  });

  it('actualiza con el IdBodega, avisa y emite bodega-actualizada', async () => {
    const { user, api, mensajes } = await abrir();
    await user.clear(screen.getByLabelText('Nombre de bodega'));
    await user.type(screen.getByLabelText('Nombre de bodega'), 'Bodega Sur');
    await elegirOpcion(user, 'Estado', 'Activo');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(api.llamadasA('/actualizar-bodega')).toHaveLength(1));
    expect(api.llamadasA('/actualizar-bodega')[0].cuerpo).toEqual({
      TipoDeBodega: '3',
      NombreDeBodega: 'Bodega Sur',
      Descripcion: 'Principal',
      Estado: '1',
      IdBodega: 7,
    });
    expect(mensajes).toContainEqual(['Bodega actualizada correctamente', 'success']);
    expect(sockets[0].emit).toHaveBeenCalledWith('bodega-actualizada', {});
  });

  it('usa el estado 1 si la bodega no trae estado y valida el nombre', async () => {
    const { user } = await abrir({ 'GET /ver-bodega': [{ ...infoBodega[0], IdEstado: null }] });
    expect(comboPorEtiqueta('Estado')).toHaveTextContent('Activo');
    await user.clear(screen.getByLabelText('Nombre de bodega'));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('El nombre de la bodega es obligatorio')).toBeInTheDocument();
  });

  it('el modal se cierra con la X pero no con Escape', async () => {
    const { user } = await abrir();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Actualizar Bodega')).toBeInTheDocument();
    const [cerrar] = screen.getAllByRole('button').filter((b) => b.querySelector('svg') && !b.textContent);
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByText('Actualizar Bodega')).not.toBeInTheDocument());
  });

  it('registra el error si no puede cargar la bodega', async () => {
    simularApi({ ...rutasCatalogos, 'GET /ver-bodega': new ErrorApi('no existe') });
    const { user } = renderConProveedores(<FormularioEditarBodega IdBodega={7} onMostrarMensaje={() => undefined} />);
    await user.click(screen.getByTitle('Editar'));
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar los datos')));
  });
});

describe('TablaVisualizarBodegas', () => {
  const bodegas = [
    { IdBodega: 1, NombreBodega: 'Norte', DescripcionBodega: 'Principal', UsuarioCreacion: 'Ana', FechaCreacion: '01/01/2026', EstadoBodega: 'Activo' },
    { IdBodega: 2, NombreBodega: 'Sur', DescripcionBodega: '', UsuarioCreacion: 'Ana', FechaCreacion: '02/01/2026', EstadoBodega: 'Inactivo' },
    { IdBodega: 3, NombreBodega: 'Otra', DescripcionBodega: '', UsuarioCreacion: 'Ana', FechaCreacion: '02/01/2026', EstadoBodega: 'Raro' },
  ];

  it('lista las bodegas paginadas en el servidor con su estado', async () => {
    const api = simularApi({ 'GET /ver-bodegas': paginar(bodegas) });
    renderConProveedores(<TablaVisualizarBodegas />);
    expect(await screen.findByText('Norte')).toBeInTheDocument();
    expect(api.llamadasA('/ver-bodegas')[0].params).toEqual({ pagina: 1, limite: 10 });
    expect(screen.getAllByTitle('Editar')).toHaveLength(3);
    expect(screen.getByText('Inactivo').closest('.MuiChip-root')).toHaveClass('MuiChip-colorError');
    expect(screen.getByText('Activo').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
    expect(screen.getByText('Raro').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault');
  });

  it('recarga al recibir bodega-creada o bodega-actualizada, no con otros eventos', async () => {
    const api = simularApi({ 'GET /ver-bodegas': paginar(bodegas) });
    renderConProveedores(<TablaVisualizarBodegas />);
    await screen.findByText('Norte');
    act(() => emitirDesdeServidor('vehiculo-creado', {}));
    act(() => emitirDesdeServidor('bodega-creada', {}));
    await waitFor(() => expect(api.llamadasA('/ver-bodegas')).toHaveLength(2));
    act(() => emitirDesdeServidor('bodega-actualizada', {}));
    await waitFor(() => expect(api.llamadasA('/ver-bodegas')).toHaveLength(3));
  });

  it('muestra el mensaje de error de la consulta', async () => {
    simularApi({ 'GET /ver-bodegas': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarBodegas />);
    expect(await screen.findByText('Error al actualizar las bodegas')).toBeInTheDocument();
  });

  it('el mensaje del formulario de edición se muestra en la tabla', async () => {
    simularApi({ ...rutasCatalogos, 'GET /ver-bodegas': paginar(bodegas), 'GET /ver-bodega': [{ IdTipoBodega: 1, NombreBodega: 'Norte', Descripcion: '', IdEstado: 1 }] });
    const { user } = renderConProveedores(<TablaVisualizarBodegas />);
    await user.click((await screen.findAllByTitle('Editar'))[0]);
    await waitFor(() => expect(screen.getByLabelText('Nombre de bodega')).toHaveValue('Norte'));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Bodega actualizada correctamente')).toBeInTheDocument();
  });
});
