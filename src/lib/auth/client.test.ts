import { beforeEach, describe, expect, it, vi } from 'vitest';

import axiosInstance from '@/config/axiosConfig';
import { authClient } from '@/lib/auth/client';

const datosSesion = { nombre: 'Ana', documento: '1001', correo: 'ana@t.co', token: 'jwt-1', rol: 'Administrador' };

describe('authClient', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('signInWithPassword envía usuario/clave y guarda la sesión', async () => {
    const post = vi.spyOn(axiosInstance, 'post').mockResolvedValue({ status: 200, data: datosSesion });
    const resultado = await authClient.signInWithPassword({ email: 'ana', password: 'clave' });

    expect(post).toHaveBeenCalledWith(
      'http://api.test/login',
      { NombreUsuario: 'ana', ClaveUsuario: 'clave' },
      { withCredentials: true }
    );
    expect(resultado).toEqual(datosSesion);
    expect(localStorage.getItem('custom-auth-token-autenticacion')).toBe('jwt-1');
    expect(localStorage.getItem('custom-auth-name')).toBe('Ana');
    expect(localStorage.getItem('custom-auth-documento')).toBe('1001');
    expect(localStorage.getItem('custom-auth-correo')).toBe('ana@t.co');
    expect(localStorage.getItem('custom-auth-rol')).toBe('Administrador');
    expect(document.cookie).toContain('custom-auth-rol=Administrador');
  });

  it('signInWithPassword rechaza respuestas distintas de 200', async () => {
    vi.spyOn(axiosInstance, 'post').mockResolvedValue({ status: 202, data: datosSesion });
    expect(await authClient.signInWithPassword({ email: 'a', password: 'b' })).toEqual({ error: 'Credenciales incorrectas' });
    expect(localStorage.getItem('custom-auth-token-autenticacion')).toBeNull();
  });

  it('signInWithPassword informa el error si el backend falla', async () => {
    vi.spyOn(axiosInstance, 'post').mockRejectedValue(new Error('401'));
    expect(await authClient.signInWithPassword({ email: 'a', password: 'b' })).toEqual({ error: 'Error al iniciar sesión' });
  });

  it('getUser sin token no consulta el perfil', async () => {
    const get = vi.spyOn(axiosInstance, 'get');
    expect(await authClient.getUser()).toEqual({ data: null });
    expect(get).not.toHaveBeenCalled();
  });

  it('getUser con token arma el usuario desde /perfil', async () => {
    localStorage.setItem('custom-auth-token-autenticacion', 'jwt-1');
    const get = vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: datosSesion });
    const { data } = await authClient.getUser();
    expect(get).toHaveBeenCalledWith('http://api.test/perfil', { headers: { Authorization: 'Bearer jwt-1' } });
    expect(data).toEqual({
      id: 'USR-001',
      avatar: '/assets/avatar.png',
      fullName: 'Ana',
      email: 'ana@t.co',
      documento: '1001',
      rol: 'Administrador',
    });
  });

  it('getUser con token vencido (401/403) no registra error; otros errores sí', async () => {
    localStorage.setItem('custom-auth-token-autenticacion', 'jwt-1');
    vi.spyOn(axiosInstance, 'get').mockRejectedValue({ response: { status: 401 } });
    expect(await authClient.getUser()).toEqual({ data: null, error: 'No autenticado o sesión expirada' });
    expect(console.error).not.toHaveBeenCalled();

    vi.spyOn(axiosInstance, 'get').mockRejectedValue({ response: { status: 500 } });
    await authClient.getUser();
    expect(console.error).toHaveBeenCalled();
  });

  it('signOut avisa al servidor y limpia la sesión local, aunque el aviso falle', async () => {
    for (const fallo of [false, true]) {
      localStorage.setItem('custom-auth-token-autenticacion', 'jwt-1');
      localStorage.setItem('custom-auth-rol', 'Administrador');
      document.cookie = 'custom-auth-rol=Administrador; path=/';
      const post = vi.spyOn(axiosInstance, 'post');
      if (fallo) post.mockRejectedValue({ response: { status: 401 } });
      else post.mockResolvedValue({ status: 200 });

      expect(await authClient.signOut()).toEqual({});
      expect(post).toHaveBeenCalledWith('http://api.test/logout', {}, { withCredentials: true });
      expect(localStorage.getItem('custom-auth-token-autenticacion')).toBeNull();
      expect(localStorage.getItem('custom-auth-rol')).toBeNull();
      expect(document.cookie).not.toContain('custom-auth-rol=Administrador');
    }
  });

  it('signOut informa un error inesperado al limpiar', async () => {
    vi.spyOn(axiosInstance, 'post').mockResolvedValue({});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(await authClient.signOut()).toEqual({ error: 'Error al cerrar sesión' });
  });

  it('los flujos no implementados responden como hasta ahora', async () => {
    expect(await authClient.signUp({ firstName: '', lastName: '', email: '', password: '' })).toEqual({});
    expect(await authClient.signInWithOAuth({ provider: 'google' })).toEqual({
      error: 'Autenticación social no implementada',
    });
    expect(await authClient.resetPassword({ email: '' })).toEqual({
      error: 'Restablecimiento de contraseña no implementado',
    });
    expect(await authClient.updatePassword({ email: '' })).toEqual({
      error: 'Actualización de contraseña no implementada',
    });
  });
});
