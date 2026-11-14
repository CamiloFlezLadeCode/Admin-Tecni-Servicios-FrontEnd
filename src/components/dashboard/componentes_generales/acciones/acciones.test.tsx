import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/EliminarRegistro';
import { ModalEliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/eliminar_registro/EliminarRegistro';
import { GenerarPDF } from '@/components/dashboard/componentes_generales/acciones/GenerarPDF';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import CircularProgressWithLabel from '@/components/dashboard/componentes_generales/mensajedecarga/CircularProgressWithLabel';
import { navegacion } from '@test/mocks/next-navigation';
import { renderConProveedores, screen, waitFor } from '@test/utils';

const mensajes = { ariaLabel: 'Eliminar remisión', socket: 'remision-eliminada', info: '¿Eliminar la remisión?', exito: 'Remisión eliminada', error: 'No se pudo eliminar:' };

describe('EliminarRegistro', () => {
  function montar(servicio: (id: number | string) => Promise<string>) {
    const sendMessage = vi.fn();
    const mostrarMensaje = vi.fn();
    const utilidades = renderConProveedores(
      <EliminarRegistro
        servicioEliminarRegistro={servicio}
        idRecurso={15}
        sendMessage={sendMessage}
        mostrarMensaje={mostrarMensaje}
        mensajes={mensajes}
        TituloParaTooltip="Eliminar"
      />
    );
    return { ...utilidades, sendMessage, mostrarMensaje };
  }

  it('pide confirmación y al confirmar elimina, avisa por socket y muestra éxito', async () => {
    const servicio = vi.fn().mockResolvedValue('ok');
    const { user, sendMessage, mostrarMensaje } = montar(servicio);
    await user.click(screen.getByRole('button', { name: 'Eliminar remisión' }));
    expect(await screen.findByText('¿Eliminar la remisión?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sí' }));
    await waitFor(() => expect(mostrarMensaje).toHaveBeenCalledWith('Remisión eliminada', 'success'));
    expect(servicio).toHaveBeenCalledWith(15);
    expect(sendMessage).toHaveBeenCalledWith('remision-eliminada', {});
    await waitFor(() => expect(screen.queryByText('¿Eliminar la remisión?')).not.toBeInTheDocument());
  });

  it('si el servicio no confirma o falla muestra el error y no avisa por socket', async () => {
    for (const servicio of [vi.fn().mockResolvedValue(''), vi.fn().mockRejectedValue('raro')]) {
      const { user, sendMessage, mostrarMensaje, unmount } = montar(servicio);
      await user.click(screen.getByRole('button', { name: 'Eliminar remisión' }));
      await user.click(await screen.findByRole('button', { name: 'Sí' }));
      await waitFor(() => expect(mostrarMensaje).toHaveBeenCalled());
      expect(mostrarMensaje.mock.calls[0][1]).toBe('error');
      expect(mostrarMensaje.mock.calls[0][0]).toMatch(/^No se pudo eliminar: (No se pudo eliminar el registro|Error desconocido)$/);
      expect(sendMessage).not.toHaveBeenCalled();
      unmount();
    }
  });

  it('cancelar cierra el modal sin eliminar', async () => {
    const servicio = vi.fn();
    const { user } = montar(servicio);
    await user.click(screen.getByRole('button', { name: 'Eliminar remisión' }));
    await user.click(await screen.findByRole('button', { name: 'No' }));
    await waitFor(() => expect(screen.queryByText('¿Eliminar la remisión?')).not.toBeInTheDocument());
    expect(servicio).not.toHaveBeenCalled();
  });
});

describe('ModalEliminarRegistro', () => {
  it.each(['pequeno', 'mediano', 'grande'] as const)('tamaño %s: se cierra con la X y con Escape solo si se permite', async (tamaño) => {
    const onCerrar = vi.fn();
    const { user, unmount } = renderConProveedores(
      <ModalEliminarRegistro abrir titulo="Confirmar" onCerrar={onCerrar} onConfirmar={vi.fn()} tamaño={tamaño} />
    );
    await user.keyboard('{Escape}');
    expect(onCerrar).not.toHaveBeenCalled();
    await user.click(screen.getAllByRole('button')[0]);
    expect(onCerrar).toHaveBeenCalledTimes(1);
    unmount();

    const otro = vi.fn();
    const segundo = renderConProveedores(
      <ModalEliminarRegistro abrir titulo="Confirmar" onCerrar={otro} onConfirmar={vi.fn()} deshabilitarCierreExterno={false} />
    );
    await segundo.user.keyboard('{Escape}');
    expect(otro).toHaveBeenCalled();
  });

  it('deshabilita los botones mientras confirma', async () => {
    let terminar!: () => void;
    const onConfirmar = vi.fn(() => new Promise<void>((r) => (terminar = r)));
    const onCerrar = vi.fn();
    const { user } = renderConProveedores(
      <ModalEliminarRegistro abrir titulo="Confirmar" onCerrar={onCerrar} onConfirmar={onConfirmar} textoBotonConfirmar="Eliminar" textoBotonCancelar="Volver" />
    );
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByRole('button', { name: 'Volver' })).toBeDisabled();
    terminar();
    await waitFor(() => expect(onCerrar).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Volver' })).not.toBeDisabled();
  });
});

