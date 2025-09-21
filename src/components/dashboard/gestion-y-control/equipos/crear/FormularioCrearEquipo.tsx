'use client';

import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { CrearEquipo } from '@/services/gestionycontrol/equipos/CrearEquipoService';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarTiposDeEquipos } from '@/services/generales/ListarTiposDeEquiposService';
import { ListarUnidadesDeMedida } from '@/services/generales/ListarUnidadesDeMedidaService';
import { ListarBodegasPorSubarrendatario } from '@/services/generales/ListarBodegasPorSubarrendatarioService';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type { SelectChangeEvent } from '@mui/material/Select';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';

interface OpcionSelect {
    value: string | number;
    label: string;
}

interface FormData {
    NombreEquipo: string;
    CategoriaEquipo: string;
    PrecioVenta: number | null;
    PrecioAlquiler: number | null;
    PrecioReparacion: number | null;
    UsuarioCreacion: string | null;
    EstadoEquipo: string;
    Cantidad: number | null;
    DocumentoSubarrendatario: string;
    TipoDeEquipo: string;
    UnidadDeMedida: string;
    Bodega: string;
}

interface ErrorForm {
    NombreEquipo?: string;
    CategoriaEquipo?: string;
    PrecioAlquiler?: string;
    EstadoEquipo?: string;
    Cantidad?: string;
    DocumentoSubarrendatario?: string;
    TipoDeEquipo?: string;
    Bodega?: string;
    [key: string]: string | undefined;
}

const REGLAS_VALIDACION = [
    {
        campo: 'CategoriaEquipo',
        mensaje: 'La referencia es obligatoria',
        esOpcional: false
    },
    {
        campo: 'NombreEquipo',
        mensaje: 'El nombre es obligatorio.',
        esOpcional: false
    },
    {
        campo: 'Cantidad',
        mensaje: 'La cantidad es obligatoria y debe ser mayor a 0',
        esOpcional: false,
        validacion: (valor: number | null) => valor !== null && valor > 0
    },
    {
        campo: 'PrecioAlquiler',
        mensaje: 'El precio de alquiler es obligatorio y debe ser mayor a 0',
        esOpcional: false,
        validacion: (valor: number | null) => valor !== null && valor > 0
    },
    // {
    //     campo: 'DocumentoSubarrendatario',
    //     mensaje: 'El subarrendatario es obligatorio.',
    //     esOpcional: true
    // },
    {
        campo: 'DocumentoSubarrendatario',
        mensaje: 'El subarrendatario es obligatorio.',
        esOpcional: (tipoEquipo: string) => tipoEquipo !== '2', // Solo obligatorio si TipoDeEquipo === '2'
    },
    {
        campo: 'PrecioVenta',
        mensaje: 'Debe ser mayor o igual a 0',
        esOpcional: true,
        validacion: (valor: number | null) => valor === null || valor >= 0
    },
    {
        campo: 'PrecioReparacion',
        mensaje: 'Debe ser mayor o igual a 0',
        esOpcional: true,
        validacion: (valor: number | null) => valor === null || valor >= 0
    },
    {
        campo: 'EstadoEquipo',
        mensaje: 'El estado es obligatorio',
        esOpcional: false
    },
    {
        campo: 'TipoDeEquipo',
        mensaje: 'El tipo de equipo es obligatorio',
        esOpcional: false
    },
    {
        campo: 'UnidadDeMedida',
        mensaje: 'La unidad de medida es obligatoria',
        esOpcional: false
    },
    {
        campo: 'Bodega',
        mensaje: 'La bodega es obligatoria',
        esOpcional: false
    }
];

