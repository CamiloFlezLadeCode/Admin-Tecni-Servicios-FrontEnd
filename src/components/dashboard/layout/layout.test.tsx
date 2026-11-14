import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MainNav } from '@/components/dashboard/layout/main-nav';
import { MobileNav } from '@/components/dashboard/layout/mobile-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { navegacion } from '@test/mocks/next-navigation';
import { emitirDesdeServidor } from '@test/mocks/socket';
import { act, fireEvent, renderConProveedores, screen, usuarioOperativo, waitFor, within } from '@test/utils';

/**
 * El SideNav se oculta por CSS por debajo de `lg` y jsdom no evalúa media queries:
 * sus pruebas consultan también elementos ocultos.
 */
let ocultos = false;
const enlace = (nombre: string) => screen.getByRole('link', { name: nombre, hidden: ocultos });
const grupo = (nombre: string) => screen.getByRole('button', { name: nombre, hidden: ocultos });
const sinEnlace = (nombre: string) => expect(screen.queryByRole('link', { name: nombre, hidden: ocultos })).not.toBeInTheDocument();
const boton = (nombre: string) => screen.getByRole('button', { name: nombre, hidden: ocultos });
const buscador = () => screen.getByPlaceholderText('Buscar...');

afterEach(() => {
  ocultos = false;
  localStorage.clear();
  document.body.style.removeProperty('--SideNav-width');
});

describe('SideNav', () => {
  beforeEach(() => {
    ocultos = true;
  });

  it('muestra Configuraciones solo a Administrador', () => {
    const { unmount } = renderConProveedores(<SideNav />);
    expect(enlace('Configuraciones')).toHaveAttribute('href', '/dashboard/configuraciones');
    unmount();
    renderConProveedores(<SideNav />, { usuario: usuarioOperativo });
    sinEnlace('Configuraciones');
    expect(enlace('Panel')).toBeInTheDocument();
  });

  it('abre el grupo de la ruta activa y marca la página actual', () => {
    navegacion.pathname = '/dashboard/comercial/remisiones/crear-remision';
    renderConProveedores(<SideNav />);
    expect(grupo('Comercial')).toHaveAttribute('aria-expanded', 'true');
    expect(enlace('Remisiones')).toHaveAttribute('aria-current', 'page');
    expect(grupo('Gestión y control')).toHaveAttribute('aria-expanded', 'false');
    sinEnlace('Bodegas');
  });

  it('despliega y pliega grupos al hacer clic', async () => {
    const { user } = renderConProveedores(<SideNav />);
    await user.click(grupo('Gestión y control'));
    expect(enlace('Bodegas')).toHaveAttribute('href', '/dashboard/gestion-y-control/bodegas/ver-bodegas');
    await user.click(grupo('Gestión y control'));
    sinEnlace('Bodegas');
  });

  it('filtra por texto sin distinguir tildes y abre los grupos con coincidencias', async () => {
    const { user } = renderConProveedores(<SideNav />);
    fireEvent.change(buscador(), { target: { value: 'vehiculos' } });
    expect(enlace('Vehículos')).toBeInTheDocument();
    sinEnlace('Panel');
    expect(screen.queryByRole('button', { name: 'Comercial', hidden: true })).not.toBeInTheDocument();

    fireEvent.change(buscador(), { target: { value: 'inventario' } });
    // Comportamiento actual (defecto reportado): si el grupo coincide solo por su
    // título, `filterNavItems` lo devuelve con `items: []` y no muestra sus subítems.
    expect(grupo('Inventario')).not.toHaveAttribute('aria-expanded');
    expect(within(grupo('Inventario').closest('li')!).queryAllByRole('link', { hidden: true })).toHaveLength(0);

    fireEvent.change(buscador(), { target: { value: 'zzz' } });
    // Solo queda el enlace del logo.
    expect(screen.queryAllByRole('link', { hidden: true })).toHaveLength(1);
  });

  it('se contrae, recuerda la preferencia y muestra los subítems en un menú flotante', async () => {
    const { user } = renderConProveedores(<SideNav />);
    fireEvent.change(buscador(), { target: { value: 'bod' } });
    await user.click(boton('Contraer menú lateral'));
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true');
    expect(document.body.style.getPropertyValue('--SideNav-width')).toBe('80px');
    expect(screen.queryByPlaceholderText('Buscar...')).not.toBeInTheDocument();

    // Al contraer se limpia la búsqueda: vuelven todos los grupos.
    const comercial = screen.getAllByRole('button', { hidden: true }).find((b) => b.getAttribute('aria-expanded') !== null && b.closest('li'))!;
    await user.click(comercial);
    expect(comercial).toHaveAttribute('aria-expanded', 'true');
    const flotante = await screen.findByText('Opciones');
    const menu = flotante.closest('.MuiPopover-paper') as HTMLElement;
    expect(within(menu).getByText('Comercial')).toBeInTheDocument();
    await user.click(within(menu).getByRole('link', { name: 'Remisiones' }));
    await waitFor(() => expect(screen.queryByText('Opciones')).not.toBeInTheDocument());

    await user.click(comercial);
    await screen.findByText('Opciones');
    // Cerrar al hacer clic fuera (fondo invisible del Popover).
    fireEvent.click(document.querySelector('.MuiPopover-root .MuiBackdrop-root')!);
    await waitFor(() => expect(screen.queryByText('Opciones')).not.toBeInTheDocument());
    await user.unhover(comercial);

    await user.click(boton('Expandir menú lateral'));
    expect(localStorage.getItem('sidebar-collapsed')).toBe('false');
    expect(document.body.style.getPropertyValue('--SideNav-width')).toBe('280px');
  });

  it('arranca contraído si así se guardó y marca el grupo de la ruta activa', () => {
    localStorage.setItem('sidebar-collapsed', 'true');
    navegacion.pathname = '/dashboard/inventario/equipos/stock';
    renderConProveedores(<SideNav />);
    expect(boton('Expandir menú lateral')).toBeInTheDocument();
    expect(document.querySelectorAll('[aria-current="page"]').length).toBeGreaterThan(0);
  });
});

