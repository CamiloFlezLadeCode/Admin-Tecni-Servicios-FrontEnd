import { expect, test } from '@playwright/test';

import { iniciarSesionSimulada, json, simularApi, USUARIO_PRUEBA } from './utilidades/api';

test.describe('Inicio de sesión', () => {
  test('sin sesión, el dashboard redirige al login', async ({ page }) => {
    await simularApi(page);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('exige la contraseña antes de llamar a la API', async ({ page }) => {
    const api = await simularApi(page);
    await page.goto('/auth/sign-in');
    await page.locator('input[name="email"]').fill('admin');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Contraseña es requerida')).toBeVisible();
    expect(api.peticiones.filter((p) => p.ruta === '/login')).toHaveLength(0);
  });

  test('credenciales rechazadas muestran el error y no guardan sesión', async ({ page }) => {
    const api = await simularApi(page);
    api.en('/login', (ruta) => json(ruta, { mensaje: 'Credenciales inválidas' }, 401));
    await page.goto('/auth/sign-in');
    await page.locator('input[name="email"]').fill('admin');
    await page.locator('input[name="password"]').fill('incorrecta');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByRole('alert').filter({ hasText: 'No se pudo iniciar sesión' })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    expect(await page.evaluate(() => localStorage.getItem('custom-auth-token-autenticacion'))).toBeNull();
  });

  test('usuario inhabilitado no entra', async ({ page }) => {
    const api = await simularApi(page);
    api.en('/login', (ruta) => json(ruta, { ...USUARIO_PRUEBA, token: 't', accesohabilitado: false }));
    await page.goto('/auth/sign-in');
    await page.locator('input[name="email"]').fill('admin');
    await page.locator('input[name="password"]').fill('clave');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByRole('alert').filter({ hasText: 'Usuario inhabilitado' })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test('login correcto: envía credenciales cifradas, guarda la sesión y entra al dashboard', async ({ page }) => {
    const api = await simularApi(page);
    api.en('/login', (ruta) => json(ruta, { ...USUARIO_PRUEBA, token: 'token-e2e', accesohabilitado: true }));
    api.en('/perfil', (ruta) => json(ruta, USUARIO_PRUEBA));

    await page.goto('/auth/sign-in');
    await page.locator('input[name="email"]').fill('admin');
    await page.locator('input[name="password"]').fill('clave-secreta');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/dashboard/);
    const login = api.peticiones.find((p) => p.ruta === '/login');
    const cuerpo = login?.cuerpo as { data?: unknown; key?: unknown };
    expect(cuerpo?.data).toBeTruthy();
    expect(cuerpo?.key).toBeTruthy();
    // La contraseña no viaja en claro
    expect(JSON.stringify(cuerpo)).not.toContain('clave-secreta');
    expect(await page.evaluate(() => localStorage.getItem('custom-auth-token-autenticacion'))).toBe('token-e2e');
  });

  test('con sesión iniciada, el login redirige al dashboard', async ({ page }) => {
    const api = await simularApi(page);
    await iniciarSesionSimulada(page, api);
    await page.goto('/auth/sign-in');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Permisos por rol', () => {
  test('configuraciones solo para Administrador', async ({ page }) => {
    const api = await simularApi(page);
    await iniciarSesionSimulada(page, api, 'Mecánico');
    await page.goto('/dashboard/configuraciones');
    await expect(page).toHaveURL(/\/errors\/unauthorized/);
  });
});
