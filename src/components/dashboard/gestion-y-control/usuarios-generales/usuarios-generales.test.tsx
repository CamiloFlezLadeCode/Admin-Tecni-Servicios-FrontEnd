import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FormularioCrearUsuarioGeneral } from '@/components/dashboard/gestion-y-control/usuarios-generales/crear/FormularioCrearUsuarioGeneral';
import { FormularioEditarUsuarioGeneral } from '@/components/dashboard/gestion-y-control/usuarios-generales/editar/FormularioEditarUsuarioGeneral';
import { TablaVisualizarUsuariosGenerales } from '@/components/dashboard/gestion-y-control/usuarios-generales/ver/TablaVisualizarUsuariosGenerales';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

const catalogos = {
  'GET /listar-tipo-de-documentos': [
    { value: '1', label: 'Cédula' },
    { value: '2', label: 'NIT' },
  ],
  'GET /listar-roles': [
    { value: 1, label: 'Administrador' },
    { value: 4, label: 'Cliente' },
  ],
  'GET /listar-niveles': [{ value: '1', label: 'Junior' }],
  'GET /buscarclientepordocumento/*': { encontrado: false },
};

async function escribir(user: Usuario, campos: Record<string, string>) {
  for (const [etiqueta, valor] of Object.entries(campos)) {
    const campo = screen.getByLabelText(etiqueta);
    await user.clear(campo);
    await user.type(campo, valor);
  }
}

async function elegirRol(user: Usuario, rol: string) {
  await user.click(comboPorEtiqueta('Rol/es'));
  await user.click(within(await screen.findByRole('listbox')).getByText(rol));
  await user.keyboard('{Escape}');
}

describe('FormularioCrearUsuarioGeneral', () => {
  it('valida los obligatorios (correo por defecto "@gmail.com" es inválido)', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearUsuarioGeneral />);
    expect(screen.getByLabelText('Correo')).toHaveValue('@gmail.com');
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }));
    for (const mensaje of [
      'El nombre es obligatorio.',
      'El documento es obligatorio.',
      'La dirección es obligatoria.',
      'El celular 1 es obligatorio y debe ser un número válido de 10 dígitos.',
      'El correo es obligatorio y debe ser válido.',
      'El rol es obligatorio',
    ]) {
      expect(await screen.findByText(mensaje)).toBeInTheDocument();
    }
    expect(api.llamadasA('/crear-usuario-general')).toHaveLength(0);
  });

  it('avisa si el documento ya existe', async () => {
    const api = simularApi({ ...catalogos, 'GET /buscarclientepordocumento/*': { encontrado: true } });
    const { user } = renderConProveedores(<FormularioCrearUsuarioGeneral />);
    await user.type(screen.getByLabelText('Documento'), '77');
    expect(await screen.findByText('El cliente ya se encuentra registrado.')).toBeInTheDocument();
    expect(api.llamadasA('/buscarclientepordocumento/77')).toHaveLength(1);
  });

  it('crea el usuario con roles; el rol Cliente habilita Contacto', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearUsuarioGeneral />);
    await waitFor(() => expect(api.llamadasA('/listar-roles')).toHaveLength(1));
    await escribir(user, {
      Nombres: 'Ana',
      Apellidos: 'Gómez',
      Documento: '55',
      Dirección: 'Calle 2',
      'Celular 1': '3001234567',
      Correo: 'ana@t.co',
    });
    await elegirOpcion(user, 'Tipo de documento', 'NIT');
    await elegirOpcion(user, 'Estado', 'Inactivo');
    await elegirOpcion(user, 'Nivel', 'Junior');
    await elegirRol(user, 'Cliente');
    await user.type(screen.getByLabelText('Contacto'), 'Luis');
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(await screen.findByText('Usuario general creado exitosamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-usuario-general')[0].cuerpo).toEqual({
      Nombres: 'Ana',
      Apellidos: 'Gómez',
      TipoDocumento: '2',
      Documento: '55',
      Direccion: 'Calle 2',
      Celular1: '3001234567',
      Celular2: '',
      Correo: 'ana@t.co',
      UsuarioCreacion: '1001',
      Estado: 2,
      Roles: [4],
      Nivel: '1',
      Contacto: 'Luis',
    });
    expect(sockets[0].emit).toHaveBeenCalledWith('usuario-creado', {});
    expect(screen.getByLabelText('Nombres')).toHaveValue('');
  });

  it('al quitar el rol Cliente se borra el contacto; muestra errores del backend', async () => {
    const api = simularApi({ ...catalogos, 'POST /crear-usuario-general': new ErrorApi('dup') });
    const { user } = renderConProveedores(<FormularioCrearUsuarioGeneral />, { usuario: null });
    await waitFor(() => expect(api.llamadasA('/listar-roles')).toHaveLength(1));
    await escribir(user, { Nombres: 'A', Documento: '1', Dirección: 'C', 'Celular 1': '3001234567', Correo: 'a@b.co' });
    await elegirRol(user, 'Cliente');
    await user.type(screen.getByLabelText('Contacto'), 'Luis');
    await elegirRol(user, 'Cliente');
    await elegirRol(user, 'Administrador');
    expect(screen.getByLabelText('Contacto')).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }));
    expect(await screen.findByText(/^Error al crear el usuario general: /)).toBeInTheDocument();
    expect(api.llamadasA('/crear-usuario-general')[0].cuerpo).toMatchObject({ Roles: [1], UsuarioCreacion: null, Contacto: '' });
  });

  it('registra si fallan los catálogos', async () => {
    simularApi({
      'GET /listar-tipo-de-documentos': new ErrorApi('x'),
      'GET /listar-roles': new ErrorApi('x'),
      'GET /listar-niveles': new ErrorApi('x'),
    });
    renderConProveedores(<FormularioCrearUsuarioGeneral />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error al listar los niveles: ', expect.anything()));
    expect(console.error).toHaveBeenCalledWith('Error al listar los roles: ', expect.anything());
    expect(console.log).toHaveBeenCalledWith('Error al listar los tipos de documentos: ', expect.anything());
  });
});

