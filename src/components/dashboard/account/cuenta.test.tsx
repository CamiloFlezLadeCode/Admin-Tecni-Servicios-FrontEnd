import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, fireEvent, renderConProveedores, screen, waitFor } from '@test/utils';

const info = [{ Nombres: 'Ana', Apellidos: 'Pérez', Correo: 'ana@tecni.test', Direccion: 'Calle 1', Telefono: '', Celular: '3001234567' }];
const rutas = {
  'GET /ver-informacion-usuario/1001': () => info,
  'GET /mostrar-avatar/*': () => new Blob(['img'], { type: 'image/png' }),
  'POST /subir-avatar': () => ({ mensaje: 'ok' }),
  'PUT /actualizar-informacion-usuario': () => ({ mensaje: 'ok' }),
  'PUT /actualizar-credenciales': () => ({ mensaje: 'ok' }),
};

const archivo = () => new File(['png'], 'foto.png', { type: 'image/png' });
const entradaArchivo = () => document.querySelector('input[type="file"]') as HTMLInputElement;

describe('AccountInfo', () => {
  it('muestra los datos del usuario y su avatar', async () => {
    const api = simularApi(rutas);
    renderConProveedores(<AccountInfo />);
    expect(await screen.findByText('Calle 1')).toBeInTheDocument();
    expect(screen.getByText('ana@tecni.test')).toBeInTheDocument();
    expect(screen.getByText('3001234567')).toBeInTheDocument();
    expect(screen.getByText('Ana Administradora')).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('img[src^="blob:"]')).not.toBeNull());
    expect(api.llamadasA('/mostrar-avatar/1001')).toHaveLength(1);
  });

  it('previsualiza la imagen elegida y la sube con el documento como nombre', async () => {
    const api = simularApi(rutas);
    const { user } = renderConProveedores(<AccountInfo />);
    await screen.findByText('Calle 1');
    // Sin imagen elegida, "Guardar imagen" no hace nada.
    await user.click(screen.getByRole('button', { name: 'Guardar imagen' }));
    expect(api.llamadasA('/subir-avatar')).toHaveLength(0);

    const clic = vi.spyOn(entradaArchivo(), 'click');
    await user.click(screen.getByRole('button', { name: 'Subir imagen' }));
    expect(clic).toHaveBeenCalled();
    await user.upload(entradaArchivo(), archivo());
    await waitFor(() => expect(document.querySelector('img[src^="data:image/png"]')).not.toBeNull());

    await user.click(screen.getByRole('button', { name: 'Guardar imagen' }));
    await waitFor(() => expect(api.llamadasA('/subir-avatar')).toHaveLength(1));
    expect(api.llamadasA('/subir-avatar')[0].url).toContain('nombre=1001.png');
    expect(sockets[0].emit).toHaveBeenCalledWith('avatar-guardado', {});

    // Quitar la selección limpia la previsualización.
    fireEvent.change(entradaArchivo(), { target: { files: [] } });
    await waitFor(() => expect(document.querySelector('img[src^="data:image/png"]')).toBeNull());
  });

  it('recarga avatar e información con sus eventos; tolera errores al subir', async () => {
    const api = simularApi({ ...rutas, 'POST /subir-avatar': new ErrorApi('muy grande') });
    const { user } = renderConProveedores(<AccountInfo />);
    await screen.findByText('Calle 1');
    act(() => emitirDesdeServidor('avatar-guardado', {}));
    await waitFor(() => expect(api.llamadasA('/mostrar-avatar/1001')).toHaveLength(2));
    act(() => emitirDesdeServidor('informacion-usuario-activo-actualizada', {}));
    await waitFor(() => expect(api.llamadasA('/ver-informacion-usuario/1001')).toHaveLength(2));

    await user.upload(entradaArchivo(), archivo());
    await user.click(screen.getByRole('button', { name: 'Guardar imagen' }));
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error al subir la imagen:', expect.anything()));
    expect(sockets[0].emit).not.toHaveBeenCalledWith('avatar-guardado', {});
  });

  it('registra el error si no puede cargar la información', async () => {
    simularApi({ ...rutas, 'GET /ver-informacion-usuario/1001': new ErrorApi('x') });
    renderConProveedores(<AccountInfo />);
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar la información del usuario activo'))
    );
  });
});

