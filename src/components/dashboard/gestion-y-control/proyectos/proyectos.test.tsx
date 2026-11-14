import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FormularioCrearProyecto } from '@/components/dashboard/gestion-y-control/proyectos/crear/FormularioCrearProyecto';
import { ModalFormularioEditarProyecto } from '@/components/dashboard/gestion-y-control/proyectos/editar/ModalFormularioEditarProyecto';
import { TablaVisualizarProyectos } from '@/components/dashboard/gestion-y-control/proyectos/ver/TablaVisualizarProyectos';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

const clientes = [
  { value: '900', label: 'Constructora Andes' },
  { value: '901', label: 'Obras del Valle' },
];

describe('FormularioCrearProyecto', () => {
  it('exige nombre, cliente y dirección (estado Activo por defecto)', async () => {
    const api = simularApi({ 'GET /listar-clientes': clientes });
    const { user } = renderConProveedores(<FormularioCrearProyecto />);
    await user.click(screen.getByRole('button', { name: 'Crear proyecto' }));
    expect(await screen.findByText('Por favor complete todos los campos requeridos')).toBeInTheDocument();
    expect(screen.getByText('El nombre del proyecto es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El cliente es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('La dirección es obligatoria.')).toBeInTheDocument();
    expect(screen.queryByText('El estado es obligatorio')).not.toBeInTheDocument();
    expect(api.llamadasA('/crear-proyecto')).toHaveLength(0);
  });

  it('al corregir un campo se borra su error', async () => {
    simularApi({ 'GET /listar-clientes': clientes });
    const { user } = renderConProveedores(<FormularioCrearProyecto />);
    await user.click(screen.getByRole('button', { name: 'Crear proyecto' }));
    await user.type(screen.getByLabelText(/^Nombre/), 'T');
    expect(screen.queryByText('El nombre del proyecto es obligatorio.')).not.toBeInTheDocument();
    expect(screen.getByText('La dirección es obligatoria.')).toBeInTheDocument();
  });

  it('crea el proyecto, avisa y limpia', async () => {
    const api = simularApi({ 'GET /listar-clientes': clientes });
    const { user } = renderConProveedores(<FormularioCrearProyecto />);
    await waitFor(() => expect(api.llamadasA('/listar-clientes')).toHaveLength(1));
    await user.type(screen.getByLabelText(/^Nombre/), 'Torre 1');
    await elegirOpcion(user, /^Empresa\/Cliente/, 'Obras del Valle');
    await user.type(screen.getByLabelText(/^Dirección/), 'Calle 1 # 2-3');
    await elegirOpcion(user, /^Estado/, 'Inactivo');
    await user.click(screen.getByRole('button', { name: 'Crear proyecto' }));
    expect(await screen.findByText('Proyecto creado exitosamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-proyecto')[0].cuerpo).toEqual({
      NombreProyecto: 'Torre 1',
      DocumentoCliente: '901',
      DireccionProyecto: 'Calle 1 # 2-3',
      UsuarioCreacion: '1001',
      EstadoProyecto: '2',
    });
    expect(sockets[0].emit).toHaveBeenCalledWith('proyecto-creado', {});
    expect(screen.getByLabelText(/^Nombre/)).toHaveValue('');
  });

  it('muestra errores del backend y de carga de clientes', async () => {
    simularApi({ 'GET /listar-clientes': new ErrorApi('caído'), 'POST /crear-proyecto': new ErrorApi('Duplicado') });
    const { user } = renderConProveedores(<FormularioCrearProyecto />, { usuario: null });
    expect(await screen.findByText('Error al cargar clientes')).toBeInTheDocument();
  });

  it('muestra el error al crear', async () => {
    simularApi({ 'GET /listar-clientes': clientes, 'POST /crear-proyecto': () => Promise.reject('rechazado') });
    const { user } = renderConProveedores(<FormularioCrearProyecto />);
    await waitFor(() => comboPorEtiqueta(/^Empresa\/Cliente/));
    await user.type(screen.getByLabelText(/^Nombre/), 'T');
    await elegirOpcion(user, /^Empresa\/Cliente/, 'Obras del Valle');
    await user.type(screen.getByLabelText(/^Dirección/), 'C');
    await user.click(screen.getByRole('button', { name: 'Crear proyecto' }));
    expect(await screen.findByText('Error al crear el proyecto: rechazado')).toBeInTheDocument();
  });
});

describe('ModalFormularioEditarProyecto', () => {
  const rutas = {
    'GET /listar-clientes': clientes,
    'GET /listar-estados': [
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
      { value: 5, label: 'Anulado' },
    ],
    'GET /ver-proyecto-por-id': [{ NombreProyecto: 'Torre 1', DocumentoCliente: '900', DireccionProyecto: 'Calle 1', IdEstadoProyecto: 1 }],
  };

  async function abrir(extra = {}) {
    const api = simularApi({ ...rutas, ...extra });
    const onMostrarMensaje = vi.fn();
    const sendMessage = vi.fn();
    const utilidades = renderConProveedores(
      <ModalFormularioEditarProyecto ProyectoAEditar={{ IdProyecto: 3 }} onMostrarMensaje={onMostrarMensaje} sendMessage={sendMessage} />
    );
    await utilidades.user.click(screen.getByTitle('Editar'));
    return { ...utilidades, api, onMostrarMensaje, sendMessage };
  }

  it('precarga el proyecto y ofrece solo estados Activo/Inactivo', async () => {
    const { user, api } = await abrir();
    await waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue('Torre 1'));
    expect(api.llamadasA('/ver-proyecto-por-id')).toHaveLength(1);
    expect(comboPorEtiqueta('Empresa/Cliente')).toHaveTextContent('Constructora Andes');
    await user.click(comboPorEtiqueta('Estado'));
    expect(within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent)).toEqual(['Activo', 'Inactivo']);
  });

  it('guarda los cambios y avisa por WebSocket', async () => {
    const { user, api, onMostrarMensaje, sendMessage } = await abrir();
    await waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue('Torre 1'));
    await user.clear(screen.getByLabelText('Dirección'));
    await user.type(screen.getByLabelText('Dirección'), 'Carrera 9');
    await elegirOpcion(user, 'Empresa/Cliente', 'Obras del Valle');
    await elegirOpcion(user, 'Estado', 'Inactivo');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('Proyecto actualizado correctamente.', 'success'));
    expect(api.llamadasA('/actualizar-proyecto')[0].cuerpo).toEqual({
      IdProyecto: 3,
      NuevoNombreProyecto: 'Torre 1',
      NuevoClienteProyecto: '901',
      NuevaDireccionProyecto: 'Carrera 9',
      NuevoEstadoProyecto: 2,
    });
    expect(sendMessage).toHaveBeenCalledWith('proyecto-actualizado', {});
  });

  it('informa errores al guardar y al cargar', async () => {
    const { user, onMostrarMensaje } = await abrir({
      'GET /ver-proyecto-por-id': new ErrorApi('no existe'),
      'PUT /actualizar-proyecto': new ErrorApi('falló'),
    });
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error:')));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al actualizar el proyecto'), 'error'));
  });

  it('se cierra con la X pero no con Escape', async () => {
    const { user } = await abrir();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Actualizar proyecto')).toBeInTheDocument();
    const cerrar = screen.getAllByRole('button').find((b) => !b.textContent && b.closest('[role="presentation"]'))!;
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByText('Actualizar proyecto')).not.toBeInTheDocument());
  });
});

