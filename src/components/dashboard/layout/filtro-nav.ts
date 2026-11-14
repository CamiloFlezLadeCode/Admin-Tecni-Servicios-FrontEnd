import type { NavItemConfig } from '@/types/nav';

/** Minúsculas, sin espacios en los extremos y sin tildes. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function filterNavItems(items: NavItemConfig[], normalizedQuery: string): NavItemConfig[] {
  return items
    .map((item) => {
      const title = item.title ?? '';
      const normalizedTitle = normalizeText(title);
      const children = item.items ? filterNavItems(item.items, normalizedQuery) : undefined;
      const matchesSelf = normalizedTitle.includes(normalizedQuery);
      const matchesChildren = Boolean(children && children.length);

      if (!matchesSelf && !matchesChildren) {
        return null;
      }

      if (children) {
        return { ...item, items: children };
      }

      return item;
    })
    .filter(Boolean) as NavItemConfig[];
}

/** Ítems (y subítems) cuyo título contiene el texto buscado; sin texto, todos. */
export function filtrarNavPorTexto(items: NavItemConfig[], query: string): NavItemConfig[] {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return items;
  }
  return filterNavItems(items, normalizedQuery);
}