describe('MobileNav', () => {
  it('filtra, despliega grupos y se cierra al navegar o con el botón', async () => {
    const onClose = vi.fn();
    const { user } = renderConProveedores(<MobileNav open onClose={onClose} />, { usuario: usuarioOperativo });
    sinEnlace('Configuraciones');
    await user.click(grupo('Comercial'));
    expect(grupo('Comercial')).toHaveAttribute('aria-expanded', 'true');
    await user.click(enlace('Devoluciones'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.click(grupo('Comercial'));
    expect(screen.queryByRole('link', { name: 'Devoluciones' })).not.toBeInTheDocument();

    await user.type(buscador(), 'repuest');
    expect(grupo('Gestión y control')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('link', { name: 'Repuestos' })).toHaveLength(2);
    await user.clear(buscador());
    await user.type(buscador(), 'zzz');
    sinEnlace('Remisiones');
    sinEnlace('Panel');

    await user.click(screen.getByRole('button', { name: 'Cerrar menú' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('abre el grupo activo y muestra Configuraciones al Administrador', () => {
    navegacion.pathname = '/dashboard/gestion-y-control/bodegas/ver-bodegas';
    renderConProveedores(<MobileNav open onClose={vi.fn()} />);
    expect(enlace('Bodegas')).toHaveAttribute('aria-current', 'page');
    expect(enlace('Configuraciones')).toBeInTheDocument();
  });
});

describe('MainNav', () => {
  const rutas = {
    'GET /mostrar-avatar/*': () => new Blob(['img'], { type: 'image/png' }),
    'POST /crear-backup': () => ({ mensaje: 'ok' }),
  };

  it('saluda, carga el avatar y abre el menú de usuario', async () => {
    const api = simularApi(rutas);
    const { user } = renderConProveedores(<MainNav />);
    expect(screen.getByText('Ana Administradora')).toBeInTheDocument();
    await waitFor(() => expect(api.llamadasA('/mostrar-avatar/1001')).toHaveLength(1));
    await waitFor(() => expect(document.querySelector('img[src^="blob:"]')).not.toBeNull());
    await user.click(document.querySelector('img[src^="blob:"]')!);
    expect(await screen.findByRole('menuitem', { name: 'Perfil' })).toHaveAttribute('href', '/dashboard/account');
  });

  it('si el avatar no carga usa la imagen por defecto y lo recarga con avatar-guardado', async () => {
    const api = simularApi({ ...rutas, 'GET /mostrar-avatar/*': new ErrorApi('no hay', 404) });
    renderConProveedores(<MainNav />);
    await waitFor(() => expect(api.llamadasA('/mostrar-avatar/1001')).toHaveLength(1));
    expect(document.querySelector('img[src^="blob:"]')).toBeNull();
    api.definir(rutas);
    act(() => emitirDesdeServidor('otro', {}));
    act(() => emitirDesdeServidor('avatar-guardado', {}));
    await waitFor(() => expect(document.querySelector('img[src^="blob:"]')).not.toBeNull());
    expect(api.llamadasA('/mostrar-avatar/1001')).toHaveLength(2);
  });

  it('abre el menú móvil con el botón de hamburguesa', async () => {
    simularApi(rutas);
    const { user } = renderConProveedores(<MainNav />);
    await user.click(screen.getAllByRole('button')[0]);
    expect(await screen.findByRole('button', { name: 'Cerrar menú' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cerrar menú' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Cerrar menú' })).not.toBeInTheDocument());
  });

  it('guarda el backup y avisa', async () => {
    const api = simularApi(rutas);
    const { user } = renderConProveedores(<MainNav />);
    await user.click(screen.getByRole('button', { name: 'Guardar BackUp' }));
    expect(await screen.findByText('Guardando Backup. Por favor espere...')).toBeInTheDocument();
    expect(await screen.findByText('BackUp guardado correctamente', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(api.llamadasA('/crear-backup')).toHaveLength(1);
  });

  it('informa si el backup falla', async () => {
    simularApi({ ...rutas, 'POST /crear-backup': new ErrorApi('sin espacio', 500) });
    const { user } = renderConProveedores(<MainNav />);
    await user.click(screen.getAllByRole('button', { name: /Guardar BackUp/ }).at(-1)!);
    expect(await screen.findByText(/^Error al guardar el Backup:/)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Guardando Backup. Por favor espere...')).not.toBeVisible());
  });
});
