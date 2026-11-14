import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { EditarRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/EditarRemision';
import { ConEstado, ErrorApi, simularApi } from '@test/mocks/api';
import { comboPorEtiqueta, elegirOpcion, fireEvent, renderConProveedores, screen, waitFor, within } from '@test/utils';

const EMPRESA = '901893972-3';

const remision = {
  NoRemision: 'R-10',
  ObservacionesEmpresa: 'obs',
  IVA: 19,
  IncluyeTransporte: 1,
  ValorTransporte: 5000,
  Cliente: 'Constructora Andes',
  DocumentoCliente: '900',
  IdProyecto: 3,
  FechaRemision: '05/03/2026 02:30 PM',
  ProyectosCliente: [
    { value: 3, label: 'Torre' },
    { value: 4, label: 'Puente' },
  ],
  Detalles: [
    {
      IdDetalleRemision: 1,
      IdEquipo: 7,
      NombreEquipo: 'Andamio',
      IdCategoria: 4,
      NombreCategoria: 'Andamios',
      Cantidad: 2,
      PrecioUnidad: 100,
      PrecioTotal: 238,
      IVA: 19,
      PrecioTotalSinIVA: 200,
      DocumentoSubarrendatario: EMPRESA,
      NombreSubarrendatario: 'TECNISERVICIOS',
    },
    { IdDetalleRemision: 2, IdEquipo: 0, NombreEquipo: 'Transporte', Cantidad: 1, PrecioUnidad: 5000, PrecioTotal: 5000, PrecioTotalSinIVA: 5000 },
    {
      IdDetalleRemision: 3,
      IdEquipo: 8,
      Equipo: 'Formaleta',
      Categoria: 'Formaletas',
      Cantidad: 1,
      PrecioUnidad: 50,
      PrecioTotal: 59.5,
      IVA: 'x',
      PrecioTotalSinIVA: 50,
      DocumentoSubarrendatario: '800',
      NombreSubarrendatario: 'Sub S.A.S',
    },
  ],
};

const rutas = {
  'GET /ver-remision-por-id': [remision],
  'GET /ver-items-remision': [],
  'GET /listar-categorias': [
    { value: 4, label: 'Andamios' },
    { value: 5, label: 'Inactiva', Activo: false },
  ],
  'GET /listar-subarrendatarios': [
    { value: '800', label: 'Sub S.A.S' },
    { value: EMPRESA, label: 'TECNISERVICIOS' },
  ],
  'GET /ver-cantidad-disponible-equipo/*': [{ CantidadDisponible: 3, PrecioAlquiler: 120 }],
  'GET /ver-disponibilidad-equipos': [
    { value: 7, label: 'Andamio', estado: 'Disponible' },
    { value: 9, label: 'Torre grúa', estado: 'Disponible' },
  ],
  'GET /ver-disponibilidad-equipos-generales': [{ value: 11, label: 'Equipo ajeno', estado: 'Disponible' }],
};

async function abrir(extra = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const onSuccess = vi.fn();
  const onMostrarMensaje = vi.fn();
  const utilidades = renderConProveedores(<EditarRemision IdRemision={10} onSuccess={onSuccess} onMostrarMensaje={onMostrarMensaje} />);
  await utilidades.user.click(screen.getByRole('button', { name: 'Editar remisión' }));
  return { ...utilidades, api, onSuccess, onMostrarMensaje };
}

const fila = (texto: string) => screen.getByRole('cell', { name: texto }).closest('tr')!;
const campos = (texto: string) => within(fila(texto)).getAllByRole('spinbutton');

describe('EditarRemision', () => {
  it('carga la remisión: cabecera, ítems, disponibilidad y transporte', async () => {
    const { api } = await abrir();
    expect(await screen.findByText('Editar Remisiónsss: R-10')).toBeInTheDocument();
    await screen.findByRole('cell', { name: 'Andamio' });
    expect(api.llamadasA('/ver-remision-por-id')[0].params).toEqual({ IdRemision: 10 });
    expect(screen.getByLabelText('Cliente')).toHaveValue('Constructora Andes');
    expect(screen.getByLabelText('Cliente')).toBeDisabled();
    expect(comboPorEtiqueta('Proyecto')).toHaveTextContent('Torre');
    // Disponible = stock actual (3) + lo que ya tiene esta remisión (2).
    expect(campos('Andamio')[1]).toHaveValue(5);
    expect(within(fila('Formaleta')).getByText('-')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Transporte' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar Transporte' })).toBeDisabled();
    expect(screen.getByText('Cant. Dispo.')).toBeInTheDocument();
    expect(screen.getByText(`$${(5250).toLocaleString()}`)).toBeInTheDocument();
  });

  it('no deja superar la disponibilidad al editar la cantidad de un ítem propio', async () => {
    const { onMostrarMensaje } = await abrir();
    await screen.findByRole('cell', { name: 'Andamio' });
    fireEvent.change(campos('Andamio')[0], { target: { value: '9' } });
    expect(onMostrarMensaje).toHaveBeenCalledWith('La cantidad (9) supera la disponibilidad (5)', 'error');
    expect(campos('Andamio')[0]).toHaveValue(2);
    fireEvent.change(campos('Formaleta')[0], { target: { value: '40' } });
    expect(campos('Formaleta')[0]).toHaveValue(40);
  });

  it('recalcula con el IVA general (sin tocar el transporte) y guarda', async () => {
    const { user, api, onMostrarMensaje, onSuccess } = await abrir();
    await screen.findByRole('cell', { name: 'Andamio' });
    fireEvent.change(screen.getByLabelText('IVA General %'), { target: { value: '-5' } });
    expect(screen.getByLabelText('IVA General %')).toHaveValue(0);
    fireEvent.change(screen.getByLabelText('IVA General %'), { target: { value: '10' } });
    fireEvent.change(campos('Transporte')[1], { target: { value: '6000' } });
    fireEvent.change(campos('Andamio')[0], { target: { value: '3' } });
    await elegirOpcion(user, 'Proyecto', 'Puente');
    await user.type(screen.getByLabelText('Observaciones Empresa'), '!');
    await user.click(screen.getByRole('button', { name: 'Guardar Cambios' }));

    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('Remisión actualizada con éxito', 'success'));
    const cuerpo = api.llamadasA('/actualizar-remision')[0].cuerpo as any;
    expect(cuerpo).toMatchObject({
      IdProyecto: 4,
      ObservacionesEmpresa: 'obs!',
      IVA: '10',
      IncluyeTransporte: 1,
      ValorTransporte: 6000,
      UsuarioQueActualiza: '1001',
    });
    expect(cuerpo.FechaRemision).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(cuerpo.PrecioTotalGeneralSinIVA).toBe(6350);
    expect(cuerpo.PrecioTotalGeneralConIVA).toBeCloseTo(6385);
    expect(cuerpo.Detalles).toEqual([
      expect.objectContaining({ IdDetalleRemision: 1, IdEquipo: 7, Cantidad: 3, IVA: 10, PrecioTotalSinIVA: 300, DocumentoSubarrendatario: EMPRESA }),
      expect.objectContaining({ IdDetalleRemision: 2, IdEquipo: 0, PrecioUnidad: 6000, IVA: 0, PrecioTotal: 6000, DocumentoSubarrendatario: null, EsItemTransporte: true }),
      expect.objectContaining({ IdDetalleRemision: 3, IdEquipo: 8, IVA: 10, DocumentoSubarrendatario: '800', EsItemTransporte: false }),
    ]);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled(), { timeout: 3000 });
    await waitFor(() => expect(screen.queryByText('Editar Remisiónsss: R-10')).not.toBeInTheDocument());
  });

  it('avisa cuando el backend responde 204 (sin cambios) o falla', async () => {
    const { user, api, onMostrarMensaje } = await abrir({ 'PUT /actualizar-remision': new ConEstado(204) });
    await screen.findByRole('cell', { name: 'Andamio' });
    await user.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('No se realizó ningún cambio', 'warning'));
    api.definir({ 'PUT /actualizar-remision': new ErrorApi('falló') });
    await user.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al actualizar la remisión'), 'error'));
  });

  it('exige al menos un ítem; quitar el transporte lo desactiva y se puede volver a agregar', async () => {
    const { user, api, onMostrarMensaje } = await abrir();
    await screen.findByRole('cell', { name: 'Andamio' });
    const eliminar = (texto: string) => user.click(within(fila(texto)).getAllByRole('button').at(-1)!);
    await eliminar('Transporte');
    expect(screen.getByRole('button', { name: 'Agregar Transporte' })).toBeEnabled();
    await eliminar('Andamio');
    await eliminar('Formaleta');
    expect(screen.getByText('No hay items en la remisión')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(onMostrarMensaje).toHaveBeenCalledWith('La remisión debe tener al menos un item', 'error');
    expect(api.llamadasA('/actualizar-remision')).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Agregar Transporte' }));
    expect(screen.getByRole('cell', { name: 'Transporte' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    await waitFor(() => expect(api.llamadasA('/actualizar-remision')).toHaveLength(1));
    expect(api.llamadasA('/actualizar-remision')[0].cuerpo).toMatchObject({ IncluyeTransporte: 1, ValorTransporte: 0 });
  });

  it('agrega un equipo propio validando la disponibilidad', async () => {
    const { user, api, onMostrarMensaje } = await abrir();
    await screen.findByRole('cell', { name: 'Andamio' });
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(onMostrarMensaje).toHaveBeenCalledWith('Complete los datos del item', 'error');

    await user.click(comboPorEtiqueta('Categoría'));
    expect(within(await screen.findByRole('listbox')).queryByText('Inactiva')).not.toBeInTheDocument();
    await user.click(within(screen.getByRole('listbox')).getByText('Andamios'));
    await waitFor(() => expect(api.llamadasA('/ver-disponibilidad-equipos')).toHaveLength(1));
    expect(api.llamadasA('/ver-disponibilidad-equipos')[0].params).toEqual({ IdCategoria: 4, DocumentoSubarrendatario: EMPRESA });
    await elegirOpcion(user, 'Equipo', 'Torre grúa');
    await waitFor(() => expect(screen.getByLabelText('Precio Unit.')).toHaveValue(120));
    expect(screen.getByLabelText('Disponible')).toHaveValue(3);

    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '5' } });
    await waitFor(() => expect(screen.getByText('Excede disponible')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(onMostrarMensaje).toHaveBeenCalledWith('La cantidad solicitada (5) supera la disponibilidad actual (3)', 'error');

    // Comportamiento actual (defecto): cambiar cualquier otro campo del ítem reinicia la cantidad a 1.
    await user.type(screen.getByLabelText('Observaciones Item (Opcional)'), 'nuevo');
    expect(screen.getByLabelText('Cantidad')).toHaveValue(1);
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } });
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    const nueva = fila('Torre grúa');
    expect(within(nueva).getByText('TECNISERVICIOS J.F S.A.S')).toBeInTheDocument();
    expect(within(nueva).getByText(`$${(285.6).toLocaleString()}`)).toBeInTheDocument();
    expect(screen.getByLabelText('Cantidad')).toHaveValue(1);
  });

  it('agrega un equipo de subarrendatario buscando en bodegas de alquiler', async () => {
    const { user, api } = await abrir();
    await screen.findByRole('cell', { name: 'Andamio' });
    await elegirOpcion(user, 'Subarrendatario', 'Sub S.A.S');
    expect(screen.queryByLabelText('Disponible')).not.toBeInTheDocument();
    await elegirOpcion(user, 'Categoría', 'Andamios');
    await waitFor(() => expect(api.llamadasA('/ver-disponibilidad-equipos-generales')).toHaveLength(1));
    expect(api.llamadasA('/ver-disponibilidad-equipos-generales')[0].params).toMatchObject({ IdCategoria: 4, IdTipoBodega: 3 });
    await elegirOpcion(user, 'Equipo', 'Equipo ajeno');
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '50' } });
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(within(fila('Equipo ajeno')).getByText('Sub S.A.S')).toBeInTheDocument();
  });

  it('usa los ítems del servicio si la remisión no trae detalles y registra errores de stock y catálogos', async () => {
    const { user } = await abrir({
      'GET /ver-remision-por-id': { ...remision, Detalles: undefined, IVA: 0, IdProyecto: null, ObservacionesEmpresa: undefined },
      'GET /ver-items-remision': [remision.Detalles[0]],
      'GET /ver-cantidad-disponible-equipo/*': new ErrorApi('x'),
      'GET /ver-disponibilidad-equipos': new ErrorApi('x'),
    });
    await screen.findByRole('cell', { name: 'Andamio' });
    expect(console.error).toHaveBeenCalledWith('Error cargando stock para item:', 7, expect.anything());
    expect(screen.getByLabelText('IVA General %')).toHaveValue(19);
    await elegirOpcion(user, 'Categoría', 'Andamios');
    await waitFor(() => expect(console.error).toHaveBeenCalledTimes(2));
  });

  it('informa si no puede cargar y se cierra con Cancelar o Escape', async () => {
    const { user, onMostrarMensaje } = await abrir({ 'GET /ver-remision-por-id': new ErrorApi('no existe') });
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al cargar la remisión'), 'error'));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.queryByText(/Editar Remisiónsss/)).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Editar remisión' }));
    await screen.findByText(/Editar Remisiónsss/);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText(/Editar Remisiónsss/)).not.toBeInTheDocument());
  });
});
