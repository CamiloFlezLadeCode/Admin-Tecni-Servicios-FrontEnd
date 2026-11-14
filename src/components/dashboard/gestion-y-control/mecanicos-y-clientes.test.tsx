import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { FormularioCrearCliente } from '@/components/dashboard/gestion-y-control/clientes/crear/FormularioCrearCliente';
import { TablaVisualizarCientes } from '@/components/dashboard/gestion-y-control/clientes/ver/TablaVisualizarClientes';
import { FormularioCrearMecanico } from '@/components/dashboard/gestion-y-control/mecanicos/crear/FormularioCrearMecanico';
import { TablaVisualizarMecanicos } from '@/components/dashboard/gestion-y-control/mecanicos/ver/TablaVisualizarMecanicos';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

async function escribir(user: Usuario, campos: Record<string, string>) {
  for (const [etiqueta, valor] of Object.entries(campos)) {
    const campo = screen.getByLabelText(etiqueta);
    await user.clear(campo);
    await user.type(campo, valor);
  }
}

describe('FormularioCrearMecanico', () => {
  const niveles = [
    { value: 1, label: 'Junior' },
    { value: 2, label: 'Senior' },
  ];

  it('carga los niveles y deja el rol Mecánico fijo', async () => {
    const api = simularApi({ 'GET /listar-niveles': niveles });
    renderConProveedores(<FormularioCrearMecanico />);
    await waitFor(() => expect(api.llamadasA('/listar-niveles')).toHaveLength(1));
    expect(comboPorEtiqueta('Rol')).toHaveTextContent('Mecánico');
    expect(comboPorEtiqueta('Rol')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('Correo')).toHaveValue('@gmail.com');
  });

  it('valida campos, celular de 10 dígitos y correo antes de crear', async () => {
    const api = simularApi({ 'GET /listar-niveles': niveles });
    const { user } = renderConProveedores(<FormularioCrearMecanico />);
    await user.click(screen.getByRole('button', { name: 'Crear mecánico' }));
    for (const mensaje of [
      'El nombre es obligatorio.',
      'El apellido es obligatorio.',
      'El documento es obligatorio.',
      'La dirección es obligatoria.',
      'El celular es obligatorio y debe ser un número válido de 10 dígitos.',
      'El correo es obligatorio y debe ser válido.',
      'El nivel es obligatorio',
    ]) {
      expect(await screen.findByText(mensaje)).toBeInTheDocument();
    }
    expect(api.llamadasA('/crear-mecanico')).toHaveLength(0);
  });

  it('crea el mecánico con todos los datos y limpia el formulario', async () => {
    const api = simularApi({ 'GET /listar-niveles': niveles });
    const { user } = renderConProveedores(<FormularioCrearMecanico />);
    await waitFor(() => expect(api.llamadasA('/listar-niveles')).toHaveLength(1));
    await escribir(user, {
      Nombres: 'Pedro',
      Apellidos: 'Pérez',
      Documento: '123',
      Dirección: 'Calle 1',
      Celular: '3001234567',
      Correo: 'pedro@t.co',
    });
    await elegirOpcion(user, 'Tipo de documento', 'Pasaporte');
    await elegirOpcion(user, 'Estado', 'Inactivo');
    await elegirOpcion(user, 'Nivel', 'Senior');
    await user.click(screen.getByRole('button', { name: 'Crear mecánico' }));

    expect(await screen.findByText('Mecánico creado exitosamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-mecanico')[0].cuerpo).toEqual({
      Nombres: 'Pedro',
      Apellidos: 'Pérez',
      TipoDocumento: 5,
      Documento: '123',
      Direccion: 'Calle 1',
      Celular: '3001234567',
      Correo: 'pedro@t.co',
      UsuarioCreacion: '1001',
      Estado: '2',
      Roles: '2',
      Nivel: 2,
    });
    expect(screen.getByLabelText('Nombres')).toHaveValue('');
  });

  it('muestra el error del backend y registra si fallan los niveles', async () => {
    const api = simularApi({ 'GET /listar-niveles': new ErrorApi('caído') });
    renderConProveedores(<FormularioCrearMecanico />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error al listar los niveles: ', expect.anything()));
    api.definir({ 'GET /listar-niveles': niveles, 'POST /crear-mecanico': new ErrorApi('Documento repetido') });
  });

  it('muestra el error al crear', async () => {
    simularApi({ 'GET /listar-niveles': niveles, 'POST /crear-mecanico': new ErrorApi('Documento repetido') });
    const { user } = renderConProveedores(<FormularioCrearMecanico />, { usuario: null });
    await waitFor(() => comboPorEtiqueta('Nivel'));
    await escribir(user, { Nombres: 'P', Apellidos: 'P', Documento: '1', Dirección: 'C', Celular: '3001234567', Correo: 'p@t.co' });
    await elegirOpcion(user, 'Nivel', 'Junior');
    await user.click(screen.getByRole('button', { name: 'Crear mecánico' }));
    expect(await screen.findByText(/^Error al crear el mecánico: /)).toBeInTheDocument();
  });
});

describe('FormularioCrearCliente', () => {
  it('avisa si la identificación ya está registrada al escribirla', async () => {
    const api = simularApi({ 'GET /buscarclientepordocumento/*': { encontrado: true } });
    const { user } = renderConProveedores(<FormularioCrearCliente />);
    await user.type(screen.getByLabelText('Identificación'), '9');
    expect(await screen.findByText('El cliente ya se encuentra registrado.')).toBeInTheDocument();
    expect(api.llamadasA('/buscarclientepordocumento/9')).toHaveLength(1);
  });

  it('no avisa si el cliente no existe ni consulta con el campo vacío', async () => {
    const api = simularApi({ 'GET /buscarclientepordocumento/*': { encontrado: false } });
    const { user } = renderConProveedores(<FormularioCrearCliente />);
    await user.type(screen.getByLabelText('Identificación'), '9');
    await user.type(screen.getByLabelText('Identificación'), ' ');
    await waitFor(() => expect(api.llamadasA('/buscarclientepordocumento/9')).toHaveLength(1));
    expect(screen.queryByText('El cliente ya se encuentra registrado.')).not.toBeInTheDocument();
  });

  it('crea el cliente con rol Cliente y tipo NIT por defecto', async () => {
    const api = simularApi({ 'GET /buscarclientepordocumento/*': { encontrado: false } });
    const { user } = renderConProveedores(<FormularioCrearCliente />);
    expect(comboPorEtiqueta('Tipo de identificación')).toHaveTextContent('Nit');
    await escribir(user, {
      Nombre: 'Constructora Andes',
      Identificación: '900',
      Dirección: 'Calle 1',
      Teléfono: '6011234',
      Celular: '3001234567',
      Correo: 'andes@t.co',
    });
    await elegirOpcion(user, 'Estado', 'Inactivo');
    await user.click(screen.getByRole('button', { name: 'Crear cliente' }));
    expect(await screen.findByText('Cliente creado exitosamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-usuario')[0].cuerpo).toEqual({
      Nombres: 'Constructora Andes',
      TipoDocumento: '4',
      DocumentoUsuario: '900',
      Direccion: 'Calle 1',
      Telefono: '6011234',
      Celular: '3001234567',
      Correo: 'andes@t.co',
      Estado: '2',
      UsuarioCreacion: '1001',
      Roles: '4',
    });
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
  });

  it('valida antes de crear y muestra el error del backend', async () => {
    const api = simularApi({ 'GET /buscarclientepordocumento/*': { encontrado: false }, 'POST /crear-usuario': new ErrorApi('Ya existe') });
    const { user } = renderConProveedores(<FormularioCrearCliente />);
    await user.click(screen.getByRole('button', { name: 'Crear cliente' }));
    expect(await screen.findByText('El teléfono es obligatorio.')).toBeInTheDocument();
    expect(api.llamadasA('/crear-usuario')).toHaveLength(0);

    await escribir(user, { Nombre: 'X', Identificación: '1', Dirección: 'C', Teléfono: '1', Celular: '3001234567', Correo: 'x@t.co' });
    await user.click(screen.getByRole('button', { name: 'Crear cliente' }));
    expect(await screen.findByText(/^Error al crear el cliente: /)).toBeInTheDocument();
  });
});

describe('tablas de mecánicos y clientes', () => {
  const mecanicos = [
    { Nombre: 'Pedro', TipoDocumento: 'CC', Documento: '1', Correo: 'p@t', Direccion: 'C', Celular: '300', UsuarioCreacion: 'Ana', FechaCreacion: '01/01', Estado: 'Activo' },
    { Nombre: 'Juan', TipoDocumento: 'CC', Documento: '2', Correo: 'j@t', Direccion: 'C', Celular: '300', UsuarioCreacion: 'Ana', FechaCreacion: '01/01', Estado: 'Otro' },
  ];
  const clientes = [
    { Nombre: 'Andes', TipoDocumento: 'NIT', Documento: '900', Correo: 'a@t', Direccion: 'C', Telefono: '601', Celular: '300', CreadoPor: 'Ana', FechaCreacion: '01/01', Estado: 'Activo' },
    { Nombre: 'Valle', TipoDocumento: 'NIT', Documento: '901', Correo: 'v@t', Direccion: 'C', Telefono: '602', Celular: '301', CreadoPor: 'Ana', FechaCreacion: '01/01', Estado: 'Suspendido' },
  ];

  it('mecánicos: pagina de a 5, busca en el servidor y marca desconocidos como Inactivo', async () => {
    const api = simularApi({ 'GET /ver-mecanicos': paginar(mecanicos, { Total: 12 }) });
    const { user } = renderConProveedores(<TablaVisualizarMecanicos />);
    expect(await screen.findByText('Pedro')).toBeInTheDocument();
    expect(api.llamadasA('/ver-mecanicos')[0].params).toEqual({ pagina: 1, limite: 5 });
    expect(within(screen.getByText('Juan').closest('tr')!).getByText('Inactivo')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(api.llamadasA('/ver-mecanicos').at(-1)!.params).toEqual({ pagina: 2, limite: 5 }));
    await user.click(screen.getByRole('combobox', { name: /Filas por página/ }));
    await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: '10' }));
    await waitFor(() => expect(api.llamadasA('/ver-mecanicos').at(-1)!.params).toEqual({ pagina: 1, limite: 10 }));
    await user.type(screen.getByPlaceholderText('Buscar mecánico...'), 'ped');
    await waitFor(() => expect(api.llamadasA('/ver-mecanicos').at(-1)!.params).toMatchObject({ busqueda: 'ped' }));
  });

  it('mecánicos: muestra el error de carga', async () => {
    simularApi({ 'GET /ver-mecanicos': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarMecanicos />);
    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });

  it('clientes: muestra carga, columnas extra a pedido y estado por defecto', async () => {
    const api = simularApi({ 'GET /ver-clientes': paginar(clientes, { Total: 7 }) });
    const { user } = renderConProveedores(<TablaVisualizarCientes />);
    expect(screen.getByText('Cargando clientes...')).toBeInTheDocument();
    expect(await screen.findByText('Andes')).toBeInTheDocument();
    expect(screen.queryByText('Teléfono')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mostrar más columnas' }));
    expect(screen.getByText('Teléfono')).toBeInTheDocument();
    expect(screen.getByText('602')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mostrar menos columnas' }));
    expect(screen.queryByText('602')).not.toBeInTheDocument();
    expect(screen.getByText('Suspendido').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault');
    await user.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(api.llamadasA('/ver-clientes').at(-1)!.params).toEqual({ pagina: 2, limite: 5 }));
    await user.click(screen.getByRole('combobox', { name: /Filas por página/ }));
    await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: '25' }));
    await waitFor(() => expect(api.llamadasA('/ver-clientes').at(-1)!.params).toEqual({ pagina: 1, limite: 25 }));
    await user.type(screen.getByPlaceholderText('Buscar cliente...'), 'and');
    await waitFor(() => expect(api.llamadasA('/ver-clientes').at(-1)!.params).toMatchObject({ busqueda: 'and' }));
  });

  it('clientes: muestra el error de carga', async () => {
    simularApi({ 'GET /ver-clientes': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarCientes />);
    expect(await screen.findByText('Error al cargar clientes')).toBeInTheDocument();
  });
});