describe('TablaVisualizarProyectos', () => {
  const proyectos = [
    { IdProyecto: 1, NombreProyecto: 'Torre 1', Cliente: 'Andes', DireccionProyecto: 'C1', UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoProyecto: 'ACTIVO' },
    { IdProyecto: 2, NombreProyecto: 'Puente', Cliente: 'Valle', DireccionProyecto: 'C2', UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoProyecto: 'Inactivo' },
    { IdProyecto: 3, NombreProyecto: 'Raro', Cliente: 'Valle', DireccionProyecto: 'C3', UsuarioCreacion: 'Ana', FechaCreacion: '01/01', EstadoProyecto: 'Otro' },
  ];

  it('muestra el estado normalizado; los desconocidos como Inactivo', async () => {
    simularApi({ 'GET /ver-proyectos': paginar(proyectos) });
    renderConProveedores(<TablaVisualizarProyectos />);
    expect(await screen.findByText('Torre 1')).toBeInTheDocument();
    const filaRaro = screen.getByText('Raro').closest('tr')!;
    expect(within(filaRaro).getByText('Inactivo')).toBeInTheDocument();
    expect(screen.getByText('Activo').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
  });

  it('recarga con proyecto-creado/actualizado y muestra errores', async () => {
    const api = simularApi({ 'GET /ver-proyectos': paginar(proyectos) });
    renderConProveedores(<TablaVisualizarProyectos />);
    await screen.findByText('Torre 1');
    act(() => emitirDesdeServidor('proyecto-creado', {}));
    await waitFor(() => expect(api.llamadasA('/ver-proyectos')).toHaveLength(2));
    act(() => emitirDesdeServidor('proyecto-actualizado', {}));
    await waitFor(() => expect(api.llamadasA('/ver-proyectos')).toHaveLength(3));
    act(() => emitirDesdeServidor('otro', {}));
    api.definir({ 'GET /ver-proyectos': new ErrorApi('x') });
    act(() => emitirDesdeServidor('proyecto-creado', {}));
    expect(await screen.findByText('Error al cargar los proyectos')).toBeInTheDocument();
  });

  it('el mensaje de edición se muestra en la tabla', async () => {
    simularApi({
      'GET /ver-proyectos': paginar(proyectos.slice(0, 1)),
      'GET /ver-proyecto-por-id': [{ NombreProyecto: 'Torre 1', DocumentoCliente: '900', DireccionProyecto: 'C', IdEstadoProyecto: 1 }],
    });
    const { user } = renderConProveedores(<TablaVisualizarProyectos />);
    await user.click(await screen.findByTitle('Editar'));
    await user.click(await screen.findByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Proyecto actualizado correctamente.')).toBeInTheDocument();
  });
});
