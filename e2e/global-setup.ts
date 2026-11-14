import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * El `next dev` de las pruebas (en `.next-e2e`) reescribe `next-env.d.ts` para
 * apuntar a su carpeta y puede crear `AGENTS.md`. Al terminar se deshace eso
 * para no alterar el `pnpm dev` normal ni ensuciar el repositorio.
 *
 * Playwright arranca el servidor antes de este setup, así que no se guarda una
 * copia "original": se revierte exactamente lo que cambia Next.
 */
export default function globalSetup(): () => void {
  const raiz = path.resolve(import.meta.dirname, '..');

  return () => {
    const nextEnv = path.join(raiz, 'next-env.d.ts');
    if (existsSync(nextEnv)) {
      const contenido = readFileSync(nextEnv, 'utf8');
      const restaurado = contenido.replaceAll('./.next-e2e/dev/types/', './.next/types/').replaceAll('./.next-e2e/types/', './.next/types/');
      if (restaurado !== contenido) writeFileSync(nextEnv, restaurado);
    }

    // Solo se borra si es exactamente el bloque que genera Next (no un AGENTS.md propio).
    const agentes = path.join(raiz, 'AGENTS.md');
    if (existsSync(agentes)) {
      const texto = readFileSync(agentes, 'utf8').trim();
      if (texto.startsWith('<!-- BEGIN:nextjs-agent-rules -->') && texto.endsWith('<!-- END:nextjs-agent-rules -->')) {
        rmSync(agentes);
      }
    }
  };
}
