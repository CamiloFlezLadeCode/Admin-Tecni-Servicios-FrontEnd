import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { ConEstado, ErrorApi, simularApi } from '@test/mocks/api';
import { routerMock } from '@test/mocks/next-navigation';
import { fireEvent, renderConProveedores, screen, waitFor } from '@test/utils';

const sesion = { rol: 'Administrador', nombre: 'Ana', documento: '1001', correo: 'ana@tecni.test', token: 'jwt-1', accesohabilitado: true };

/** El servicio de login ofusca las credenciales con XOR + base64 usando la clave enviada. */
function descifrar(data: string, key: string) {
  const texto = atob(data);
  let resultado = '';
  for (let i = 0; i < texto.length; i++) resultado += String.fromCharCode(texto.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  return JSON.parse(resultado);
}

/** Los formularios de auth no asocian el <label> al input (sin id/htmlFor): se busca por su FormControl. */
const campo = (etiqueta: string) =>
  screen.getByText(etiqueta, { selector: 'label' }).closest('.MuiFormControl-root')!.querySelector('input') as HTMLInputElement;

function montarLogin(rutas = {}) {
  const api = simularApi({ 'POST /login': () => sesion, ...rutas });
  const checkSession = vi.fn(async () => undefined);
  const utilidades = renderConProveedores(<SignInForm />, { usuario: null, contextoUsuario: { checkSession } });
  return { ...utilidades, api, checkSession };
}

async function ingresar(user: ReturnType<typeof montarLogin>['user'], usuario = 'ana', clave = 'secreta') {
  await user.type(campo('Usuario'), usuario);
  await user.type(campo('Contraseña'), clave);
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
}

describe('SignInForm', () => {
  afterEach(() => {
    localStorage.clear();
    document.cookie = 'custom-auth-rol=; max-age=0; path=/';
    delete (HTMLElement.prototype as any).animate;
  });

  it.each([
    [8, 'Buenos días'],
    [15, 'Buenas tardes'],
    [21, 'Buenas noches'],
  ])('a las %i h saluda con "%s"', async (hora, saludo) => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(hora);
    montarLogin();
    expect(await screen.findByRole('heading', { name: saludo })).toBeInTheDocument();
  });

  it('exige usuario y contraseña y sacude la tarjeta', async () => {
    const animate = vi.fn();
    (HTMLElement.prototype as any).animate = animate;
    const { user, api } = montarLogin();
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('El usuario es requerido')).toBeInTheDocument();
    expect(screen.getByText('Contraseña es requerida')).toBeInTheDocument();
    expect(animate).toHaveBeenCalledTimes(1);
    expect(api.llamadasA('/login')).toHaveLength(0);
  });

  it('no sacude la tarjeta si el sistema pide reducir movimiento', async () => {
    const animate = vi.fn();
    (HTMLElement.prototype as any).animate = animate;
    const original = window.matchMedia;
    vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({ ...original(q), matches: q.includes('reduce') }));
    const { user } = montarLogin();
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('El usuario es requerido');
    expect(animate).not.toHaveBeenCalled();
  });

  it('muestra/oculta la contraseña y avisa de Bloq Mayús', async () => {
    const { user } = montarLogin();
    const clave = campo('Contraseña');
    expect(clave).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(clave).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(clave).toHaveAttribute('type', 'password');

    fireEvent.keyDown(clave, { key: 'A', modifierCapsLock: true });
    expect(screen.getByText('Bloq Mayús está activado')).toBeInTheDocument();
    fireEvent.keyUp(clave, { key: 'a', modifierCapsLock: false });
    expect(screen.queryByText('Bloq Mayús está activado')).not.toBeInTheDocument();
    fireEvent.keyDown(clave, { key: 'A', modifierCapsLock: true });
    fireEvent.blur(clave);
    expect(screen.queryByText('Bloq Mayús está activado')).not.toBeInTheDocument();
  });

  it('inicia sesión: envía las credenciales ofuscadas, guarda la sesión y va al dashboard', async () => {
    const { user, api, checkSession } = montarLogin();
    await ingresar(user);
    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith('/dashboard'));
    const { cuerpo } = api.llamadasA('/login')[0] as any;
    expect(descifrar(cuerpo.data, cuerpo.key)).toEqual({ NombreUsuario: 'ana', ClaveUsuario: 'secreta' });
    expect(localStorage.getItem('custom-auth-token-autenticacion')).toBe('jwt-1');
    expect(localStorage.getItem('custom-auth-rol')).toBe('Administrador');
    expect(localStorage.getItem('custom-auth-name')).toBe('Ana');
    expect(localStorage.getItem('custom-auth-documento')).toBe('1001');
    expect(localStorage.getItem('custom-auth-correo')).toBe('ana@tecni.test');
    expect(document.cookie).toContain('custom-auth-rol=Administrador');
    expect(checkSession).toHaveBeenCalled();
  });

  it.each([
    ['usuario inhabilitado', () => ({ ...sesion, accesohabilitado: false }), 'Usuario inhabilitado'],
    ['sin rol', () => ({ ...sesion, rol: '' }), 'Error al iniciar sesión'],
    ['respuesta distinta de 200', new ConEstado(204, ''), 'Error al iniciar sesión'],
    ['credenciales inválidas', new ErrorApi('Clave incorrecta', 401), 'No se pudo iniciar sesión. Intenta nuevamente.'],
  ])('no deja entrar con %s', async (_caso, respuesta, mensaje) => {
    const { user } = montarLogin({ 'POST /login': respuesta });
    await ingresar(user);
    expect(await screen.findByText(mensaje)).toBeInTheDocument();
    expect(routerMock.push).not.toHaveBeenCalled();
    expect(localStorage.getItem('custom-auth-token-autenticacion')).toBeNull();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeEnabled();
  });
});

describe('formularios de plantilla (sign up / reset password)', () => {
  it('SignUpForm valida y, al registrar, refresca la sesión', async () => {
    const checkSession = vi.fn(async () => undefined);
    const { user } = renderConProveedores(<SignUpForm />, { usuario: null, contextoUsuario: { checkSession } });
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();

    await user.type(campo('First name'), 'Ana');
    await user.type(campo('Last name'), 'Pérez');
    await user.type(campo('Email address'), 'ana@tecni.test');
    await user.type(campo('Password'), 'secreta1');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(routerMock.refresh).toHaveBeenCalled());
    expect(checkSession).toHaveBeenCalled();
  });

  it('ResetPasswordForm informa que la recuperación no está implementada', async () => {
    const { user } = renderConProveedores(<ResetPasswordForm />);
    await user.click(screen.getByRole('button', { name: 'Send recovery link' }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    await user.type(campo('Email address'), 'ana@tecni.test');
    await user.click(screen.getByRole('button', { name: 'Send recovery link' }));
    expect(await screen.findByText('Restablecimiento de contraseña no implementado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send recovery link' })).toBeEnabled();
  });
});
