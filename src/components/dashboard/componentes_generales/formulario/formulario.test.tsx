import * as React from 'react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';

import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import InputText from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
import InputSelectConEstado from '@/components/dashboard/componentes_generales/formulario/SelectConEstado';
import SelectMultiple from '@/components/dashboard/componentes_generales/formulario/SelectMultiple';
import FormularioValidator, {
  type FormularioValidatorRef,
} from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { act, elegirOpcion, renderConProveedores, screen, waitFor, within } from '@test/utils';

describe('InputText', () => {
  it('muestra la etiqueta, el valor y notifica los cambios', async () => {
    const onChange = vi.fn();
    const { user } = renderConProveedores(
      <InputText label="Nombre" value="" tamano="small" tipo_input="text" valorname="Nombre" onChange={onChange} maximalongitud={5} />
    );
    const campo = screen.getByLabelText('Nombre');
    expect(campo).toHaveAttribute('name', 'Nombre');
    expect(campo).toHaveAttribute('maxLength', '5');
    await user.type(campo, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('textarea se renderiza multilínea, bloqueado y con texto de ayuda en error', () => {
    renderConProveedores(
      <InputText label="Obs" value="x" tamano="medium" tipo_input="textarea" bloqueado error helperText="Obligatorio" />
    );
    const campo = screen.getByLabelText('Obs');
    expect(campo.tagName).toBe('TEXTAREA');
    expect(campo).toBeDisabled();
    expect(screen.getByText('Obligatorio')).toHaveClass('Mui-error');
  });

  it('respeta el tipo numérico y sin texto de ayuda no lo pinta', () => {
    const { container } = renderConProveedores(<InputText label="Cant" value={1} tamano="small" tipo_input="number" />);
    expect(screen.getByLabelText('Cant')).toHaveAttribute('type', 'number');
    expect(container.querySelector('.MuiFormHelperText-root')).toBeNull();
  });
});

describe('InputSelect', () => {
  const opciones = [
    { value: 'SinSeleccionar', label: 'Sin seleccionar' },
    { value: 1, label: 'Activo' },
  ];

  it('lista las opciones y devuelve el valor elegido', async () => {
    const onChange = vi.fn();
    const { user } = renderConProveedores(<InputSelect label="Estado" value="SinSeleccionar" options={opciones} onChange={onChange} />);
    await elegirOpcion(user, 'Estado', 'Activo');
    expect(onChange.mock.calls[0][0].target.value).toBe(1);
  });

  it('muestra el texto de ayuda y se puede bloquear', () => {
    renderConProveedores(
      <InputSelect label="Estado" value={1} options={opciones} onChange={vi.fn()} bloqueado error helperText="Requerido" valorname="Est" />
    );
    expect(screen.getByRole('combobox', { name: 'Estado' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Requerido')).toBeInTheDocument();
  });
});

describe('SelectConBuscador', () => {
  const opciones = [
    { value: 'a', label: 'Alfa' },
    { value: 'b', label: 'Beta' },
  ];

  it('filtra por texto y devuelve value y name', async () => {
    const onChange = vi.fn();
    const { user } = renderConProveedores(
      <SelectConBuscador label="Cliente" value="" options={opciones} onChange={onChange} valorname="Cliente" />
    );
    await user.type(screen.getByLabelText('Cliente'), 'bet');
    const lista = await screen.findByRole('listbox');
    expect(within(lista).queryByText('Alfa')).not.toBeInTheDocument();
    await user.click(within(lista).getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'b', name: 'Cliente' } });
  });

  it('muestra la opción seleccionada y al limpiar devuelve vacío', async () => {
    const onChange = vi.fn();
    const { user } = renderConProveedores(<SelectConBuscador label="Cliente" value="a" options={opciones} onChange={onChange} />);
    expect(screen.getByLabelText('Cliente')).toHaveValue('Alfa');
    await user.click(screen.getByTitle('Clear'));
    expect(onChange).toHaveBeenCalledWith({ target: { value: '', name: undefined } });
  });

  it('usa el value como etiqueta si falta el label', () => {
    renderConProveedores(<SelectConBuscador label="X" value={3} options={[{ value: 3, label: '' }]} onChange={vi.fn()} bloqueado />);
    expect(screen.getByLabelText('X')).toHaveValue('3');
    expect(screen.getByLabelText('X')).toBeDisabled();
  });
});

describe('InputSelectConEstado', () => {
  it('solo permite elegir equipos disponibles', async () => {
    const onChange = vi.fn();
    const { user } = renderConProveedores(
      <InputSelectConEstado
        label="Equipo"
        value=""
        onChange={onChange}
        options={[
          { value: 1, label: 'Taladro', estado: 'Disponible' },
          { value: 2, label: 'Pulidora', estado: 'No disponible' },
          { value: 3, label: 'Andamio', estado: 'Reparación' },
        ]}
      />
    );
    await user.click(screen.getByRole('combobox', { name: 'Equipo' }));
    const lista = await screen.findByRole('listbox');
    expect(within(lista).getByRole('option', { name: 'Pulidora' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(lista).getByRole('option', { name: 'Andamio' })).toHaveAttribute('aria-disabled', 'true');
    await user.click(within(lista).getByRole('option', { name: 'Taladro' }));
    expect(onChange.mock.calls[0][0].target.value).toBe(1);
  });
});

describe('SelectMultiple', () => {
  it('muestra los seleccionados como chips con su etiqueta', async () => {
    const onChange = vi.fn();
    const { user } = renderConProveedores(
      <SelectMultiple
        label="Roles"
        value={['1', 'x']}
        onChange={onChange}
        options={[
          { value: '1', label: 'Administrador' },
          { value: '2', label: 'Bodeguero' },
        ]}
      />
    );
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Bodeguero'));
    expect(onChange.mock.calls[0][0].target.value).toEqual(['1', 'x', '2']);
  });
});

describe('FormularioValidator', () => {
  async function validar(datos: Record<string, unknown>, reglas: { campo: string; mensaje: string }[]) {
    const ref = React.createRef<FormularioValidatorRef>();
    renderConProveedores(<FormularioValidator ref={ref} datos={datos} reglasValidacion={reglas} />);
    let valido: unknown;
    await act(async () => {
      valido = await ref.current!.manejarValidacion();
    });
    return valido;
  }

  it('es válido cuando todos los campos tienen valor', async () => {
    expect(await validar({ Nombre: 'Ana', Celular: '3001234567', Correo: 'a@b.co' }, [
      { campo: 'Nombre', mensaje: 'Falta nombre' },
      { campo: 'Celular', mensaje: 'Celular inválido' },
      { campo: 'Correo', mensaje: 'Correo inválido' },
    ])).toBe(true);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([null, undefined, '', 'SinSeleccionar', 0])('considera vacío el valor %s', async (valor) => {
    expect(await validar({ Campo: valor }, [{ campo: 'Campo', mensaje: 'Falta campo' }])).toBe(false);
    expect(await screen.findByText('Falta campo')).toBeInTheDocument();
  });

  it('valida celular de 10 dígitos y formato de correo', async () => {
    expect(
      await validar({ CelularUsuario: '123', CorreoUsuario: 'malo' }, [
        { campo: 'CelularUsuario', mensaje: 'Celular inválido' },
        { campo: 'CorreoUsuario', mensaje: 'Correo inválido' },
      ])
    ).toBe(false);
    expect(await screen.findByText('Celular inválido')).toBeInTheDocument();
    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
  });

  it('exige al menos un rol', async () => {
    expect(await validar({ Roles: [] }, [{ campo: 'Roles', mensaje: 'Elija un rol' }])).toBe(false);
  });

  it('Garantia solo admite 0 o 1 (0 no es "vacío")', async () => {
    expect(await validar({ Garantia: 0 }, [{ campo: 'Garantia', mensaje: 'Garantía' }])).toBe(true);
    expect(await validar({ Garantia: 1 }, [{ campo: 'Garantia', mensaje: 'Garantía' }])).toBe(true);
    expect(await validar({ Garantia: 'SinSeleccionar' }, [{ campo: 'Garantia', mensaje: 'Garantía' }])).toBe(false);
  });

  it('IncluyeTransporte solo falla con null o SinSeleccionar (0 es válido)', async () => {
    expect(await validar({ IncluyeTransporte: 0 }, [{ campo: 'IncluyeTransporte', mensaje: 'Transporte' }])).toBe(true);
    expect(await validar({ IncluyeTransporte: null }, [{ campo: 'IncluyeTransporte', mensaje: 'Transporte' }])).toBe(false);
    expect(await validar({ IncluyeTransporte: 'SinSeleccionar' }, [{ campo: 'IncluyeTransporte', mensaje: 'Transporte' }])).toBe(false);
  });

  it('la alerta se cierra con su botón pero no con un clic afuera', async () => {
    const ref = React.createRef<FormularioValidatorRef>();
    const { user } = renderConProveedores(
      <FormularioValidator ref={ref} datos={{ A: '' }} reglasValidacion={[{ campo: 'A', mensaje: 'Falta A' }]} />
    );
    await act(async () => {
      await ref.current!.manejarValidacion();
    });
    expect(await screen.findByText('Falta A')).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.getByText('Falta A')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => expect(screen.queryByText('Falta A')).not.toBeInTheDocument());
  });
});

describe('FechayHora', () => {
  it('muestra la fecha con el formato colombiano de 12 horas', () => {
    renderConProveedores(<FechayHora label="Fecha salida" value={dayjs('2026-03-05T14:30:00')} onChange={vi.fn()} required />);
    expect(screen.getByLabelText(/Fecha salida/)).toHaveValue('05/03/2026 02:30 PM');
  });

  it('usa la etiqueta por defecto y puede deshabilitarse', () => {
    renderConProveedores(<FechayHora disabled />);
    expect(screen.getAllByText('Fecha y hora').length).toBeGreaterThan(0);
  });
});
