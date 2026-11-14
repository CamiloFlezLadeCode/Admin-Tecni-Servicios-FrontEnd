import { describe, expect, it } from 'vitest';

import { FiltrarOpcionesActivas } from '@/utils/filtrarOpcionesActivas';
import { getEstadoColor } from '@/utils/getEstadoColor';
import { isEstado } from '@/utils/isEstado';

describe('FiltrarOpcionesActivas', () => {
  const opciones = [
    { value: 0, label: 'Sin seleccionar' },
    { value: 1, label: 'Activo', Activo: true },
    { value: 2, label: 'Inactivo', Activo: false },
    { value: '3', label: 'Inactivo seleccionado', Activo: false },
  ];

  it('deja solo las opciones activas y las que no tienen el campo Activo', () => {
    expect(FiltrarOpcionesActivas(opciones).map((o) => o.value)).toEqual([0, 1]);
  });

  it('conserva la opción inactiva ya seleccionada (comparando como texto)', () => {
    expect(FiltrarOpcionesActivas(opciones, 3).map((o) => o.value)).toEqual([0, 1, '3']);
    expect(FiltrarOpcionesActivas(opciones, '2').map((o) => o.value)).toEqual([0, 1, 2]);
  });
});

describe('estados', () => {
  it('isEstado reconoce solo los estados conocidos', () => {
    expect(isEstado('Activo')).toBe(true);
    expect(isEstado('Cualquier cosa')).toBe(false);
  });

  it.each([
    ['Activo', 'success'],
    ['Pendiente', 'warning'],
    ['Anulado', 'error'],
    ['Facturado', 'info'],
    ['Desconocido', 'default'],
  ])('getEstadoColor(%s) = %s', (estado, color) => {
    expect(getEstadoColor(estado)).toBe(color);
  });
});
