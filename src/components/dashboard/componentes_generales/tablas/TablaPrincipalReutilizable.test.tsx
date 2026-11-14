import * as React from 'react';
import { Chip } from '@mui/material';
import { describe, expect, it, vi } from 'vitest';

import {
  type ActionDefinition,
  type ColumnDefinition,
  DataTable,
} from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { renderConProveedores, screen, usuarioOperativo, within } from '@test/utils';

type Fila = { id: number; Nombre: string; Estado: string };

const filas: Fila[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  Nombre: `Equipo ${i + 1}`,
  Estado: i % 2 === 0 ? 'Activo' : 'Inactivo',
}));

const columnas: ColumnDefinition<Fila>[] = [
  { key: 'id', header: 'Id' },
  { key: 'Nombre', header: 'Nombre', align: 'center' },
  { key: 'Estado', header: 'Estado', render: (f) => <Chip label={f.Estado} /> },
  { key: 'Oculta', header: 'Oculta', hidden: true },
];

const VISTAS = [undefined, 1] as const;

function filasDelCuerpo() {
  const [, cuerpo] = screen.getAllByRole('rowgroup');
  return within(cuerpo).getAllByRole('row');
}

describe.each(VISTAS)('DataTable (vista=%s)', (vista) => {
  function montar(props: Partial<React.ComponentProps<typeof DataTable<Fila>>> = {}, usuario?: typeof usuarioOperativo) {
    return renderConProveedores(
      <DataTable<Fila> data={filas} columns={columnas} placeHolderBuscador="Buscar equipos..." vista={vista} {...props} />,
      usuario ? { usuario } : {}
    );
  }

  it('pinta encabezados visibles y pagina en el cliente de a 10', () => {
    montar();
    expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Id', 'Nombre', 'Estado']);
    expect(filasDelCuerpo()).toHaveLength(10);
    expect(screen.getByText('Mostrando 1-10 de 12 registros')).toBeInTheDocument();
    expect(screen.getByText('1-10 de 12')).toBeInTheDocument();
  });

  it('cambia de página y de filas por página', async () => {
    const { user } = montar();
    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(filasDelCuerpo()).toHaveLength(2);
    expect(screen.getByText('Mostrando 11-12 de 12 registros')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: /Filas por página/ }));
    await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: '5' }));
    expect(filasDelCuerpo()).toHaveLength(5);
    expect(screen.getByText('Mostrando 1-5 de 12 registros')).toBeInTheDocument();
  });

  it('filtra en el cliente por cualquier columna sin distinguir mayúsculas', () => {
    montar({ searchTerm: 'equipo 1', onSearchChange: vi.fn() });
    // Equipo 1, 10, 11, 12
    expect(filasDelCuerpo()).toHaveLength(4);
  });

  it('el buscador notifica lo escrito y la X lo limpia', async () => {
    const onSearchChange = vi.fn();
    const { user, rerender } = montar({ onSearchChange });
    await user.type(screen.getByPlaceholderText('Buscar equipos...'), 'a');
    expect(onSearchChange).toHaveBeenCalledWith('a');
    rerender(
      <DataTable<Fila> data={filas} columns={columnas} placeHolderBuscador="Buscar equipos..." vista={vista} searchTerm="zzz" onSearchChange={onSearchChange} />
    );
    expect(screen.getByText('No se encontraron registros')).toBeInTheDocument();
    const x = screen.getByPlaceholderText('Buscar equipos...').parentElement!.querySelector('button svg')!;
    await user.click(x);
    expect(onSearchChange).toHaveBeenLastCalledWith('');
  });

  it('muestra esqueletos al cargar, el error y el mensaje vacío personalizado', () => {
    const { rerender } = montar({ loading: true, defaultRowsPerPage: 5 });
    expect(filasDelCuerpo()).toHaveLength(5);
    expect(screen.queryByText(/Mostrando/)).not.toBeInTheDocument();

    rerender(<DataTable<Fila> data={filas} columns={columnas} placeHolderBuscador="" vista={vista} error="Falló la consulta" />);
    expect(screen.getByText('Falló la consulta')).toBeInTheDocument();

    rerender(<DataTable<Fila> data={[]} columns={columnas} placeHolderBuscador="" vista={vista} emptyMessage="Sin bodegas" />);
    expect(screen.getByText('Sin bodegas')).toBeInTheDocument();
  });

  it('el botón Actualizar llama a onRefresh', async () => {
    const onRefresh = vi.fn();
    const { user } = montar({ onRefresh, customFilters: <span>filtro extra</span> });
    expect(screen.getByText('filtro extra')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Actualizar datos' }));
    expect(onRefresh).toHaveBeenCalled();
  });

  describe('acciones por fila', () => {
    const onEditar = vi.fn();
    const acciones: ActionDefinition<Fila>[] = [
      { tooltip: 'Editar', icon: <span>editar</span>, onClick: onEditar, hidden: (f) => f.Estado === 'Inactivo' },
      { tooltip: 'Ver', render: (f) => <span>ver {f.id}</span> },
      { tooltip: 'Sin color', icon: <span>otro</span> },
    ];

    it('solo el rol Administrador ve la columna de acciones', () => {
      const { unmount } = montar({ actions: acciones, loading: true });
      expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument();
      unmount();
      montar({ actions: acciones }, usuarioOperativo);
      expect(screen.queryByRole('columnheader', { name: 'Acciones' })).not.toBeInTheDocument();
      expect(screen.queryByText('editar')).not.toBeInTheDocument();
    });

    it('oculta acciones según la fila, ejecuta onClick y pinta las acciones con render', async () => {
      const { user } = montar({ actions: acciones, pagination: false, showSummary: false });
      expect(filasDelCuerpo()).toHaveLength(12);
      expect(screen.getAllByText('editar')).toHaveLength(6);
      expect(screen.getByText('ver 2')).toBeInTheDocument();
      await user.click(screen.getAllByText('editar')[0]);
      expect(onEditar).toHaveBeenCalledWith(filas[0]);
      await user.click(screen.getAllByText('otro')[0]);
      expect(screen.queryByText(/Mostrando/)).not.toBeInTheDocument();
    });
  });

  describe('paginación en el servidor', () => {
    const paginacion = {
      total: 57,
      pagina: 2,
      limite: 10,
      onCambiarPagina: vi.fn(),
      onCambiarLimite: vi.fn(),
      actualizando: true,
    };

    it('no recorta ni filtra en memoria y delega los cambios de página', async () => {
      const { user } = montar({ paginacionServidor: paginacion, searchTerm: 'nada-coincide', onSearchChange: vi.fn() });
      expect(filasDelCuerpo()).toHaveLength(12);
      expect(screen.getByText('Mostrando 21-30 de 57 registros')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /next page/i }));
      expect(paginacion.onCambiarPagina).toHaveBeenCalledWith(3);
      await user.click(screen.getByRole('combobox', { name: /Filas por página/ }));
      await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: '25' }));
      expect(paginacion.onCambiarLimite).toHaveBeenCalledWith(25);
    });

    it('sin datos muestra el mensaje vacío y no muestra la barra mientras carga', () => {
      montar({ data: [], loading: true, paginacionServidor: { ...paginacion, total: 0 } });
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('usa una clave aleatoria cuando la fila no tiene id', () => {
    const sinId = [{ Nombre: 'A', Estado: 'Activo' }] as unknown as Fila[];
    montar({ data: sinId });
    expect(filasDelCuerpo()).toHaveLength(1);
  });

  it('el rótulo de filas muestra "más de" cuando el total es desconocido', () => {
    montar({ paginacionServidor: { total: -1, pagina: 0, limite: 10, onCambiarPagina: vi.fn(), onCambiarLimite: vi.fn(), actualizando: false } });
    expect(screen.getByText('1-10 de más de 10')).toBeInTheDocument();
  });
});
