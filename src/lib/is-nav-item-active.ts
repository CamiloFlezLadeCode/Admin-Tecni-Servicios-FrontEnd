import type { NavItemConfig } from '@/types/nav';

export function isNavItemActive({
  disabled,
  external,
  href,
  matcher,
  pathname,
}: Pick<NavItemConfig, 'disabled' | 'external' | 'href' | 'matcher'> & { pathname: string }): boolean {
  if (disabled || !href || external) {
    return false;
  }

  if (matcher) {
    if (matcher.type === 'startsWith') {
      // Comparación por SEGMENTOS de ruta, no por prefijo de texto.
      //
      // Un `pathname.startsWith(base)` a secas daría falsos positivos entre
      // rutas hermanas que comparten prefijo: con base '/dashboard/inventario/equipos'
      // también se marcaría '/dashboard/inventario/equipos-usados', que es otro
      // módulo. Exigiendo la barra siguiente sólo entran la propia ruta y sus
      // descendientes reales.
      const base = matcher.href.endsWith('/') ? matcher.href.slice(0, -1) : matcher.href;
      return pathname === base || pathname.startsWith(`${base}/`);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }

  return pathname === href;
}