describe('GenerarPDF', () => {
  const agenteOriginal = navigator.userAgent;
  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', { value: agenteOriginal, configurable: true });
  });

  function montar(props: Partial<React.ComponentProps<typeof GenerarPDF>> = {}) {
    const onMostrarCarga = vi.fn();
    const onMostrarMensaje = vi.fn();
    const servicioPDF = vi.fn().mockResolvedValue(new Blob(['%PDF']));
    const utilidades = renderConProveedores(
      <GenerarPDF
        servicioPDF={servicioPDF}
        idRecurso={9}
        nombreArchivo="remision-9.pdf"
        mensajes={{ generando: 'Generando PDF', exito: 'Listo', error: 'Error al generar:' }}
        onMostrarCarga={onMostrarCarga}
        onMostrarMensaje={onMostrarMensaje}
        {...props}
      />
    );
    return { ...utilidades, onMostrarCarga, onMostrarMensaje, servicioPDF };
  }

  it('en escritorio imprime el PDF con un iframe oculto', async () => {
    const { user, onMostrarCarga, servicioPDF } = montar();
    await user.click(screen.getByTitle('Generar PDF: remision-9.pdf'));
    expect(onMostrarCarga).toHaveBeenCalledWith(true, 'Generando PDF');
    expect(servicioPDF).toHaveBeenCalledWith(9);
    await waitFor(() => expect(document.querySelector('iframe')).not.toBeNull());
    const iframe = document.querySelector('iframe')!;
    const print = vi.fn();
    Object.defineProperty(iframe, 'contentWindow', { value: { focus: vi.fn(), print } });
    iframe.onload?.(new Event('load'));
    expect(print).toHaveBeenCalled();
    expect(onMostrarCarga).toHaveBeenLastCalledWith(false);
    iframe.remove();
  });

  it('en móvil, o en modo descarga, descarga el archivo', async () => {
    Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla Android', configurable: true });
    const clic = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    for (const comportamiento of ['automatico', 'impresion', 'descarga'] as const) {
      const { user, unmount } = montar({ comportamiento });
      await user.click(screen.getByRole('button'));
      await waitFor(() => expect(clic).toHaveBeenCalled());
      clic.mockClear();
      unmount();
    }
  });

  it('en modo nueva pestaña abre el PDF', async () => {
    const { user } = montar({ comportamiento: 'nuevaPestana', icono: <Eye /> });
    await user.click(screen.getByRole('button'));
    await waitFor(() => expect(window.open).toHaveBeenCalledWith(expect.stringMatching(/^blob:/), '_blank'));
  });

  it('informa el error si el servicio falla o no devuelve PDF', async () => {
    for (const servicioPDF of [vi.fn().mockResolvedValue(null), vi.fn().mockRejectedValue('x')]) {
      const { user, onMostrarMensaje, onMostrarCarga, unmount } = montar({ servicioPDF });
      await user.click(screen.getByRole('button'));
      await waitFor(() => expect(onMostrarMensaje).toHaveBeenCalled());
      expect(onMostrarMensaje.mock.calls[0][0]).toMatch(/^Error al generar: (No se pudo generar el PDF|Error desconocido)$/);
      expect(onMostrarCarga).toHaveBeenLastCalledWith(false);
      unmount();
    }
  });

  it('funciona sin callbacks opcionales', async () => {
    const { user } = renderConProveedores(
      <GenerarPDF servicioPDF={vi.fn().mockRejectedValue(new Error('x'))} idRecurso={1} nombreArchivo="a.pdf" mensajes={{ generando: '', error: '' }} />
    );
    await user.click(screen.getByRole('button'));
    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});

describe('alertas, carga y NavBarLayout', () => {
  it('MensajeAlerta muestra el mensaje y se cierra', async () => {
    const onClose = vi.fn();
    const { user } = renderConProveedores(<MensajeAlerta open tipo="success" mensaje="Guardado" onClose={onClose} />);
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('MensajeDeCarga y CircularProgressWithLabel', () => {
    renderConProveedores(
      <>
        <MensajeDeCarga Mensaje="Cargando remisión" MostrarMensaje />
        <CircularProgressWithLabel value={41.6} />
      </>
    );
    expect(screen.getByText('Cargando remisión...')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('NavBarLayout resalta la sección activa', () => {
    navegacion.pathname = '/dashboard/inventario/equipos/stock';
    renderConProveedores(
      <NavBarLayout
        ItemsLayout={[
          { label: 'Stock', path: '/dashboard/inventario/equipos/stock', icon: Eye },
          { label: 'Entradas', path: '/dashboard/inventario/equipos/entradas', icon: Eye },
        ]}
      />
    );
    const enlaces = screen.getAllByRole('link');
    expect(enlaces.map((a) => a.getAttribute('href'))).toEqual([
      '/dashboard/inventario/equipos/stock',
      '/dashboard/inventario/equipos/entradas',
    ]);
    expect(enlaces[0].querySelector('button')).not.toBe(enlaces[1].querySelector('button'));
  });

  it('NavBarLayout: con rutaExacta no marca la sección padre en una subruta', () => {
    navegacion.pathname = '/dashboard/comercial/movimientos/detalle';
    const items = [{ label: 'Movimientos', path: '/dashboard/comercial/movimientos', icon: Eye }];
    const color = () => getComputedStyle(screen.getByRole('link')).backgroundColor;
    const { unmount } = renderConProveedores(<NavBarLayout ItemsLayout={items} />);
    const conSubrutas = color();
    unmount();
    const { container } = renderConProveedores(
      <NavBarLayout ItemsLayout={items} rutaExacta altoAutomatico sxEncabezado={{ zIndex: 5 }} sxBarra={{ minHeight: '64px' }} />
    );
    expect(color()).not.toBe(conSubrutas);
    expect((container.querySelector('.MuiCard-root') as HTMLElement).style.height).toBe('');
  });
});
