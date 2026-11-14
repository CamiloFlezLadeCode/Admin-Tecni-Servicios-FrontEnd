import { expect, test } from '@playwright/test';

import { iniciarSesionSimulada, json, simularApi } from './utilidades/api';

const BODEGAS = Array.from({ length: 12 }, (_, i) => ({
  IdBodega: i + 1,
  NombreBodega: `Bodega ${i + 1}`,
  DescripcionBodega: `Descripción ${i + 1}`,
  UsuarioCreacion: 'Usuario Pruebas',
  FechaCreacion: '01/01/2026',
  EstadoBodega: i % 2 === 0 ? 'Activo' : 'Inactivo',
}));

test.describe('Listado de bodegas (paginado en servidor)', () => {
  test('muestra la página pedida, busca en el servidor y conserva el estado', async ({ page }) => {
    const api = await simularApi(page);
    await iniciarSesionSimulada(page, api);
    api.en('/ver-bodegas', (ruta, _peticion, url) => {
      const pagina = Number(url.searchParams.get('pagina') ?? 1);
      const limite = Number(url.searchParams.get('limite') ?? 10);
      const busqueda = (url.searchParams.get('busqueda') ?? '').toLowerCase();
      const filtradas = BODEGAS.filter((b) => b.NombreBodega.toLowerCase().includes(busqueda));
      return json(ruta, {
        Datos: filtradas.slice((pagina - 1) * limite, pagina * limite),
        Total: filtradas.length,
        Pagina: pagina,
        Limite: limite,
        TotalPaginas: Math.max(1, Math.ceil(filtradas.length / limite)),
      });
    });

    await page.goto('/dashboard/gestion-y-control/bodegas/ver-bodegas');

    await expect(page.getByText('Bodega 1', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Activo', { exact: true }).first()).toBeVisible();

    // Siempre se pide en modo paginado (con `pagina`)
    const primera = api.peticiones.find((p) => p.ruta === '/ver-bodegas');
    expect(primera?.params.get('pagina')).toBe('1');

    // La búsqueda se resuelve en el servidor
    await page.getByPlaceholder('Buscar bodegas...').fill('Bodega 12');
    await expect
      .poll(() => api.peticiones.some((p) => p.ruta === '/ver-bodegas' && p.params.get('busqueda') === 'Bodega 12'))
      .toBe(true);
    await expect(page.getByText('Bodega 12', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Bodega 3', { exact: true })).toHaveCount(0);
  });

  test('sin resultados muestra el mensaje vacío', async ({ page }) => {
    const api = await simularApi(page);
    await iniciarSesionSimulada(page, api);
    api.en('/ver-bodegas', (ruta) => json(ruta, { Datos: [], Total: 0, Pagina: 1, Limite: 10, TotalPaginas: 1 }));

    await page.goto('/dashboard/gestion-y-control/bodegas/ver-bodegas');
    await expect(page.getByText('No se encontraron bodegas').first()).toBeVisible();
  });
});
