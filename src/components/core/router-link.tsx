'use client';

/**
 * `next/link` re-exportado desde un módulo cliente.
 *
 * Permite usarlo como `component` de MUI (`<Button component={RouterLink} href=…>`)
 * dentro de Server Components: pasar `next/link` directamente como prop falla con
 * "Functions cannot be passed directly to Client Components", mientras que una
 * referencia a un módulo `'use client'` sí es serializable.
 */
export { default as RouterLink } from 'next/link';