describe('AccountDetailsForm', () => {
  it('carga, valida y guarda la información del perfil', async () => {
    const api = simularApi(rutas);
    const { user } = renderConProveedores(<AccountDetailsForm />);
    await waitFor(() => expect(screen.getByLabelText(/^Nombres/)).toHaveValue('Ana'));
    expect(screen.getByLabelText(/^Apellidos/)).toHaveValue('Pérez');

    // El celular solo acepta dígitos y máximo 10.
    const celular = screen.getByLabelText(/^Celular/);
    fireEvent.change(celular, { target: { value: '300-12a' } });
    expect(celular).toHaveValue('30012');
    fireEvent.change(celular, { target: { value: '30012345678' } });
    expect(celular).toHaveValue('30012');
    fireEvent.change(celular, { target: { value: '3009998877' } });

    fireEvent.change(screen.getByLabelText(/^Nombres/), { target: { value: '' } });
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(api.llamadasA('/actualizar-informacion-usuario')).toHaveLength(0);

    fireEvent.change(screen.getByLabelText(/^Nombres/), { target: { value: 'Ana María' } });
    fireEvent.change(screen.getByLabelText(/^Dirección/), { target: { value: 'Calle 2' } });
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText(/^Información actualizada correctamente/)).toBeInTheDocument();
    expect(api.llamadasA('/actualizar-informacion-usuario')[0].cuerpo).toEqual({
      NombresUsuario: 'Ana María',
      ApellidosUsuario: 'Pérez',
      CorreoUsuario: 'ana@tecni.test',
      DireccionUsuario: 'Calle 2',
      CelularUsuario: '3009998877',
      DocumentoUsuario: '1001',
    });
    expect(sockets[0].emit).toHaveBeenCalledWith('informacion-usuario-activo-actualizada', {});
  });

  it('muestra el error al guardar', async () => {
    simularApi({ ...rutas, 'PUT /actualizar-informacion-usuario': new ErrorApi('x') });
    const { user } = renderConProveedores(<AccountDetailsForm />);
    await waitFor(() => expect(screen.getByLabelText(/^Nombres/)).toHaveValue('Ana'));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText(/^Errro al actualizar la información:/)).toBeInTheDocument();
  });

  it('registra el error si no puede cargar la información', async () => {
    simularApi({ ...rutas, 'GET /ver-informacion-usuario/1001': new ErrorApi('x') });
    renderConProveedores(<AccountDetailsForm />);
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar la información del usuario activo'))
    );
  });
});

describe('UpdatePasswordForm', () => {
  const campo = (etiqueta: string) => screen.getByLabelText(etiqueta);

  it('exige confirmar la misma contraseña y actualiza las credenciales del usuario activo', async () => {
    const api = simularApi(rutas);
    const { user } = renderConProveedores(<UpdatePasswordForm />);
    expect(campo('Usuario')).toHaveValue('1001');
    await user.click(screen.getByRole('button', { name: 'Actualizar' }));
    // Comportamiento actual (defecto reportado): sin valores por defecto para las claves,
    // zod responde con su mensaje genérico en inglés en lugar de los mensajes en español.
    expect(await screen.findAllByText('Required')).toHaveLength(2);

    await user.type(campo('Contraseña'), 'Clave1');
    await user.type(campo('Confirmar contraseña'), 'Clave2');
    await user.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();

    // Mostrar/ocultar ambas contraseñas (los dos últimos botones de ojo del formulario).
    const ojos = Array.from(document.querySelectorAll('form button:not([type="submit"])')) as HTMLElement[];
    await user.click(ojos.at(-2)!);
    expect(campo('Contraseña')).toHaveAttribute('type', 'text');
    await user.click(ojos.at(-1)!);
    expect(campo('Confirmar contraseña')).toHaveAttribute('type', 'text');

    await user.clear(campo('Confirmar contraseña'));
    await user.type(campo('Confirmar contraseña'), 'Clave1');
    await user.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(await screen.findByText('Credenciales actualizadas correctamente')).toBeInTheDocument();
    expect(api.llamadasA('/actualizar-credenciales')[0].cuerpo).toEqual({
      User: '1001',
      Password: 'Clave1',
      ConfirmPassword: 'Clave1',
      DocumentoUsuarioActivo: '1001',
    });
  });

  it('informa el error del backend', async () => {
    simularApi({ ...rutas, 'PUT /actualizar-credenciales': new ErrorApi('x') });
    const { user } = renderConProveedores(<UpdatePasswordForm />);
    await user.type(campo('Contraseña'), 'Clave1');
    await user.type(campo('Confirmar contraseña'), 'Clave1');
    await user.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(await screen.findByText(/^Ocurrió un error al actualizar las credenciales:/)).toBeInTheDocument();
  });
});
