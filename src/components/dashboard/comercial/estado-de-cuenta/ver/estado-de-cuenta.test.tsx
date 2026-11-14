import * as React from 'react';
import { PDFPage } from 'pdf-lib';
import { describe, expect, it, vi } from 'vitest';

import { TablaVisualizarEstadoDeCuenta } from '@/components/dashboard/comercial/estado-de-cuenta/ver/TablaVisualizarEstadoDeCuenta';
import { diasCobradosTexto, formatoMoneda, type EstadoDeCuenta } from '@/components/dashboard/comercial/estado-de-cuenta/ver/estado-de-cuenta';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

type Usuario = ReturnType<typeof renderConProveedores>['user'];

const base: EstadoDeCuenta = {
  IdDetalleRemision: 1,
  Cliente: 'Constructora Andes',
  DocumentoCliente: '900',
  NoRemision: 'R-1',
  FechaRemision: '05/03/2026 a las 2:30 PM',
  Proyecto: 'Torre',
  Categoria: 'Andamios',
  Equipo: 'Andamio',
  CantidadPrestada: 5,
  CantidadDevuelta: 2,
  CantidadPendiente: 3,
  TiempoPrestamo: '10 días',
  EstadoDevolucion: 'Pendiente',
  PrecioUnitario: 100,
  IVA: 19,
  DiasCobradosEnObra: 10,
  UnidadesDiaCobradas: 36,
  ValorAlquiler: 3600,
  ValorAlquilerConIVA: 4284,
  CausacionDiariaConIVA: 357,
  Devoluciones: [
    { NoDevolucion: 'D-2', Fecha: '08/03/2026 a las 9:00 AM', FechaOrden: '2026-03-08 09:00:00', Cantidad: 1, DiasCobrados: 3, AnteriorARemision: 0 },
    { NoDevolucion: 'D-1', Fecha: '06/03/2026 a las 9:00 AM', FechaOrden: '2026-03-06 09:00:00', Cantidad: 1, DiasCobrados: 3, AnteriorARemision: 1 },
  ],
};

const filas: EstadoDeCuenta[] = [
  base,
  {
    ...base,
    IdDetalleRemision: 2,
    NoRemision: 'R-2',
    Equipo: 'Formaleta',
    CantidadPrestada: 2,
    CantidadDevuelta: 2,
    CantidadPendiente: 0,
    EstadoDevolucion: 'Completo',
    DiasCobradosEnObra: null,
    CausacionDiariaConIVA: 0,
    Devoluciones: [{ NoDevolucion: 'D-3', Fecha: 'x', FechaOrden: 'x', Cantidad: 2, DiasCobrados: 1, AnteriorARemision: false }],
  },
  { ...base, IdDetalleRemision: 3, NoRemision: 'R-3', Equipo: 'Puntal', CantidadPendiente: 1, DiasCobradosEnObra: 4, Devoluciones: [] },
  { ...base, IdDetalleRemision: 4, NoRemision: 'R-4', Equipo: 'Viejo', CantidadPrestada: 0, CantidadPendiente: 0, Devoluciones: null },
];

const resumen = {
  totalPrestado: 9,
  totalDevuelto: 4,
  totalPendiente: 5,
  alquilerSinIVA: 1000,
  alquilerConIVA: 1190,
  causacionDiariaConIVA: 357,
  transportes: { remisiones: 200, devoluciones: 100 },
  totalCausado: 1490,
};

const respuesta = (extra = {}) => paginar(filas, { Resumen: resumen, Opciones: { Proyectos: ['Torre', 'Puente'], Equipos: ['Andamio'] }, ...extra });

const rutas = {
  'GET /listar-clientes': () => [{ value: '900', label: 'Constructora Andes' }],
  'GET /ver-estado-de-cuenta-cliente': () => respuesta(),
};

async function conCliente(extra = {}) {
  const api = simularApi({ ...rutas, ...extra });
  const utilidades = renderConProveedores(<TablaVisualizarEstadoDeCuenta />);
  await waitFor(() => expect(api.llamadasA('/listar-clientes')).toHaveLength(1));
  await elegirOpcion(utilidades.user, /^Empresa\/Cliente/, 'Constructora Andes');
  await screen.findByText('Formaleta');
  return { ...utilidades, api };
}

