import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { authClient } from '@/lib/auth/client';
import { UserConsumer, UserProvider } from '@/contexts/user-context';
import { AuthGuard } from '@/components/auth/auth-guard';
import { GuestGuard } from '@/components/auth/guest-guard';
import { renderConProveedores } from '../../test/utils';
import { routerMock } from '../../test/mocks/next-navigation';

function MostrarEstado() {
  return (
    <UserConsumer>
      {(valor) => (
        <span>
          {valor?.isLoading ? 'cargando' : `usuario:${(valor?.user?.fullName as string) ?? 'ninguno'} error:${valor?.error ?? 'no'}`}
        </span>
      )}
    </UserConsumer>
  );
}

describe('UserProvider', () => {
  it('carga la sesión al montar', async () => {
    vi.spyOn(authClient, 'getUser').mockResolvedValue({ data: { id: '1', fullName: 'Ana' } });
    render(
      <UserProvider>
        <MostrarEstado />
      </UserProvider>
    );
    expect(screen.getByText('cargando')).toBeInTheDocument();
    expect(await screen.findByText('usuario:Ana error:no')).toBeInTheDocument();
  });

  it('sin sesión o con error de sesión deja user en null', async () => {
    vi.spyOn(authClient, 'getUser').mockResolvedValue({ data: null, error: 'expirada' });
    render(
      <UserProvider>
        <MostrarEstado />
      </UserProvider>
    );
    expect(await screen.findByText('usuario:ninguno error:no')).toBeInTheDocument();
  });

  it('un fallo inesperado deja el error visible', async () => {
    vi.spyOn(authClient, 'getUser').mockRejectedValue(new Error('boom'));
    render(
      <UserProvider>
        <MostrarEstado />
      </UserProvider>
    );
    expect(await screen.findByText('usuario:ninguno error:Error inesperado')).toBeInTheDocument();
  });
});

describe('AuthGuard', () => {
  it('no muestra nada mientras carga la sesión', () => {
    renderConProveedores(<AuthGuard>privado</AuthGuard>, { contextoUsuario: { isLoading: true } });
    expect(screen.queryByText('privado')).not.toBeInTheDocument();
  });

  it('sin usuario redirige al inicio de sesión', async () => {
    renderConProveedores(<AuthGuard>privado</AuthGuard>, { usuario: null });
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/auth/sign-in'));
    expect(screen.queryByText('privado')).not.toBeInTheDocument();
  });

  it('con usuario muestra el contenido', async () => {
    renderConProveedores(<AuthGuard>privado</AuthGuard>);
    expect(await screen.findByText('privado')).toBeInTheDocument();
  });

  it('con error de sesión muestra el error', async () => {
    renderConProveedores(<AuthGuard>privado</AuthGuard>, { contextoUsuario: { error: 'Sesión inválida' } });
    expect(await screen.findByText('Sesión inválida')).toBeInTheDocument();
  });
});

describe('GuestGuard', () => {
  it('con sesión iniciada redirige al panel', async () => {
    renderConProveedores(<GuestGuard>login</GuestGuard>);
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/dashboard'));
  });

  it('sin sesión muestra el formulario', async () => {
    renderConProveedores(<GuestGuard>login</GuestGuard>, { usuario: null });
    expect(await screen.findByText('login')).toBeInTheDocument();
  });

  it('mientras carga no muestra nada y con error lo muestra', async () => {
    const { unmount } = renderConProveedores(<GuestGuard>login</GuestGuard>, { contextoUsuario: { isLoading: true } });
    expect(screen.queryByText('login')).not.toBeInTheDocument();
    unmount();
    renderConProveedores(<GuestGuard>login</GuestGuard>, { contextoUsuario: { error: 'Falla' } });
    expect(await screen.findByText('Falla')).toBeInTheDocument();
  });
});
