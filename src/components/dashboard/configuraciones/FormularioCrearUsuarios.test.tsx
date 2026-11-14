import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { FormularioCrearUsuarios } from '@/components/dashboard/configuraciones/FormularioCrearUsuarios';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { elegirOpcion, renderConProveedores, screen, waitFor } from '@test/utils';

const rutas = {
  'GET /ver-profesionales-pertenecientes': () => [
    { value: '2002', label: 'Oscar' },
    { value: '3003', label: 'Paula' },
  ],
  'GET /consultar-credenciales-del-profesional/2002': () => ({
    TieneCredenciales: 'SI',
    Credenciales: [{ ClaveUsuarioProfesional: '$argon2id$hash' }],
  }),
  'GET /consultar-credenciales-del-profesional/3003': () => ({ TieneCredenciales: 'NO', Credenciales: [] }),
};

const usuario = () => screen.getByLabelText('Usuario');
const clave = () => screen.getByLabelText('Contraseña');

async function montar(extra = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const utilidades = renderConProveedores(<FormularioCrearUsuarios />);
  await waitFor(() => expect(api.llamadasA('/ver-profesionales-pertenecientes')).toHaveLength(1));
  return { ...utilidades, api };
}

describe('FormularioCrearUsuarios', () => {
  it('sin profesional el botón está deshabilitado', async () => {
    await montar();
    expect(screen.getByRole('button', { name: '.' })).toBeDisabled();
    expect(usuario()).toBeDisabled();
  });

  it('crea credenciales para un profesional que no tiene', async () => {
    const { user, api } = await montar();
    await elegirOpcion(user, 'Seleccionar profesional', 'Paula');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Crear' })).toBeEnabled());
    expect(usuario()).toHaveValue('3003');
    expect(clave()).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Crear' }));
    expect(await screen.findByText('La contraseña es obligatoria')).toBeInTheDocument();
    await user.type(clave(), 'Clave123');
    await user.click(screen.getByRole('button', { name: 'Crear' }));
    expect(await screen.findByText('Credenciales creadas correctamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-credenciales-profesional')[0].cuerpo).toEqual({
      DocumentoProfesional: '3003',
      User: '3003',
      Password: 'Clave123',
      DocumentoUsuario: '1001',
      Accion: 'Crear',
    });
    expect(screen.getByRole('button', { name: '.' })).toBeDisabled();
    expect(usuario()).toHaveValue('');
  });

  it('actualiza credenciales existentes (hoy precarga la clave guardada)', async () => {
    const { user, api } = await montar();
    await elegirOpcion(user, 'Seleccionar profesional', 'Oscar');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Actualizar' })).toBeEnabled());
    // Comportamiento actual (defecto reportado): el campo trae la clave tal como la guarda el backend.
    expect(clave()).toHaveValue('$argon2id$hash');
    expect(clave()).toHaveAttribute('type', 'password');
    await user.click(clave().parentElement!.querySelector('button')!);
    expect(clave()).toHaveAttribute('type', 'text');

    await user.clear(clave());
    await user.type(clave(), 'Nueva456');
    await user.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(await screen.findByText('Credenciales actualizadas correctamente')).toBeInTheDocument();
    expect(api.llamadasA('/actualizar-credenciales-profesional')[0]).toMatchObject({
      metodo: 'put',
      cuerpo: { DocumentoProfesional: '2002', User: '2002', Password: 'Nueva456', Accion: 'Actualizar' },
    });
  });

  it('volver a "Sin seleccionar" limpia y deshabilita', async () => {
    const { user } = await montar();
    await elegirOpcion(user, 'Seleccionar profesional', 'Paula');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Crear' })).toBeEnabled());
    await elegirOpcion(user, 'Seleccionar profesional', 'Sin seleccionar');
    expect(screen.getByRole('button', { name: '.' })).toBeDisabled();
    expect(usuario()).toHaveValue('');
  });

  it('informa los errores de listar, consultar y guardar', async () => {
    const { user } = await montar({
      'GET /consultar-credenciales-del-profesional/2002': new ErrorApi('sin acceso'),
      'POST /crear-credenciales-profesional': new ErrorApi('duplicado'),
    });
    await elegirOpcion(user, 'Seleccionar profesional', 'Oscar');
    expect(await screen.findByText(/^Hubo un error al consultar las credenciales del profesional:/)).toBeInTheDocument();

    await elegirOpcion(user, 'Seleccionar profesional', 'Paula');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Crear' })).toBeEnabled());
    await user.type(clave(), 'x');
    await user.click(screen.getByRole('button', { name: 'Crear' }));
    expect(await screen.findByText(/^Hubo un error al crear las credenciales del profesional:/)).toBeInTheDocument();
  });

  it('avisa si no puede listar los profesionales', async () => {
    simularApi({ 'GET /ver-profesionales-pertenecientes': new ErrorApi('caído') });
    renderConProveedores(<FormularioCrearUsuarios />);
    expect(await screen.findByText(/^Hubo un error al listar los profesionales\./)).toBeInTheDocument();
  });
});