function capturarTextosPdf() {
  const textos: string[] = [];
  vi.spyOn(PDFPage.prototype, 'drawText').mockImplementation(function (texto: string) {
    textos.push(texto);
  });
  return textos;
}

async function informe(user: Usuario, tipo: 'Informe Cliente' | 'Informe Interno') {
  await user.click(screen.getByRole('button', { name: tipo }));
  await waitFor(() => expect(screen.getByRole('button', { name: tipo })).toBeEnabled());
}

describe('diasCobradosTexto', () => {
  it.each([
    [filas[0], 'Varios (ver detalle)'],
    [filas[1], '1 día'],
    [filas[2], '4 días'],
    [filas[3], '-'],
  ])('%#', (fila, texto) => {
    expect(diasCobradosTexto(fila)).toBe(texto);
  });
});

describe('TablaVisualizarEstadoDeCuenta', () => {
  it('sin cliente no consulta ni muestra tarjetas', async () => {
    const api = simularApi(rutas);
    renderConProveedores(<TablaVisualizarEstadoDeCuenta />);
    await waitFor(() => expect(api.llamadasA('/listar-clientes')).toHaveLength(1));
    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeDisabled();
    expect(screen.queryByText('Total en Obra')).not.toBeInTheDocument();
    expect(api.llamadasA('/ver-estado-de-cuenta-cliente')).toHaveLength(0);
  });

  it('al elegir cliente consulta paginado y muestra resumen y filas', async () => {
    const { api } = await conCliente();
    expect(api.llamadasA('/ver-estado-de-cuenta-cliente').at(-1)!.params).toEqual({ pagina: 1, limite: 10, DocumentoCliente: '900' });
    expect(screen.getByText('Total en Obra').nextSibling).toHaveTextContent('5');
    const tarjeta = (titulo: string) => screen.getByText(titulo, { selector: 'span' }).parentElement!.textContent;
    expect(tarjeta('Alquiler causado')).toBe(`Alquiler causado${formatoMoneda(1190)}${formatoMoneda(1000)} + IVA`);
    expect(tarjeta('Transportes')).toContain(formatoMoneda(300));
    expect(tarjeta('Total causado a hoy')).toContain(formatoMoneda(1490));
    expect(tarjeta('Suma por cada día más')).toContain(formatoMoneda(357));
    expect(screen.getByText('Alquiler con IVA + transportes')).toBeInTheDocument();

    const fila = (equipo: string) => screen.getByText(equipo).closest('tr')!;
    expect(within(fila('Andamio')).getByText('3 en obra')).toBeInTheDocument();
    expect(within(fila('Andamio')).getByText('Varios (ver detalle)')).toBeInTheDocument();
    expect(fila('Andamio').textContent).toContain(`+${formatoMoneda(357)}/día`);
    expect(within(fila('Andamio')).getByText('05/03/2026 · 2:30 PM')).toBeInTheDocument();
    expect(within(fila('Formaleta')).getByText('Completo')).toBeInTheDocument();
    expect(within(fila('Formaleta')).getByText('con IVA')).toBeInTheDocument();
    expect(within(fila('Viejo')).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('filtra por proyecto y equipo; Actualizar limpia los filtros', async () => {
    const { user, api } = await conCliente();
    await elegirOpcion(user, 'Filtrar por Proyecto', 'Torre');
    await waitFor(() => expect(api.llamadasA('/ver-estado-de-cuenta-cliente').at(-1)!.params).toMatchObject({ Proyecto: 'Torre' }));
    api.definir({ 'GET /ver-estado-de-cuenta-cliente': () => respuesta({ Resumen: { ...resumen, transportes: null } }) });
    await elegirOpcion(user, 'Filtrar por Equipo', 'Andamio');
    await waitFor(() => expect(api.llamadasA('/ver-estado-de-cuenta-cliente').at(-1)!.params).toMatchObject({ Proyecto: 'Torre', Equipo: 'Andamio' }));
    expect(await screen.findByText('No aplica al filtrar por equipo: se cobra por documento')).toBeInTheDocument();
    expect(screen.getByText('Sólo alquiler con IVA')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Actualizar' }));
    await waitFor(() => expect(api.llamadasA('/ver-estado-de-cuenta-cliente').at(-1)!.params).toEqual({ pagina: 1, limite: 10, DocumentoCliente: '900' }));
  });

  it('el detalle desglosa días cobrados y advierte devoluciones anteriores a la remisión', async () => {
    const { user } = await conCliente();
    const fila = screen.getByText('Andamio').closest('tr')!;
    await user.click(within(fila).getByRole('button'));
    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText('40.0% Completado')).toBeInTheDocument();
    expect(within(dialogo).getByText('1 unidad devuelta en la devolución D-1 × 3 días')).toBeInTheDocument();
    expect(within(dialogo).getByText('3 unidades en obra × 10 días (hasta hoy)')).toBeInTheDocument();
    expect(within(dialogo).getByText('Registrada con una hora anterior a la de la remisión.')).toBeInTheDocument();
    expect(within(dialogo).getByText(/quedó registrada con fecha y hora anteriores/)).toBeInTheDocument();
    expect(within(dialogo).getByText(/este renglón suma/)).toBeInTheDocument();
    expect(within(dialogo).getByText('Tiempo Transcurrido (hasta hoy)')).toBeInTheDocument();
    // Las devoluciones se listan por fecha: D-1 antes que D-2.
    const textos = within(dialogo).getAllByText(/^Devolución No\./).map((n) => n.textContent!.trim());
    expect(textos).toEqual(['Devolución No. D-1', 'Devolución No. D-2']);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(within(dialogo).getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('el detalle de un renglón completo sin días en obra', async () => {
    const { user } = await conCliente();
    await user.click(within(screen.getByText('Viejo').closest('tr')!).getByRole('button'));
    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText('0.0% Completado')).toBeInTheDocument();
    expect(within(dialogo).getByText('Tiempo Transcurrido (hasta la última devolución)')).toBeInTheDocument();
    expect(within(dialogo).getByText('—')).toBeInTheDocument();
    await user.click(within(dialogo).getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(within(screen.getByText('Formaleta').closest('tr')!).getByRole('button'));
    expect(within(await screen.findByRole('dialog')).getByText('2 unidades devueltas en la devolución D-3 × 1 día')).toBeInTheDocument();
  });

  it('genera el informe para el cliente (varias páginas) y lo manda a imprimir', async () => {
    const informeCliente = Array.from({ length: 30 }, (_, i) => ({
      NoRemision: `R-${i}`,
      FechaRemision: '05/03/2026',
      Proyecto: i % 2 ? 'Puente' : 'Torre',
      Equipo: i === 0 ? 'Equipo con un nombre larguísimo que no cabe en la columna del informe' : `Equipo ${i}`,
      Categoria: 'Andamios',
      CantidadPendiente: 1,
      TiempoPrestamo: '3 días',
    }));
    const { user, api } = await conCliente({ 'GET /informe-cliente-equipos-en-obra': informeCliente });
    const textos = capturarTextosPdf();
    await informe(user, 'Informe Cliente');
    expect(api.llamadasA('/informe-cliente-equipos-en-obra')[0].params).toEqual({ DocumentoCliente: '900' });
    expect(textos).toContain('INFORME CLIENTE - EQUIPOS EN OBRA');
    expect(textos).toContain('Cliente: Constructora Andes');
    expect(textos).toContain('Proyecto: Todos');
    expect(textos).toContain('Página 2 de 2');
    expect(textos).toContain('Totales: Pendiente 30');
    expect(textos).not.toContain('V. PEND');
    expect(textos.some((t) => t.endsWith('…'))).toBe(true);
    expect(document.querySelector('iframe')).not.toBeNull();
  });

  it('genera el informe interno agrupado por proyecto con subarrendatario y valores', async () => {
    const equipo = (IdEquipo: number, Equipo: string) => ({
      IdEquipo,
      Equipo,
      Categoria: 'A',
      Subarrendatario: 'Sub S.A.S',
      DocumentoSubarrendatario: '800',
      CantidadPrestada: 5,
      CantidadDevuelta: 2,
      CantidadEnObra: 3,
      PrecioUnitario: 100,
      ValorPendiente: 300,
      TiempoPrestamo: '10 días',
    });
    const agrupado = {
      data: [
        { IdProyecto: 1, Proyecto: 'Torre', DireccionProyecto: 'Calle 1', Equipos: [equipo(8, 'Formaleta'), equipo(7, 'Andamio')] },
        { DocumentoCliente: '900', Equipos: [{ ...equipo(9, 'Puntal'), Proyecto: 'Puente', IdProyecto: 2 }] },
        { IdProyecto: 3, Proyecto: 'Vacío', Equipos: 'no-es-lista' },
      ],
    };
    const { user, api } = await conCliente({ 'GET /informe-interno-empresa-equipos-en-obra': agrupado });
    await elegirOpcion(user, 'Filtrar por Proyecto', 'Torre');
    const textos = capturarTextosPdf();
    await informe(user, 'Informe Interno');
    expect(api.llamadasA('/informe-interno-empresa-equipos-en-obra')[0].params).toEqual({ DocumentoCliente: '900', IdProyecto: 'Torre' });
    expect(textos).toContain('INFORME INTERNO - EQUIPOS EN OBRA');
    expect(textos).toContain('Proyecto: Torre');
    expect(textos).toEqual(expect.arrayContaining(['SUBARREND.', 'P. UNIT', 'V. PEND', 'TIEMPO', 'ID PROY']));
    expect(textos.filter((t) => t === 'Torre')).toHaveLength(1);
    expect(textos).toContain(`Totales: Prest. 15 | Dev. 6 | En Obra 9 | Valor Pend. ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(900)}`);
  });

  it('informe interno plano y agrupado sin valores', async () => {
    const { user, api } = await conCliente({
      'GET /informe-interno-empresa-equipos-en-obra': [{ NoRemision: 'R-1', Equipo: 'Andamio', Pendiente: '2', Valor: '1,5', Precio: 10 }],
      'GET /informe-cliente-equipos-en-obra': [{ Proyecto: 'Torre', Equipos: [{ Equipo: 'Andamio', Prestada: 1, Devuelta: 1, EnObra: 0 }] }],
    });
    let textos = capturarTextosPdf();
    await informe(user, 'Informe Interno');
    expect(textos).toContain(`Totales: Pendiente 2 | Valor Pendiente ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(1.5)}`);
    vi.restoreAllMocks();
    simularApi({ ...rutas, 'GET /informe-cliente-equipos-en-obra': [{ Proyecto: 'Torre', Equipos: [{ Equipo: 'Andamio', Prestada: 1, Devuelta: 1, EnObra: 0 }] }] });
    textos = capturarTextosPdf();
    await informe(user, 'Informe Cliente');
    expect(textos).toContain('Totales: Prest. 1 | Dev. 1 | En Obra 0');
    expect(api.llamadasA('/informe-interno-empresa-equipos-en-obra')).toHaveLength(1);
  });

  it('en móvil descarga el PDF en lugar de imprimir', async () => {
    const { user } = await conCliente({ 'GET /informe-cliente-equipos-en-obra': [{ NoRemision: 'R-1', Cantidad: 1 }] });
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Linux; Android 14)');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const iframes = document.querySelectorAll('iframe').length;
    capturarTextosPdf();
    await informe(user, 'Informe Cliente');
    await waitFor(() => expect(click).toHaveBeenCalled());
    expect(document.querySelectorAll('iframe')).toHaveLength(iframes);
  });

  it('avisa si el informe no trae datos o falla', async () => {
    const { user, api } = await conCliente({ 'GET /informe-cliente-equipos-en-obra': [] });
    await informe(user, 'Informe Cliente');
    expect(await screen.findByText('No hay datos para generar el informe con los filtros actuales.')).toBeInTheDocument();
    api.definir({ 'GET /informe-interno-empresa-equipos-en-obra': new ErrorApi('Sin permiso') });
    await informe(user, 'Informe Interno');
    expect(await screen.findByText('Sin permiso')).toBeInTheDocument();
  });

  it('registra el error al listar clientes', async () => {
    simularApi({ ...rutas, 'GET /listar-clientes': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarEstadoDeCuenta />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al listar los clientes')));
  });

  it('muestra el error de la consulta', async () => {
    const api = simularApi({ ...rutas, 'GET /ver-estado-de-cuenta-cliente': new ErrorApi('Cliente sin remisiones') });
    const { user } = renderConProveedores(<TablaVisualizarEstadoDeCuenta />);
    await waitFor(() => expect(api.llamadasA('/listar-clientes')).toHaveLength(1));
    await elegirOpcion(user, /^Empresa\/Cliente/, 'Constructora Andes');
    expect(await screen.findByText('Error al actualizar: Error: Cliente sin remisiones')).toBeInTheDocument();
  });
});
