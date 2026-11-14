import { describe, expect, it } from 'vitest';

import { esCorreoValido } from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';

/** Expresión original que `esCorreoValido` reemplaza (Sonar la marca por retroceso costoso). */
const original = (valor: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor as string);

describe('esCorreoValido', () => {
  it.each([
    'ana@tecni.test', 'a@b.c', 'a@b..c', 'a@.b.c', 'a@b.c.', 'a@bc.', 'a@.bc', '@b.c', 'a@b', 'a@@b.c',
    'a b@c.d', 'a@b.c ', '', 'a@b.c@d.e', 'x.y@z.co', 'a@..', 'a@x..', 'a@.', 'a@b\tc.d',
  ])('coincide con la expresión original para %j', (valor) => {
    expect(esCorreoValido(valor)).toBe(original(valor));
  });

  it('coincide con la expresión original en cadenas aleatorias', () => {
    const alfabeto = ['a', 'b', '.', '@', ' ', '1'];
    let semilla = 7;
    const azar = () => (semilla = (semilla * 16807) % 2147483647) % 1000;
    for (let n = 0; n < 3000; n++) {
      const largo = azar() % 9;
      let valor = '';
      for (let i = 0; i < largo; i++) valor += alfabeto[azar() % alfabeto.length];
      expect(esCorreoValido(valor), valor).toBe(original(valor));
    }
  });

  it('rechaza lo que no es texto', () => {
    expect(esCorreoValido(undefined)).toBe(false);
    expect(esCorreoValido(null)).toBe(false);
    expect(esCorreoValido(12)).toBe(false);
  });
});