describe('FormularioEditarUsuarioGeneral', () => {
  const usuario = {
    Nombres: 'Ana',
    Apellidos: 'Gómez',
    TipoDocumento: '1',
    Documento: '55',
    Direccion: 'Calle 2',
    Celular1: '3001234567',
    Celular2: '',
    Correo: 'ana@t.co',
    UsuarioCreacion: '1001',
    Estado: '1',
    Roles: '1, 4,',
    Nivel: '1',
    Contacto: 'Luis',
  };

  async function abrir(extra = {}) {
    const api = simularApi({ ...catalogos, 'GET /ver-usuario-general/*': [usuario], ...extra });
    const sendMessage = vi.fn();
    const onMostrarMensaje = vi.fn();
    const utilidades = renderConProveedores(
      <FormularioEditarUsuarioGeneral DatosUsuarioAActualizar="55" sendMessage={sendMessage} onMostrarMensaje={onMostrarMensaje} />
    );
    await utilidades.user.click(screen.getByTitle('Editar'));
    return { ...utilidades, api, sendMessage, onMostrarMensaje };
  }

  it('precarga el usuario (roles "1, 4," → [1, 4]) y guarda', async () => {
    const { user, api, sendMessage, onMostrarMensaje } = await abrir();
    await waitFor(() => expect(screen.getByLabelText('Nombres')).toHaveValue('Ana'));
    expect(api.llamadasA('/ver-usuario-general/55')).toHaveLength(1);
    expect(screen.getByLabelText('Contacto')).toHaveValue('Luis');
    await escribir(user, { Dirección: 'Carrera 7' });
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('Usuario general actualizado exitosamente', 'success'));
    expect(api.llamadasA('/actualizar-usuario-general')[0].cuerpo).toMatchObject({ Direccion: 'Carrera 7', Roles: [1, 4], Contacto: 'Luis' });
    expect(sendMessage).toHaveBeenCalledWith('usuario-actualizado', {});
  });

  it('sin roles registrados deja la lista vacía y oculta el contacto', async () => {
    const { user } = await abrir({ 'GET /ver-usuario-general/*': [{ ...usuario, Roles: null }] });
    await waitFor(() => expect(screen.getByLabelText('Nombres')).toHaveValue('Ana'));
    expect(screen.getByLabelText('Contacto')).toHaveValue('');
    await user.type(screen.getByLabelText('Documento'), '1');
  });

  it('avisa si el documento editado ya existe', async () => {
    const { user } = await abrir({ 'GET /buscarclientepordocumento/*': { encontrado: true } });
    await waitFor(() => expect(screen.getByLabelText('Nombres')).toHaveValue('Ana'));
    await user.type(screen.getByLabelText('Nombres'), 'x');
    expect(screen.queryByText('El cliente ya se encuentra registrado.')).not.toBeInTheDocument();
  });

  it('informa errores al cargar y al guardar', async () => {
    const { user, onMostrarMensaje } = await abrir({
      'GET /ver-usuario-general/*': new ErrorApi('no existe'),
      'GET /listar-roles': new ErrorApi('x'),
      'PUT /actualizar-usuario-general': new ErrorApi('falló'),
    });
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error...', expect.anything()));
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar los datos')));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al actualizar el usuario general'), 'error'));
  });

  it('se cierra con la X pero no con Escape', async () => {
    const { user } = await abrir();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Actualizar Usuario')).toBeInTheDocument();
    const cerrar = screen.getAllByRole('button').find((b) => !b.textContent && b.closest('[role="presentation"]'))!;
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByText('Actualizar Usuario')).not.toBeInTheDocument());
  });
});

