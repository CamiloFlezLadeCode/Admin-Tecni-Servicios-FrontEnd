import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { FormularioCrearHojaDeVidaEquipo } from '@/components/dashboard/hoja-de-vida-equipos/crear/FormularioCrearHojaDeVidaEquipo';
import { NavBarHojaDeVidaEquipos } from '@/components/dashboard/hoja-de-vida-equipos/NavBarHojaDeVidaDeEquipos';
import { TablaVisualizarHojasDeVidaEquipos } from '@/components/dashboard/hoja-de-vida-equipos/ver/TablaVisualizarHojasDeVidaEquipos';
import { elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

/**
 * Módulo maqueta: oculto del menú lateral, con opciones fijas y sin backend.
 * Estas pruebas fijan su comportamiento actual (validación local y limpieza).
 */
const camposTexto = [
  'Dirección',
  'Nombre del equipo',
  'Código',
  'Selección',
  'Modelo',
  'Serie',
  'Obra',
  'Fabricante',
  'Marca',
  'Voltaje',
  'Tipo de control',
  'Agua',
  'Consumo',
  'Tipo de operación',
  'Aire',
  'Potencia',
  'Combustible',
  'Descripción de la actividad',
  'Repuestos',
  'Observaciones',
  'Responsable',
];

describe('FormularioCrearHojaDeVidaEquipo', () => {
  it('lista los obligatorios que faltan', async () => {
    const { user } = renderConProveedores(<FormularioCrearHojaDeVidaEquipo />);
    await user.click(screen.getByRole('button', { name: 'Crear hoja de vida' }));
    const alerta = await screen.findByRole('alert');
    for (const mensaje of [
      'La fecha es obligatoria',
      'La empresa es obligatoria',
      'El NIT es obligatorio',
      'El teléfono es obligatorio y debe ser un número válido',
    ]) {
      expect(within(alerta).getByText(mensaje)).toBeInTheDocument();
    }
    await user.click(within(alerta).getByRole('button'));
    await waitFor(() => expect(screen.queryByText('La fecha es obligatoria')).not.toBeInTheDocument());
  });

  it('la empresa sugiere el NIT y al crear limpia el formulario', async () => {
    const { user } = renderConProveedores(<FormularioCrearHojaDeVidaEquipo />);
    const nit = screen.getByLabelText('Nit');
    await elegirOpcion(user, 'Empresa', 'Empresa/Cliente #2');
    expect(nit).toHaveValue('EMPRESAS #2');
    await elegirOpcion(user, 'Empresa', 'Cinnamom Overdressed Ceere Software SAS');
    expect(nit).toHaveValue('NADA');
    await elegirOpcion(user, 'Empresa', 'Empresa/Cliente #1');
    expect(nit).toHaveValue('EMPRESA #1');
    fireEvent.change(nit, { target: { value: '900-1' } });

    fireEvent.change(screen.getAllByLabelText('Fecha')[0], { target: { value: '2026-11-14' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '3001234567' } });
    for (const etiqueta of camposTexto) {
      fireEvent.change(screen.getAllByLabelText(etiqueta)[0], { target: { value: `v ${etiqueta}` } });
    }
    expect(screen.getAllByLabelText('Marca')[0]).toHaveValue('v Marca');

    await user.click(screen.getByRole('button', { name: 'Crear hoja de vida' }));
    expect(await screen.findByText('Hoja de vida creada exitosamente')).toBeInTheDocument();
    expect(nit).toHaveValue('');
    expect(screen.getAllByLabelText('Marca')[0]).toHaveValue('');
    await user.click(within(screen.getByRole('alert')).getByRole('button'));
    await waitFor(() => expect(screen.queryByText('Hoja de vida creada exitosamente')).not.toBeInTheDocument());
  });
});

describe('Hoja de vida: tabla y navegación', () => {
  it('muestra la tabla de ejemplo y las pestañas del módulo', () => {
    renderConProveedores(
      <>
        <NavBarHojaDeVidaEquipos />
        <TablaVisualizarHojasDeVidaEquipos />
      </>
    );
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/dashboard/hoja-de-vida-equipos/ver-hojas-de-vida-equipos',
      '/dashboard/hoja-de-vida-equipos/crear-hoja-de-vida-equipo',
    ]);
  });
});