export function FormularioCrearEquipo(): React.JSX.Element {
    // Contexto y hooks
    const { user } = useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user?.documento ?? null;
    const { sendMessage } = useSocketIO();

    // Estados
    const [formData, setFormData] = useState<FormData>({
        NombreEquipo: '',
        CategoriaEquipo: '0',
        PrecioVenta: null,
        PrecioAlquiler: null,
        PrecioReparacion: null,
        UsuarioCreacion: documentoUsuarioActivo,
        EstadoEquipo: '0',
        Cantidad: null,
        DocumentoSubarrendatario: 'ABC',
        // TipoDeEquipo: 'ABC',
        TipoDeEquipo: '1',
        UnidadDeMedida: '0',
        Bodega: '123'
    });

    const [tipoDeEquipoSeleccionado, setTipoDeEquipoSeleccionado] = useState('');

    const [errores, setErrores] = useState<ErrorForm>({});
    const [alerta, setAlerta] = useState({
        mostrar: false,
        mensaje: '',
        tipo: 'success' as 'success' | 'error'
    });

    const [cargando, setCargando] = useState(false);
    const [subarrendatarios, setSubarrendatarios] = useState<OpcionSelect[]>([]);
    const [categorias, setCategorias] = useState<OpcionSelect[]>([]);
    const [estados, setEstados] = useState<OpcionSelect[]>([]);
    const [tiposDeEquipos, setTiposDeEquipos] = useState<OpcionSelect[]>([]);
    const [unidadesDeMedida, setUnidadesDeMedida] = useState<OpcionSelect[]>([]);
    const [bodegas, setBodegas] = useState<OpcionSelect[]>([]);

    // Handlers
    const handleChange = useCallback((e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let valorFinal: string | number | null = value;

        // Convertir campos numéricos
        if (['PrecioVenta', 'PrecioAlquiler', 'PrecioReparacion', 'Cantidad'].includes(name)) {
            valorFinal = value === '' ? null : Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: valorFinal
        }));

        // Validación en tiempo real
        validarCampo(name, valorFinal);
    }, []);

    // const validarCampo = useCallback((campo: string, valor: any) => {
    //     const regla = REGLAS_VALIDACION.find(r => r.campo === campo);
    //     if (!regla) return;

    //     let error = '';

    //     // Validación para campos obligatorios
    //     if (!regla.esOpcional && (valor === '0' || valor === '' || valor === null || valor === undefined)) {
    //         error = regla.mensaje;
    //     }
    //     // Validación personalizada si existe
    //     else if (regla.validacion && !regla.validacion(valor)) {
    //         error = regla.mensaje;
    //     }

    //     setErrores(prev => ({ ...prev, [campo]: error }));
    // }, []);

    const validarCampo = useCallback((campo: string, valor: any) => {
        const regla = REGLAS_VALIDACION.find(r => r.campo === campo);
        if (!regla) return;

        let error = '';

        // Determinar si es obligatorio
        const esObligatorio = typeof regla.esOpcional === 'function'
            ? !regla.esOpcional(String(formData.TipoDeEquipo)) // pasar como string
            : !regla.esOpcional;

        if (esObligatorio && (valor === '0' || valor === 'ABC' || valor === '' || valor === null || valor === undefined)) {
            error = regla.mensaje;
        } else if (regla.validacion && !regla.validacion(valor)) {
            error = regla.mensaje;
        }

        setErrores(prev => ({ ...prev, [campo]: error }));
    }, [formData]);


    const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
    }, []);

    // Validación del formulario
    // const validarFormulario = useCallback((): boolean => {
    //     const nuevosErrores: ErrorForm = {};
    //     let valido = true;

    //     REGLAS_VALIDACION.forEach(regla => {
    //         const valorCampo = formData[regla.campo as keyof FormData];

    //         // Validación para campos obligatorios
    //         if (!regla.esOpcional && (valorCampo === '0' || valorCampo === '' || valorCampo === null || valorCampo === undefined)) {
    //             nuevosErrores[regla.campo] = regla.mensaje;
    //             valido = false;
    //         }

    //         // Validación personalizada si existe
    //         if (regla.validacion && !regla.validacion(valorCampo as never)) {
    //             nuevosErrores[regla.campo] = regla.mensaje;
    //             valido = false;
    //         }
    //     });

    //     setErrores(nuevosErrores);
    //     return valido;
    // }, [formData]);

    const validarFormulario = useCallback((): boolean => {
        const nuevosErrores: ErrorForm = {};
        let valido = true;

        REGLAS_VALIDACION.forEach(regla => {
            const valorCampo = formData[regla.campo as keyof FormData];
            const esObligatorio = typeof regla.esOpcional === 'function'
                ? !regla.esOpcional(String(formData.TipoDeEquipo))
                : !regla.esOpcional;

            if (esObligatorio && (valorCampo === '0' || valorCampo === 'ABC' || valorCampo === '' || valorCampo === null)) {
                nuevosErrores[regla.campo] = regla.mensaje;
                valido = false;
            }

            if (regla.validacion && !regla.validacion(valorCampo as never)) {
                nuevosErrores[regla.campo] = regla.mensaje;
                valido = false;
            }
        });

        setErrores(nuevosErrores);
        return valido;
    }, [formData]);


    // Carga de datos
    const cargarSubarrendatarios = useCallback(async () => {
        try {
            const data = await ListarSubarrendatarios();
            data.unshift(
                { value: 'ABC', label: 'Sin seleccionar' }
            );
            setSubarrendatarios(data);
        } catch (error) {
            console.error('Error al listar subarrendatarios:', error);
            mostrarMensaje('Error al cargar subarrendatarios', 'error');
        }
    }, [mostrarMensaje]);

    const cargarCategorias = useCallback(async () => {
        try {
            const data = await ListarCategorias();
            data.unshift(
                { value: 0, label: 'Sin seleccionar' }
            );
            setCategorias(data);
        } catch (error) {
            console.error('Error al listar categorías:', error);
            mostrarMensaje('Error al cargar categorías', 'error');
        }
    }, [mostrarMensaje]);

    const cargarEstados = useCallback(async () => {
        try {
            const data = await ListarEstados();
            const estadosPermitidos = new Set(['disponible', 'no disponible', 'reparación']);
            const estadosFiltrados = data.filter((item: any) =>
                estadosPermitidos.has(item.label.toLowerCase().trim())
            );
            estadosFiltrados.unshift(
                { value: 0, label: 'Sin seleccionar' }
            );
            setEstados(estadosFiltrados);
        } catch (error) {
            console.error('Error al listar estados:', error);
            mostrarMensaje('Error al cargar estados', 'error');
        }
    }, [mostrarMensaje]);

    const cargarTiposDeEquipos = useCallback(async () => {
        try {
            const data = await ListarTiposDeEquipos();
            data.unshift(
                { value: 'ABC', label: 'Sin seleccionar' }
            );
            setTiposDeEquipos(data);
        } catch (error) {
            console.error('Error al listar los tipos de equipos:', error);
            mostrarMensaje('Error al cargar tipos de equipos', 'error');
        }
    }, [mostrarMensaje]);

    const cargarUnidadesDeMedida = useCallback(async () => {
        try {
            const data = await ListarUnidadesDeMedida();
            data.unshift(
                { value: 0, label: 'Sin seleccionar' }
            );
            setUnidadesDeMedida(data);
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
            mostrarMensaje('Error al listar las unidades de medida', 'error');
        }
    }, [mostrarMensaje]);

    const cargarBodegas = useCallback(async (Documento: string) => {
        try {
            const data = await ListarBodegasPorSubarrendatario(Documento);
            data.unshift(
                { value: '123', label: 'Sin seleccionar' }
            );
            setBodegas(data);
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
        }
    }, [mostrarMensaje]);

    // Creación del equipo
    const handleCrearEquipo = useCallback(async () => {
        if (!validarFormulario()) {
            mostrarMensaje('Por favor complete todos los campos requeridos correctamente', 'error');
            return;
        }

        try {
            setCargando(true);
            await CrearEquipo(formData);
            sendMessage('equipo-creado', {});
            mostrarMensaje('Equipo creado exitosamente', 'success');

            // Resetear formulario
            setFormData({
                NombreEquipo: '',
                CategoriaEquipo: '0',
                PrecioVenta: null,
                PrecioAlquiler: null,
                PrecioReparacion: null,
                UsuarioCreacion: documentoUsuarioActivo,
                EstadoEquipo: '0',
                Cantidad: null,
                DocumentoSubarrendatario: 'ABC',
                TipoDeEquipo: 'ABC',
                UnidadDeMedida: '0',
                Bodega: '123'
            });
        } catch (error) {
            mostrarMensaje(`Error al crear equipo: ${error instanceof Error ? error.message : String(error)}`, 'error');
        } finally {
            setCargando(false);
        }
    }, [formData, validarFormulario, sendMessage, documentoUsuarioActivo, mostrarMensaje]);

    // Efectos para cargar datos iniciales
    useEffect(() => {
        cargarSubarrendatarios();
        cargarCategorias();
        cargarEstados();
        cargarTiposDeEquipos();
        cargarUnidadesDeMedida();
        cargarBodegas('0');
    }, [cargarSubarrendatarios, cargarCategorias, cargarEstados, cargarTiposDeEquipos, cargarUnidadesDeMedida, cargarBodegas]);

    // Efectos para mostrar u ocultar el select de subarrendatarios, dependiendo del tipo de equipo
    const tipoDeEquipoSeleccionadoRef = useRef(formData.TipoDeEquipo);
    // useEffect(() => {
    //     tipoDeEquipoSeleccionadoRef.current = formData.TipoDeEquipo;
    //     const NuevoValor = tipoDeEquipoSeleccionadoRef.current;
    //     console.log(NuevoValor);
    //     setTipoDeEquipoSeleccionado(String(NuevoValor));
    //     if (NuevoValor === '1') {
    //         const nuevoFormData = {
    //             ...formData,
    //             DocumentoSubarrendatario: '0'
    //         };
    //         setFormData(nuevoFormData);
    //         cargarBodegas(nuevoFormData.DocumentoSubarrendatario);
    //     } else {
    //         cargarBodegas(formData.DocumentoSubarrendatario);
    //     }
    // }, [formData.TipoDeEquipo, formData.DocumentoSubarrendatario]);

    const isFirstRender = useRef(true);

    // useEffect(() => {
    //     if (isFirstRender.current) {
    //         isFirstRender.current = false;
    //         return; // Evita ejecución en el montaje inicial
    //     }

    //     tipoDeEquipoSeleccionadoRef.current = formData.TipoDeEquipo;
    //     const NuevoValor = tipoDeEquipoSeleccionadoRef.current;
    //     console.log(NuevoValor);
    //     setTipoDeEquipoSeleccionado(String(NuevoValor));

    //     // if (NuevoValor == '1') {
    //     //     // const nuevoFormData = {
    //     //     //     ...formData,
    //     //     //     DocumentoSubarrendatario: '0'
    //     //     // };
    //     //     // setFormData(nuevoFormData);
    //     //     cargarBodegas('0');
    //     // } else if (NuevoValor == '2') {
    //     //     cargarBodegas(formData.DocumentoSubarrendatario);
    //     //     setBodegas([{ value: '0', label: 'Sin seleccionar' }]);
    //     // } else {
    //     //     setBodegas([{ value: '0', label: 'Sin seleccionar' }]);
    //     // }

    //     cargarBodegas('0');
    //     setBodegas([{ value: '123', label: 'Sin seleccionar' }]);
    // }, [formData.TipoDeEquipo, formData.DocumentoSubarrendatario]);

    return (
        <Card>
            <Typography variant="subtitle1" sx={{
                color: 'text.primary',
                padding: '5px',
                fontWeight: 'normal'
            }}>
                Creación de equipo
            </Typography>

            <Divider />

            <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5} display="none">
                        <InputSelect
                            required
                            label="Tipo Equipo"
                            value={formData.TipoDeEquipo}
                            options={tiposDeEquipos}
                            size="small"
                            onChange={handleChange}
                            valorname="TipoDeEquipo"
                            error={!!errores.TipoDeEquipo}
                            helperText={errores.TipoDeEquipo}
                        />
                    </Grid>

                    {tipoDeEquipoSeleccionado === '2' && (
                        <Grid md={4} xs={12} mt={0.5}>
                            <InputSelect
                                required
                                label="Subarrendatario"
                                value={formData.DocumentoSubarrendatario}
                                options={subarrendatarios}
                                size="small"
                                onChange={handleChange}
                                valorname="DocumentoSubarrendatario"
                                error={!!errores.DocumentoSubarrendatario}
                                helperText={errores.DocumentoSubarrendatario}
                            />
                        </Grid>
                    )}

                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            required
                            label="Bodega"
                            value={formData.Bodega}
                            options={bodegas}
                            size="small"
                            onChange={handleChange}
                            valorname="Bodega"
                            error={!!errores.Bodega}
                            helperText={errores.Bodega}
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            required
                            label="Referencia"
                            value={formData.CategoriaEquipo}
                            options={categorias}
                            size="small"
                            onChange={handleChange}
                            valorname="CategoriaEquipo"
                            error={!!errores.CategoriaEquipo}
                            helperText={errores.CategoriaEquipo}
                        />
                    </Grid>

                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Nombre*"
                            value={formData.NombreEquipo}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="NombreEquipo"
                            error={!!errores.NombreEquipo}
                            helperText={errores.NombreEquipo}
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            required
                            label="Unidad Medida"
                            value={formData.UnidadDeMedida}
                            options={unidadesDeMedida}
                            size="small"
                            onChange={handleChange}
                            valorname="UnidadDeMedida"
                            error={!!errores.UnidadDeMedida}
                            helperText={errores.UnidadDeMedida}
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label="Cantidad*"
                            value={formData.Cantidad ?? ''}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="Cantidad"
                            // inputProps={{ min: 1 }}
                            minimalongitud={1}
                            error={!!errores.Cantidad}
                            helperText={errores.Cantidad}
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label="Precio Venta"
                            value={formData.PrecioVenta ?? ''}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="PrecioVenta"
                            // inputProps={{ min: 0 }}
                            minimalongitud={0}
                            error={!!errores.PrecioVenta}
                            helperText={errores.PrecioVenta}
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label="Precio Alquiler*"
                            value={formData.PrecioAlquiler ?? ''}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="PrecioAlquiler"
                            // inputProps={{ min: 1 }}
                            minimalongitud={1}
                            error={!!errores.PrecioAlquiler}
                            helperText={errores.PrecioAlquiler}
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label="Precio Reparación"
                            value={formData.PrecioReparacion ?? ''}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="PrecioReparacion"
                            // inputProps={{ min: 0 }}
                            minimalongitud={0}
                            error={!!errores.PrecioReparacion}
                            helperText={errores.PrecioReparacion}
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            required
                            label="Estado"
                            value={formData.EstadoEquipo}
                            options={estados}
                            size="small"
                            onChange={handleChange}
                            valorname="EstadoEquipo"
                            error={!!errores.EstadoEquipo}
                            helperText={errores.EstadoEquipo}
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleCrearEquipo}
                    disabled={cargando}
                >
                    {cargando ? 'Creando...' : 'Crear equipo'}
                </Button>
            </CardActions>

            <MensajeAlerta
                open={alerta.mostrar}
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))}
            />
        </Card>
    );
}