describe('TablaVisualizarUsuariosGenerales', () => {
  const filas = [
    { Documento: '1', Nombre: 'Ana', Estado: 'Activo' },
    { Documento: '2', Nombre: 'Beto', Estado: 'Inactivo' },
    { Documento: '3', Nombre: 'Caro', Estado: 'Cancelada' },
    { Documento: '4', Nombre: 'Dani', Estado: 'En Proceso' },
    { Documento: '5', Nombre: 'Eva', Estado: 'Creado' },
    { Documento: '6', Nombre: 'Fede', Estado: 'Otro' },
  ];

  it('colorea el estado', async () => {
    simularApi({ 'GET /ver-usuarios-generales': paginar(filas) });
    renderConProveedores(<TablaVisualizarUsuariosGenerales />);
    expect(await screen.findByText('Ana')).toBeInTheDocument();
    const color = (t: string) => screen.getByText(t).closest('.MuiChip-root');
    expect(color('Activo')).toHaveClass('MuiChip-colorSuccess');
    expect(color('Inactivo')).toHaveClass('MuiChip-colorError');
    expect(color('Cancelada')).toHaveClass('MuiChip-colorError');
    expect(color('En Proceso')).toHaveClass('MuiChip-colorInfo');
    expect(color('Creado')).toHaveClass('MuiChip-colorInfo');
    expect(color('Otro')).toHaveClass('MuiChip-colorDefault');
  });

  it('recarga con usuario-creado/actualizado y muestra errores', async () => {
    const api = simularApi({ 'GET /ver-usuarios-generales': paginar(filas) });
    renderConProveedores(<TablaVisualizarUsuariosGenerales />);
    await screen.findByText('Ana');
    act(() => emitirDesdeServidor('usuario-creado', {}));
    await waitFor(() => expect(api.llamadasA('/ver-usuarios-generales')).toHaveLength(2));
    act(() => emitirDesdeServidor('usuario-actualizado', {}));
    await waitFor(() => expect(api.llamadasA('/ver-usuarios-generales')).toHaveLength(3));
    api.definir({ 'GET /ver-usuarios-generales': new ErrorApi('caído') });
    act(() => emitirDesdeServidor('bodega-creada', {}));
    act(() => emitirDesdeServidor('usuario-creado', {}));
    expect(await screen.findByText('Error al cargar los usuarios generales: Error: caído')).toBeInTheDocument();
  });

  it('el mensaje de edición aparece en la tabla', async () => {
    simularApi({ ...catalogos, 'GET /ver-usuarios-generales': paginar(filas.slice(0, 1)) });
    const { user } = renderConProveedores(<TablaVisualizarUsuariosGenerales />);
    await user.click(await screen.findByTitle('Editar'));
    await user.click(await screen.findByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Usuario general actualizado exitosamente')).toBeInTheDocument();
  });
});
