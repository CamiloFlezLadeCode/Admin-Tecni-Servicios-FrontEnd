import * as React from 'react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';

import { TablaVisualizarMovimientosGenerales } from '@/components/dashboard/comercial/movimientos-generales/ver/TablaVisualizarMovimientosGenerales';
import type { MovimientoGeneral } from '@/services/comercial/movimientos_generales/VerMovimientosGeneralesService';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

const base: MovimientoGeneral = {
  IdMovimiento: 1,
  TipoMovimiento: 'REMISION',
  NoMovimiento: 'R-1',
  Cliente: 'Constructora Andes',
  DocumentoCliente: '900',
  Proyecto: 'Torre',
  IdProyecto: 3,
  Fecha: '2026-11-05T10:00:00',
  CreadoPor: 'Ana',
  Estado: 'Creado',
  Total: 150000,
};

const movimientos: MovimientoGeneral[] = [
  base,
  { ...base, IdMovimiento: 2, TipoMovimiento: 'DEVOLUCION', NoMovimiento: 'D-1', Estado: 'Anulado', Total: 0 },
  { ...base, IdMovimiento: 3, TipoMovimiento: 'ORDEN_DE_SERVICIO', NoMovimiento: 'OS-1', Total: 20000 },
  { ...base, IdMovimiento: 4, TipoMovimiento: 'OTRO' as any, NoMovimiento: 'X-1' },
];

const resumen = { remisiones: 150000, devoluciones: 30000, ordenes: 20000, total: 200000 };
const pdf = new Blob(['%PDF'], { type: 'application/pdf' });

const rutas = {
  'GET /listar-clientes': () => [{ value: '900', label: 'Constructora Andes' }],
  'GET /listar-proyectos': () => [
    { value: 3, label: 'Torre' },
    { value: 4, label: 'Puente' },
  ],
  'GET /ver-movimientos-generales': ({ params }: any) => (params?.pagina ? paginar(movimientos, { Resumen: resumen }) : movimientos),
  'GET /obtener-pdf-remision/*': () => pdf,
  'GET /obtener-pdf-devolucion': () => pdf,
  'GET /obtener-pdf-orden-de-servicio': () => pdf,
};

const moneda = (n: number, decimales = true) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', ...(decimales ? {} : { maximumFractionDigits: 0 }) }).format(n);
const textoPlano = (s: string | null | undefined) => (s ?? '').replace(/\s/g, ' ');
const fila = (no: string) => screen.getByText(no, { selector: 'td' }).closest('tr') as HTMLElement;

async function montar(extra = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const utilidades = renderConProveedores(<TablaVisualizarMovimientosGenerales />);
  await waitFor(() => expect(screen.getByText('R-1', { selector: 'td' })).toBeInTheDocument());
  return { ...utilidades, api };
}

