import * as React from 'react';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { render, type RenderOptions, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { User } from '@/types/user';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { UserContext, type UserContextValue } from '@/contexts/user-context';
import { createTheme } from '@/styles/theme/create-theme';

export const usuarioAdministrador: User = {
  id: 'USR-001',
  fullName: 'Ana Administradora',
  email: 'admin@tecni.test',
  documento: '1001',
  rol: 'Administrador',
};

export const usuarioOperativo: User = { ...usuarioAdministrador, fullName: 'Oscar Operativo', documento: '2002', rol: 'Operativo' };

interface OpcionesRender extends Omit<RenderOptions, 'wrapper'> {
  /** `null` = sin sesión. Por defecto, una persona con rol Administrador. */
  usuario?: User | null;
  contextoUsuario?: Partial<UserContextValue>;
}

const tema = createTheme();

export function renderConProveedores(ui: React.ReactElement, opciones: OpcionesRender = {}) {
  const { usuario = usuarioAdministrador, contextoUsuario, ...resto } = opciones;
  const valor: UserContextValue = {
    user: usuario,
    error: null,
    isLoading: false,
    checkSession: async () => undefined,
    ...contextoUsuario,
  };

  function Proveedores({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
      <LocalizationProvider>
        <UserContext.Provider value={valor}>
          <CssVarsProvider theme={tema}>{children}</CssVarsProvider>
        </UserContext.Provider>
      </LocalizationProvider>
    );
  }

  return { user: userEvent.setup(), ...render(ui, { wrapper: Proveedores, ...resto }) };
}

/**
 * Encuentra el combo (Select/Autocomplete de MUI) por el texto de su `<label>`.
 * Se busca por la etiqueta y no por el nombre accesible porque varios selects arman
 * su `labelId` con el texto (con espacios) y el nombre accesible queda incompleto.
 */
export function comboPorEtiqueta(etiqueta: string | RegExp, indice = 0): HTMLElement {
  const etiquetas = screen.getAllByText(etiqueta, { selector: 'label' });
  const control = etiquetas[indice]?.closest('.MuiFormControl-root, .MuiAutocomplete-root');
  const combo = control?.querySelector<HTMLElement>('[role="combobox"]');
  if (!combo) throw new Error(`No se encontró el combo con etiqueta ${String(etiqueta)}`);
  return combo;
}

/** Abre un Select de MUI por su etiqueta y elige la opción con el texto dado. */
export async function elegirOpcion(
  usuario: ReturnType<typeof userEvent.setup>,
  etiqueta: string | RegExp,
  opcion: string | RegExp,
  indice = 0
): Promise<void> {
  const combo = comboPorEtiqueta(etiqueta, indice);
  await usuario.click(combo);
  const lista = await screen.findByRole('listbox');
  await usuario.click(within(lista).getByRole('option', { name: opcion }));
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
}

/** Respuesta paginada mínima, como la devuelve el backend con `pagina`. */
export function paginado<T>(Datos: T[], extras: Record<string, unknown> = {}) {
  return { Datos, Total: Datos.length, Pagina: 1, Limite: 10, TotalPaginas: 1, ...extras };
}

/** Error con la forma que lanza axios cuando el backend responde con `{ error }`. */
export function errorApi(mensaje: string, status = 400) {
  return Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status, data: { error: mensaje } },
  });
}

export * from '@testing-library/react';
export { userEvent };
