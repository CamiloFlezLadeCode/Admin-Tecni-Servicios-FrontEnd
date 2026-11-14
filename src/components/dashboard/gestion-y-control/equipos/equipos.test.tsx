import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FormularioCrearEquipo } from '@/components/dashboard/gestion-y-control/equipos/crear/FormularioCrearEquipo';
import { FormularioEditarEquipo } from '@/components/dashboard/gestion-y-control/equipos/editar/FormularioEditarEquipo';
import { ConsultarUbicacionEquipo } from '@/components/dashboard/gestion-y-control/equipos/ubicacion/ConsultarUbicacionEquipo';
import { TablaVisualizarEquipos } from '@/components/dashboard/gestion-y-control/equipos/ver/TablaVisualizarEquipos';
import { ErrorApi, paginar, simularApi } from '@test/mocks/api';
import { emitirDesdeServidor, sockets } from '@test/mocks/socket';
import { act, comboPorEtiqueta, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

const catalogos = {
  'GET /listar-clientes': () => [{ value: '800', label: 'Sub S.A.S' }],
  'GET /listar-categorias': () => [{ value: '4', label: 'Andamios' }],
  'GET /listar-estados': () => [
    { value: '3', label: 'Disponible' },
    { value: '4', label: 'No disponible' },
    { value: '6', label: ' Reparación ' },
    { value: '1', label: 'Activo' },
  ],
  'GET /listar-tipo-de-equipos': () => [
    { value: '1', label: 'Propio' },
    { value: '2', label: 'Ajeno' },
  ],
  'GET /listar-unidades-de-medida': () => [{ value: '2', label: 'Unidad' }],
  'GET /listar-bodegas-subarrendatario': ({ params }: { params?: Record<string, unknown> }) =>
    params?.IdTipoBodega === 3 ? [{ value: '10', label: 'Bodega alquiler' }] : [{ value: '20', label: 'Bodega reparación' }],
};

async function llenarEquipoPropio(user: ReturnType<typeof renderConProveedores>['user']) {
  await elegirOpcion(user, /^Tipo Equipo/, 'Propio');
  await elegirOpcion(user, /^Bodega/, 'Bodega alquiler');
  await elegirOpcion(user, /^Referencia/, 'Andamios');
  await user.type(screen.getByLabelText('Nombre*'), 'Andamio tubular');
  await elegirOpcion(user, /^Unidad Medida/, 'Unidad');
  await user.type(screen.getByLabelText('Precio Alquiler*'), '1500');
  await elegirOpcion(user, /^Estado/, 'Disponible');
}

describe('FormularioCrearEquipo', () => {
  it('solo ofrece los estados Disponible / No disponible / Reparación', async () => {
    simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await waitFor(() => comboPorEtiqueta(/^Estado/));
    await user.click(comboPorEtiqueta(/^Estado/));
    const opciones = within(await screen.findByRole('listbox')).getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(['Sin seleccionar', 'Disponible', 'No disponible', ' Reparación ']);
  });

  it('exige los campos obligatorios', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await user.click(screen.getByRole('button', { name: 'Crear equipo' }));
    expect(await screen.findByText('Por favor complete todos los campos requeridos correctamente')).toBeInTheDocument();
    for (const mensaje of [
      'La referencia es obligatoria',
      'El nombre es obligatorio.',
      'El precio de alquiler es obligatorio y debe ser mayor a 0',
      'El estado es obligatorio',
      'El tipo de equipo es obligatorio',
      'La unidad de medida es obligatoria',
    ]) {
      expect(screen.getByText(mensaje)).toBeInTheDocument();
    }
    expect(api.llamadasA('/crear-equipo')).toHaveLength(0);
  });

  it('equipo propio: bodegas de alquiler, propietario la empresa y sin selector de propietario', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await elegirOpcion(user, /^Tipo Equipo/, 'Propio');
    await waitFor(() => expect(api.llamadasA('/listar-bodegas-subarrendatario').some((p) => p.params?.IdTipoBodega === 3)).toBe(true));
    expect(screen.queryByText('Propietario', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('equipo ajeno: bodegas de reparación y pide propietario', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await elegirOpcion(user, /^Tipo Equipo/, 'Ajeno');
    await waitFor(() => expect(api.llamadasA('/listar-bodegas-subarrendatario').some((p) => p.params?.IdTipoBodega === 1)).toBe(true));
    await elegirOpcion(user, /^Propietario/, 'Sub S.A.S');
    await elegirOpcion(user, /^Bodega/, 'Bodega reparación');
    expect(comboPorEtiqueta(/^Bodega/)).toHaveTextContent('Bodega reparación');
  });

  it('valida los precios al vuelo', async () => {
    simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await user.type(screen.getByLabelText('Precio Alquiler*'), '0');
    expect(screen.getByText('El precio de alquiler es obligatorio y debe ser mayor a 0')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Precio Venta'), '-1');
    expect(screen.getByText('Debe ser mayor o igual a 0')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Precio Venta'));
    expect(screen.queryByText('Debe ser mayor o igual a 0')).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText('Nombre*'));
    await user.type(screen.getByLabelText('Nombre*'), 'a');
    await user.clear(screen.getByLabelText('Nombre*'));
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
  });

  it('crea un equipo propio con la empresa como propietaria, avisa y limpia', async () => {
    const api = simularApi(catalogos);
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await waitFor(() => expect(api.llamadasA('/listar-categorias')).toHaveLength(1));
    await llenarEquipoPropio(user);
    await user.click(screen.getByRole('button', { name: 'Crear equipo' }));

    expect(await screen.findByText('Equipo creado exitosamente')).toBeInTheDocument();
    expect(api.llamadasA('/crear-equipo')[0].cuerpo).toEqual({
      NombreEquipo: 'Andamio tubular',
      CategoriaEquipo: '4',
      PrecioVenta: null,
      PrecioAlquiler: 1500,
      PrecioReparacion: null,
      UsuarioCreacion: '1001',
      EstadoEquipo: '3',
      DocumentoSubarrendatario: '901893972-3',
      TipoDeEquipo: '1',
      UnidadDeMedida: '2',
      Bodega: '10',
      IdTipoBodega: 3,
    });
    expect(sockets[0].emit).toHaveBeenCalledWith('equipo-creado', {});
    expect(screen.getByLabelText('Nombre*')).toHaveValue('');
  });

  it('muestra el error al crear', async () => {
    simularApi({ ...catalogos, 'POST /crear-equipo': new ErrorApi('Duplicado') });
    const { user } = renderConProveedores(<FormularioCrearEquipo />, { usuario: null });
    await waitFor(() => comboPorEtiqueta(/^Referencia/));
    await llenarEquipoPropio(user);
    await user.click(screen.getByRole('button', { name: 'Crear equipo' }));
    expect(await screen.findByText('Error al crear equipo: Request failed with status code 400')).toBeInTheDocument();
  });

  it('muestra el error si un rechazo no es Error', async () => {
    simularApi({ ...catalogos, 'POST /crear-equipo': () => Promise.reject('texto') });
    const { user } = renderConProveedores(<FormularioCrearEquipo />);
    await waitFor(() => comboPorEtiqueta(/^Referencia/));
    await llenarEquipoPropio(user);
    await user.click(screen.getByRole('button', { name: 'Crear equipo' }));
    expect(await screen.findByText('Error al crear equipo: texto')).toBeInTheDocument();
  });

  it.each([
    ['GET /listar-clientes', 'Error al cargar subarrendatarios'],
    ['GET /listar-categorias', 'Error al cargar categorías'],
    ['GET /listar-estados', 'Error al cargar estados'],
    ['GET /listar-tipo-de-equipos', 'Error al cargar tipos de equipos'],
    ['GET /listar-unidades-de-medida', 'Error al listar las unidades de medida'],
  ])('informa si falla %s', async (ruta, mensaje) => {
    simularApi({ ...catalogos, [ruta]: new ErrorApi('caído') });
    renderConProveedores(<FormularioCrearEquipo />);
    expect(await screen.findByText(mensaje)).toBeInTheDocument();
  });

  it('registra el error de bodegas sin alertar', async () => {
    simularApi({ ...catalogos, 'GET /listar-bodegas-subarrendatario': new ErrorApi('caído') });
    renderConProveedores(<FormularioCrearEquipo />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al listar las bodegas')));
  });
});

describe('FormularioEditarEquipo', () => {
  const rutas = {
    'GET /listar-categorias': [{ value: 4, label: 'Andamios' }, { value: 5, label: 'Formaletas' }],
    'GET /listar-subarrendatarios': [{ value: '800', label: 'Sub S.A.S' }],
    'GET /listar-estados': [{ value: 3, label: 'Disponible' }, { value: 4, label: 'No disponible' }],
    'GET /ver-equipo/*': [
      { Nombre: 'Andamio', IdCategoria: 4, PrecioVenta: 10, PrecioAlquiler: 20, PrecioReparacion: 30, IdEstado: 3, DocumentoSubarrendatario: '800' },
    ],
  };

  async function abrir(extra = {}) {
    const api = simularApi({ ...rutas, ...extra });
    const sendMessage = vi.fn();
    const onMostrarMensaje = vi.fn();
    const utilidades = renderConProveedores(<FormularioEditarEquipo IdEquipo={9} sendMessage={sendMessage} onMostrarMensaje={onMostrarMensaje} />);
    await utilidades.user.click(screen.getByTitle('Editar'));
    return { ...utilidades, api, sendMessage, onMostrarMensaje };
  }

  it('precarga el equipo y guarda los cambios', async () => {
    const { user, api, sendMessage, onMostrarMensaje } = await abrir();
    await waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue('Andamio'));
    expect(api.llamadasA('/ver-equipo/9')).toHaveLength(1);
    expect(comboPorEtiqueta('Referencia')).toHaveTextContent('Andamios');
    await user.clear(screen.getByLabelText('Precio Alquiler'));
    await user.type(screen.getByLabelText('Precio Alquiler'), '25');
    await elegirOpcion(user, 'Referencia', 'Formaletas');
    await elegirOpcion(user, 'Estado', 'No disponible');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith('Equipo actualizado correctamente', 'success'));
    expect(api.llamadasA('/actualizar-equipo')[0].cuerpo).toEqual({
      NombreEquipo: 'Andamio',
      CategoriaEquipo: 5,
      PrecioVenta: 10,
      PrecioAlquiler: '25',
      PrecioReparacion: 30,
      EstadoEquipo: 4,
      DocumentoSubarrendatario: '800',
      IdEquipo: 9,
    });
    expect(sendMessage).toHaveBeenCalledWith('equipo-actualizado', {});
  });

  it('informa errores al cargar y al guardar', async () => {
    const { user, onMostrarMensaje, sendMessage } = await abrir({
      'GET /ver-equipo/*': new ErrorApi('no existe'),
      'PUT /actualizar-equipo': new ErrorApi('falló'),
    });
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error al cargar datos')));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalledWith(expect.stringContaining('Error al actualizar el equipo'), 'error'));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('se cierra con la X pero no con Escape', async () => {
    const { user } = await abrir();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Actualizar Equipo')).toBeInTheDocument();
    const cerrar = screen.getAllByRole('button').find((b) => !b.textContent && b.closest('[role="presentation"]'))!;
    await user.click(cerrar);
    await waitFor(() => expect(screen.queryByText('Actualizar Equipo')).not.toBeInTheDocument());
  });
});

describe('TablaVisualizarEquipos', () => {
  const equipos = [
    { IdEquipo: 1, NombreEquipo: 'Andamio', CategoriaEquipo: 'A', Cantidad: 3, Estado: ' disponible ' },
    { IdEquipo: 2, NombreEquipo: 'Formaleta', CategoriaEquipo: 'F', Cantidad: 1, Estado: 'No disponible' },
    { IdEquipo: 3, NombreEquipo: 'Mezcladora', CategoriaEquipo: 'M', Cantidad: 1, Estado: 'Reparación' },
    { IdEquipo: 4, NombreEquipo: 'Raro', CategoriaEquipo: 'R', Cantidad: 1, Estado: 'Otro' },
  ];

  it('normaliza el estado y lo colorea', async () => {
    simularApi({ 'GET /ver-equipos': paginar(equipos) });
    renderConProveedores(<TablaVisualizarEquipos />);
    expect(await screen.findByText('Andamio')).toBeInTheDocument();
    expect(screen.getByText('Disponible').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
    expect(screen.getByText('No disponible').closest('.MuiChip-root')).toHaveClass('MuiChip-colorError');
    expect(screen.getByText('En reparación').closest('.MuiChip-root')).toHaveClass('MuiChip-colorWarning');
    expect(screen.getByText('Otro').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault');
  });

  it('no recarga con remision-anulada: use-WebSocket no escucha ese evento (defecto conocido)', async () => {
    const api = simularApi({ 'GET /ver-equipos': paginar(equipos) });
    renderConProveedores(<TablaVisualizarEquipos />);
    await screen.findByText('Andamio');
    act(() => emitirDesdeServidor('remision-anulada', {}));
    await new Promise((r) => setTimeout(r, 50));
    expect(api.llamadasA('/ver-equipos')).toHaveLength(1);
  });

  it.each(['equipo-actualizado', 'equipo-creado', 'remision-creada'])('recarga con %s', async (evento) => {
    const api = simularApi({ 'GET /ver-equipos': paginar(equipos) });
    renderConProveedores(<TablaVisualizarEquipos />);
    await screen.findByText('Andamio');
    act(() => emitirDesdeServidor('devolucion-creada', {}));
    act(() => emitirDesdeServidor(evento, {}));
    await waitFor(() => expect(api.llamadasA('/ver-equipos')).toHaveLength(2));
  });

  it('muestra el error de la consulta y el mensaje de edición', async () => {
    simularApi({ 'GET /ver-equipos': new ErrorApi('caído') });
    renderConProveedores(<TablaVisualizarEquipos />);
    expect(await screen.findByText('Error al cargar los equipos: Error: caído')).toBeInTheDocument();
  });

  it('el mensaje de edición aparece en la tabla', async () => {
    simularApi({ 'GET /ver-equipos': paginar(equipos.slice(0, 1)), 'GET /ver-equipo/*': [{ Nombre: 'Andamio', IdCategoria: 1, IdEstado: 3 }] });
    const { user } = renderConProveedores(<TablaVisualizarEquipos />);
    await user.click(await screen.findByTitle('Editar'));
    await user.click(await screen.findByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Equipo actualizado correctamente')).toBeInTheDocument();
  });
});

describe('ConsultarUbicacionEquipo', () => {
  const listado = [
    { IdEquipo: 1, NombreEquipo: 'Andamio', CategoriaEquipo: 'Andamios' },
    { IdEquipo: 2, NombreEquipo: 'Formaleta' },
  ];
  const ficha = {
    IdEquipo: 1,
    NombreEquipo: 'Andamio',
    Categoria: 'Andamios',
    TipoDeEquipo: 'Propio',
    UnidadDeMedida: 'Unidad',
    Bodega: 'Norte',
    Estado: 'Disponible',
    Propietario: '',
    CantidadTotal: 10,
    CantidadDisponible: 4,
    CantidadEnObra: 8,
    CantidadEnObraPropia: 6,
    CantidadEnObraSubarrendada: 2,
    Subarrendatarios: [{ Documento: '800', Nombre: 'Sub S.A.S', Contacto: '300', CantidadEnObra: 2 }],
  };
  const ubicacion = {
    IdDetalleRemision: 1,
    IdRemision: 1,
    NoRemision: 'R-1',
    DocumentoCliente: '900',
    Cliente: 'Constructora Andes',
    TelefonoCliente: '601',
    CelularCliente: null,
    IdProyecto: 1,
    Proyecto: 'Torre 1',
    DireccionProyecto: '',
    FechaRemision: '2026-01-01',
    FechaRemisionTexto: '01/01/2026',
    FechaRemisionCompleta: '',
    DiasEnObra: 95,
    CantidadPrestada: 8,
    CantidadDevuelta: 2,
    CantidadEnObra: 6,
    FechaUltimaDevolucion: null,
    EsPropio: true,
    DocumentoSubarrendatario: null,
    Subarrendatario: null,
    ContactoSubarrendatario: null,
  };
  const ubicacionSub = {
    ...ubicacion,
    IdDetalleRemision: 2,
    NoRemision: 'R-2',
    CelularCliente: '310',
    DireccionProyecto: 'Calle 5',
    FechaRemisionCompleta: '1 de enero',
    DiasEnObra: 1,
    CantidadDevuelta: 0,
    CantidadEnObra: 2,
    EsPropio: false,
    DocumentoSubarrendatario: '800',
    Subarrendatario: 'Sub S.A.S',
    ContactoSubarrendatario: 'Pedro',
  };

  async function elegirEquipo(user: ReturnType<typeof renderConProveedores>['user'], nombre: string) {
    await user.click(screen.getByRole('combobox', { name: 'Equipo' }));
    await user.click(await screen.findByRole('option', { name: new RegExp(nombre) }));
  }

  it('invita a seleccionar un equipo y lista los equipos', async () => {
    const api = simularApi({ 'GET /ver-equipos': listado });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    expect(screen.getByText('Selecciona un equipo')).toBeInTheDocument();
    await waitFor(() => expect(api.llamadasA('/ver-equipos')).toHaveLength(1));
    await user.click(screen.getByRole('combobox', { name: 'Equipo' }));
    expect(await screen.findByText('Andamios')).toBeInTheDocument();
    await user.type(screen.getByRole('combobox', { name: 'Equipo' }), 'zzz');
    expect(screen.getByText('No hay equipos que coincidan')).toBeInTheDocument();
  });

  it('muestra la ficha, el desglose de subarriendo y dónde está', async () => {
    const api = simularApi({
      'GET /ver-equipos': listado,
      'GET /ver-ubicacion-equipo/*': { Equipo: ficha, Ubicaciones: [ubicacion, ubicacionSub] },
    });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    await elegirEquipo(user, 'Andamio');
    expect(await screen.findByText('Arrendado · 8 en obra')).toBeInTheDocument();
    expect(api.llamadasA('/ver-ubicacion-equipo/1')).toHaveLength(1);
    expect(screen.getByText('Andamios · Propio')).toBeInTheDocument();
    expect(screen.getByText('6 propias')).toBeInTheDocument();
    expect(screen.getByText('2 de subarriendo')).toBeInTheDocument();
    expect(screen.getByText('2 de las 8 unidades en obra son de subarriendo')).toBeInTheDocument();
    expect(screen.getByText(/este tercero/)).toBeInTheDocument();
    expect(screen.getByText('2 unidades en obra')).toBeInTheDocument();
    expect(screen.getByText('2 ubicaciones con unidades pendientes de devolución.')).toBeInTheDocument();
    // Tarjetas (móvil) y tabla (escritorio) se renderizan a la vez.
    expect(screen.getAllByText('3 meses y 5 días')).toHaveLength(2);
    expect(screen.getAllByText('1 día')).toHaveLength(2);
    expect(screen.getAllByText('3 meses y 5 días')[0].closest('.MuiChip-root')).toHaveClass('MuiChip-colorWarning');
    expect(screen.getByText('Remisionadas 8 · 2 devueltas')).toBeInTheDocument();
    expect(screen.getAllByText('900 · 601').length).toBeGreaterThan(0);
    expect(screen.getAllByText('de Sub S.A.S')).toHaveLength(2);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it.each([
    [0, 'Hoy'],
    [12, '12 días'],
    [30, '1 mes'],
    [61, '2 meses y 1 día'],
  ])('%i días en obra se muestran como "%s"', async (DiasEnObra, texto) => {
    simularApi({
      'GET /ver-equipos': listado,
      'GET /ver-ubicacion-equipo/*': {
        Equipo: { ...ficha, CantidadEnObra: 1, CantidadEnObraPropia: 1, CantidadEnObraSubarrendada: 0, Subarrendatarios: [] },
        Ubicaciones: [{ ...ubicacion, DiasEnObra }],
      },
    });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    await elegirEquipo(user, 'Andamio');
    expect(await screen.findByText('Una ubicación con unidades pendientes de devolución.')).toBeInTheDocument();
    expect(screen.getAllByText(texto)).toHaveLength(2);
    expect(screen.getByText('1 propia')).toBeInTheDocument();
  });

  it('una sola unidad de subarriendo y varios terceros', async () => {
    simularApi({
      'GET /ver-equipos': listado,
      'GET /ver-ubicacion-equipo/*': {
        Equipo: {
          ...ficha,
          CantidadEnObraSubarrendada: 1,
          Subarrendatarios: [
            { Documento: '800', Nombre: 'Sub', Contacto: null, CantidadEnObra: 1 },
            { Documento: '801', Nombre: 'Otro', Contacto: null, CantidadEnObra: 0 },
          ],
        },
        Ubicaciones: [ubicacion],
      },
    });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    await elegirEquipo(user, 'Andamio');
    expect(await screen.findByText('1 de las 8 unidades en obra es de subarriendo')).toBeInTheDocument();
    expect(screen.getByText(/estos terceros/)).toBeInTheDocument();
    expect(screen.getByText('1 unidad en obra')).toBeInTheDocument();
  });

  it('equipo sin unidades en obra', async () => {
    simularApi({
      'GET /ver-equipos': listado,
      'GET /ver-ubicacion-equipo/*': {
        Equipo: { ...ficha, CantidadEnObra: 0, CantidadEnObraPropia: 0, CantidadEnObraSubarrendada: 0, Subarrendatarios: [] },
        Ubicaciones: [],
      },
    });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    await elegirEquipo(user, 'Formaleta');
    expect(await screen.findByText('Disponible · sin unidades en obra')).toBeInTheDocument();
    expect(screen.getByText(/Este equipo no tiene unidades en obra/)).toBeInTheDocument();
  });

  it('distingue un equipo inexistente (404) de otros fallos y limpia al deseleccionar', async () => {
    const api = simularApi({ 'GET /ver-equipos': listado, 'GET /ver-ubicacion-equipo/*': new ErrorApi('no existe', 404) });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    await elegirEquipo(user, 'Andamio');
    expect(await screen.findByText('El equipo seleccionado ya no existe.')).toBeInTheDocument();
    api.definir({ 'GET /ver-ubicacion-equipo/*': new ErrorApi('caído', 500) });
    await elegirEquipo(user, 'Formaleta');
    expect(await screen.findByText('No se pudo consultar la ubicación del equipo. Inténtalo de nuevo.')).toBeInTheDocument();
    await user.click(screen.getByTitle('Clear'));
    expect(await screen.findByText('Selecciona un equipo')).toBeInTheDocument();
  });

  it('informa si no puede cargar el listado (o llega algo que no es lista)', async () => {
    simularApi({ 'GET /ver-equipos': new ErrorApi('caído') });
    const { unmount } = renderConProveedores(<ConsultarUbicacionEquipo />);
    expect(await screen.findByText('No se pudo cargar el listado de equipos.')).toBeInTheDocument();
    unmount();
    simularApi({ 'GET /ver-equipos': { raro: true } });
    const { user } = renderConProveedores(<ConsultarUbicacionEquipo />);
    await user.click(screen.getByRole('combobox', { name: 'Equipo' }));
    expect(await screen.findByText('No hay equipos que coincidan')).toBeInTheDocument();
  });
});