describe('TablaVisualizarMovimientosGenerales', () => {
  it('consulta el mes actual, muestra tipos, valores y el resumen del servidor', async () => {
    const { api } = await montar();
    const params = api.llamadasA('/ver-movimientos-generales')[0].params as any;
    expect(params).toMatchObject({
      pagina: 1,
      FechaInicio: dayjs().startOf('month').format('YYYY-MM-DD'),
      FechaFin: dayjs().endOf('month').format('YYYY-MM-DD'),
    });
    expect(params.DocumentoCliente).toBeUndefined();
    expect(within(fila('R-1')).getByText('Remisión')).toBeInTheDocument();
    expect(within(fila('D-1')).getByText('Devolución')).toBeInTheDocument();
    expect(within(fila('OS-1')).getByText('Orden de Servicio')).toBeInTheDocument();
    expect(within(fila('X-1')).getByText('OTRO')).toBeInTheDocument();
    expect(textoPlano(fila('R-1').textContent)).toContain(textoPlano(moneda(150000)));
    expect(within(fila('D-1')).getByText('-')).toBeInTheDocument();
    expect(within(fila('R-1')).getByText('05/11/2026')).toBeInTheDocument();
    expect(screen.getByText('Todos los Clientes')).toBeInTheDocument();
    const cuerpo = textoPlano(document.body.textContent);
    expect(cuerpo).toContain(textoPlano(moneda(30000, false)));
    expect(cuerpo).toContain(textoPlano(moneda(200000, false)));
    expect(api.llamadasA('/listar-proyectos')[0].params).toBeUndefined();
  });

  it('filtra por cliente y proyecto, y Limpiar vuelve a los valores iniciales', async () => {
    const { user, api } = await montar();
    await elegirOpcion(user, 'Cliente', 'Constructora Andes');
    await waitFor(() => expect(api.llamadasA('/listar-proyectos').at(-1)!.params).toEqual({ Cliente: '900' }));
    expect(screen.getByText('Constructora Andes', { selector: 'span' })).toBeInTheDocument();
    await elegirOpcion(user, 'Proyecto', 'Puente');
    await waitFor(() =>
      expect(api.llamadasA('/ver-movimientos-generales').at(-1)!.params).toMatchObject({ DocumentoCliente: '900', IdProyecto: 4 })
    );

    // Si el proyecto elegido no existe para el nuevo cliente, vuelve a "Todos".
    api.definir({ 'GET /listar-proyectos': () => [{ value: 3, label: 'Torre' }] });
    await user.click(screen.getByRole('button', { name: 'Limpiar' }));
    await waitFor(() => expect(screen.getByText('Todos los Clientes')).toBeInTheDocument());
    await waitFor(() => expect(api.llamadasA('/ver-movimientos-generales').at(-1)!.params.IdProyecto).toBeUndefined());

    const antes = api.llamadasA('/ver-movimientos-generales').length;
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await waitFor(() => expect(api.llamadasA('/ver-movimientos-generales').length).toBe(antes + 1));
  });

  it('si fallan los proyectos deja solo "Todos los Proyectos"', async () => {
    const { user } = await montar({ 'GET /listar-proyectos': new ErrorApi('x'), 'GET /listar-clientes': new ErrorApi('x') });
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error al cargar proyectos:', expect.anything()));
    expect(console.error).toHaveBeenCalledWith('Error al cargar clientes:', expect.anything());
    await user.click(comboPorEtiqueta('Proyecto'));
    expect(within(await screen.findByRole('listbox')).getAllByRole('option')).toHaveLength(1);
  });

  it('exporta a CSV todos los movimientos filtrados (endpoint sin paginar)', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const crear = vi.spyOn(URL, 'createObjectURL');
    const { user, api } = await montar();
    await user.click(screen.getByRole('button', { name: 'Exportar CSV' }));
    await waitFor(() => expect(click).toHaveBeenCalled());
    const sinPaginar = api.llamadasA('/ver-movimientos-generales').find((l) => !(l.params as any)?.pagina);
    expect(sinPaginar!.params).toMatchObject({ FechaInicio: dayjs().startOf('month').format('YYYY-MM-DD') });
    const enlace = click.mock.contexts[0] as HTMLAnchorElement;
    expect(enlace.getAttribute('download')).toBe(`Movimientos_${dayjs().format('YYYY-MM-DD')}.csv`);
    const blob = crear.mock.calls[0][0] as Blob;
    const texto = await blob.text();
    expect(texto.split('\n')[0]).toBe('Tipo,No. Documento,Fecha,Cliente,Proyecto,Valor Total,Estado');
    expect(texto).toContain('REMISION,R-1,05/11/2026,"Constructora Andes","Torre",150000,Creado');
    expect(texto).toContain('DEVOLUCION,D-1,05/11/2026,"Constructora Andes","Torre",0,Anulado');
  });

  it('avisa si la exportación falla', async () => {
    const { user, api } = await montar();
    api.definir({ 'GET /ver-movimientos-generales': new ErrorApi('caído') });
    await user.click(screen.getByRole('button', { name: 'Exportar CSV' }));
    expect(await screen.findByText('caído')).toBeInTheDocument();
  });

  it('sin resultados no permite exportar ni falla el resumen', async () => {
    simularApi({ ...rutas, 'GET /ver-movimientos-generales': () => paginar([]) });
    renderConProveedores(<TablaVisualizarMovimientosGenerales />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDisabled());
    expect(textoPlano(document.body.textContent)).toContain(textoPlano(moneda(0, false)));
  });

  it('muestra el error del listado', async () => {
    simularApi({ ...rutas, 'GET /ver-movimientos-generales': new ErrorApi('Rango no permitido') });
    renderConProveedores(<TablaVisualizarMovimientosGenerales />);
    expect(await screen.findByText('Rango no permitido')).toBeInTheDocument();
  });

  it.each([
    ['R-1', '/obtener-pdf-remision/1', 'REMISION_R-1.pdf'],
    ['D-1', '/obtener-pdf-devolucion', 'DEVOLUCION_D-1.pdf'],
    ['OS-1', '/obtener-pdf-orden-de-servicio', 'ORDEN_DE_SERVICIO_OS-1.pdf'],
  ])('descarga el PDF de %s', async (no, ruta, archivo) => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const { user, api } = await montar();
    await user.click(within(fila(no)).getByRole('button'));
    expect(await screen.findByText('PDF generado correctamente')).toBeInTheDocument();
    expect(api.llamadasA(ruta)).toHaveLength(1);
    expect((click.mock.contexts[0] as HTMLAnchorElement).getAttribute('download')).toBe(archivo);
  });

  it('informa cuando el PDF no se puede generar o el tipo no lo soporta', async () => {
    const { user } = await montar({ 'GET /obtener-pdf-devolucion': new ErrorApi('sin plantilla') });
    await user.click(within(fila('X-1')).getByRole('button'));
    expect(await screen.findByText('Error al generar el PDF: Tipo de movimiento no soportado para PDF')).toBeInTheDocument();
    await user.click(within(screen.getByRole('alert')).getByRole('button'));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    await user.click(within(fila('D-1')).getByRole('button'));
    expect(await screen.findByText('Error al generar el PDF: sin plantilla')).toBeInTheDocument();
  });

  it('advierte y bloquea la búsqueda cuando la fecha de inicio supera la final', async () => {
    // Con puntero fino MUI usa el selector de escritorio, cuyo campo se edita con el teclado.
    const original = window.matchMedia;
    vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({ ...original(q), matches: q.includes('pointer: fine') }));
    const { user } = await montar();
    const inicio = screen.getByLabelText('Fecha Inicio');
    await user.click(inicio);
    await user.keyboard('{ArrowRight}{ArrowUp}');
    expect(await screen.findByText('Atención: La fecha de inicio es posterior a la fecha fin')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();

    await user.click(within(screen.getByRole('alert')).getByRole('button'));
    const fin = screen.getByLabelText('Fecha Fin');
    await user.click(fin);
    await user.keyboard('{ArrowRight}{ArrowDown}{ArrowDown}');
    expect(await screen.findByText('Atención: La fecha fin es anterior a la fecha de inicio')).toBeInTheDocument();
  });
});
