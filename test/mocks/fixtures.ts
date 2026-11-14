/**
 * Respuestas con la forma real del backend para los endpoints que los componentes
 * leen sin validar (p. ej. `respuesta[0].SiguienteNoRemision`).
 */
export const resumenDashboard = {
  TotalClientes: 12,
  Proyectos: { Total: 8, Activos: 5 },
  Inventario: { OK: 30, Bajo: 4, Agotado: 2 },
  TopClientes: [
    { DocumentoCliente: '900', Cliente: 'Constructora Andes', CantidadRemisiones: 7, CantidadDevoluciones: 3, Total: 10 },
    { DocumentoCliente: '901', Cliente: 'Obras del Valle', CantidadRemisiones: 2, CantidadDevoluciones: 1, Total: 3 },
  ],
  SerieUltimos6Meses: {
    FechaInicio: '2026-06-01',
    FechaFinExclusiva: '2026-12-01',
    Meses: [
      { Mes: '2026-10', Etiqueta: 'Oct', CantidadRemisiones: 4, CantidadDevoluciones: 2, CantidadOrdenesDeServicio: 1 },
      { Mes: '2026-11', Etiqueta: 'Nov', CantidadRemisiones: 6, CantidadDevoluciones: 3, CantidadOrdenesDeServicio: 2 },
    ],
    Totales: { CantidadRemisiones: 10, CantidadDevoluciones: 5, CantidadOrdenesDeServicio: 3 },
  },
  TotalesMesActual: {
    Mes: '2026-11',
    FechaInicio: '2026-11-01',
    FechaFinExclusiva: '2026-12-01',
    Totales: { CantidadRemisiones: 6, CantidadDevoluciones: 3, CantidadOrdenesDeServicio: 2 },
    TotalMovimientos: 11,
  },
  ActividadReciente: {
    Limite: 10,
    Cantidad: 2,
    Movimientos: [
      {
        TipoMovimiento: 'REMISION',
        IdMovimiento: 1,
        NoMovimiento: 'R-0001',
        Cliente: 'Constructora Andes',
        Proyecto: 'Torre 1',
        CreadoPor: 'Ana',
        Estado: 'Creado',
        FechaCreacion: '2026-11-10T10:00:00',
      },
      {
        TipoMovimiento: 'DEVOLUCION',
        IdMovimiento: 2,
        NoMovimiento: 'D-0001',
        Cliente: 'Obras del Valle',
        Proyecto: 'Puente',
        CreadoPor: 'Ana',
        Estado: 'Anulado',
        FechaCreacion: '2026-11-11T11:00:00',
      },
    ],
  },
};

/** Endpoints con forma fija que deben responder siempre algo coherente. */
export const rutasBase = {
  'GET /siguiente-no-remision': [{ SiguienteNoRemision: 'R-0042' }],
  'GET /siguiente-no-devolucion': [{ SiguienteNoDevolucion: 'D-0042' }],
  'GET /siguiente-no-orden-de-servicio': [{ SiguienteNoOrdenDeServicio: 'OS-0042' }],
  'GET /siguiente-no-entrada-equipos': [{ SiguienteNoEntradaEquipo: 42 }],
  'GET /siguiente-no-salida-equipos': [{ SiguienteNoSalidaEquipo: 42 }],
  'GET /siguiente-no-entrada-repuestos': [{ SiguienteNoEntradaRepuesto: 42 }],
  'GET /siguiente-no-salida-repuestos': [{ SiguienteNoSalidaRepuesto: 42 }],
  'GET /resumen-dashboard': resumenDashboard,
} as const;
