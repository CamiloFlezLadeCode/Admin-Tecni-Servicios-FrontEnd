import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { Municipios } from '@/components/dashboard/municipios/Municipios';
import { ErrorApi, simularApi } from '@test/mocks/api';
import { fireEvent, renderConProveedores, screen, waitFor } from '@test/utils';

const respuesta = { page: 1, limit: 10, totalItems: 30, totalPages: 3, data: [{ IdMunicipio: 1, Nombre: 'Cali', Codigo: '001', CodigoDepartamento: '76' }] };

describe('Municipios', () => {
  it('pagina en el servidor con page/limit/search', async () => {
    const api = simularApi({ 'GET /listar-municipios': () => respuesta });
    const { user } = renderConProveedores(<Municipios />);
    expect(await screen.findByText('Cali')).toBeInTheDocument();
    expect(api.llamadasA('/listar-municipios')[0].params).toEqual({ page: 1, limit: 10, search: '' });
    expect(screen.getAllByText(/1-10 de 30/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /siguiente|next/i }));
    await waitFor(() => expect(api.llamadasA('/listar-municipios').at(-1)!.params).toEqual({ page: 2, limit: 10, search: '' }));

    fireEvent.change(screen.getByPlaceholderText('Buscar municipios'), { target: { value: 'cal' } });
    await waitFor(() => expect(api.llamadasA('/listar-municipios').at(-1)!.params).toEqual({ page: 1, limit: 10, search: 'cal' }));
  });

  it('acepta respuestas sin total y avisa si falla', async () => {
    simularApi({ 'GET /listar-municipios': () => ({ Data: [{ IdMunicipio: 2, Nombre: 'Buga' }] }) });
    const { unmount } = renderConProveedores(<Municipios />);
    expect(await screen.findByText('Buga')).toBeInTheDocument();
    unmount();
    simularApi({ 'GET /listar-municipios': new ErrorApi('x') });
    renderConProveedores(<Municipios />);
    expect(await screen.findByText(/Error al cargar municipios/)).toBeInTheDocument();
  });
});
