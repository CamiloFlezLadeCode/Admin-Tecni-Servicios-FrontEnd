'use client';
import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { CrearRepuesto } from '@/services/gestionycontrol/repuestos/CrearRepuestoService';
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
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { OpcionPorDefecto, OpcionPorDefectoNumber, ParametroBuscarBodegasRepuestos } from '@/lib/constants/option-default';
import { ListarBodegasPorTipo } from '@/services/generales/ListarBodegasPorTipoService';


interface EstadoRepuesto {
    value: string;
    label: string;
}

interface FormData {
    NombreRepuesto: string;
    Cantidad: number | null;
    UsuarioCreacion: string | null;
    Estado: string;
    Bodega: number;
}

interface ErrorForm {
    NombreRepuesto?: string;
    Cantidad?: string;
    Estado?: string;
    Bodega?: string;
    [key: string]: string | undefined;
}

const ESTADOS_REPUESTO: EstadoRepuesto[] = [
    OpcionPorDefecto,
    { value: '3', label: 'Disponible' },
    { value: '4', label: 'No disponible' }
];

export function FormularioCrearRepuesto(): React.JSX.Element {
    // Contexto y hooks
    const { user } = useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user?.documento ?? null;
    const { sendMessage } = useSocketIO();

    // Estados
    const [formData, setFormData] = useState<FormData>({
        NombreRepuesto: '',
        Cantidad: null,
        UsuarioCreacion: documentoUsuarioActivo,
        Estado: OpcionPorDefecto.value,
        Bodega: OpcionPorDefectoNumber.value
    });

    const [errores, setErrores] = useState<ErrorForm>({});
    const [alerta, setAlerta] = useState({
        mostrar: false,
        mensaje: '',
        tipo: 'success' as 'success' | 'error'
    });

    const [cargando, setCargando] = useState(false);
    const formularioRef = useRef<{ manejarValidacion: () => boolean }>(null);

    const [bodegasRepuestos, setBodegasRepuestos] = useState([]);

    // Reglas de validación
    const reglasValidacion = [
        { campo: 'NombreRepuesto', mensaje: 'El nombre del repuesto es obligatorio.' },
        {
            campo: 'Cantidad',
            mensaje: 'La cantidad debe ser mayor a 0.',
            validacion: (valor: number) => valor > 0
        },
        { campo: 'Estado', mensaje: 'El estado es obligatorio.' },
        { campo: 'Bodega', mensaje: 'La bodega es obligatoria' }
    ];

    // Cargar datos iniciales
    useEffect(() => {
        const ListarBodegasRepuestos = async () => {
            try {
                const Bodegas = await ListarBodegasPorTipo({ IdTipoBodega: ParametroBuscarBodegasRepuestos.value });
                Bodegas.unshift(OpcionPorDefectoNumber);
                setBodegasRepuestos(Bodegas);
            } catch (error) {
                console.error(`Error al describir la acción: ${error}`);
            }
        };
        ListarBodegasRepuestos();
    }, []);

    // Handlers
    // const handleChange = useCallback((e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     const processedValue = name === 'Cantidad' ? Number(value) : value;

    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: processedValue
    //     }));

    //     // Limpiar error al modificar el campo
    //     if (errores[name]) {
    //         setErrores(prev => ({ ...prev, [name]: '' }));
    //     }
    // }, [errores]);

    const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
    }, []);

    const handleChange = useCallback((e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const processedValue = name === 'Cantidad' || name === 'Bodega' ? Number(value) : value;

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Validar el campo inmediatamente después de cambiar
        const regla = reglasValidacion.find(r => r.campo === name);
        if (regla) {
            if (regla.validacion) {
                if (!regla.validacion(processedValue as never)) {
                    setErrores(prev => ({ ...prev, [name]: regla.mensaje }));
                } else {
                    setErrores(prev => ({ ...prev, [name]: '' }));
                }
            } else {
                // Validación básica para campos obligatorios
                const esValido = processedValue !== '' &&
                    processedValue !== null &&
                    processedValue !== undefined &&
                    processedValue !== 'SinSeleccionar' &&
                    processedValue !== '0' &&
                    processedValue !== 0;

                setErrores(prev => ({
                    ...prev,
                    [name]: esValido ? '' : regla.mensaje
                }));
            }
        }
    }, [reglasValidacion]);

    // Validación del formulario
    // const validarFormulario = useCallback((): boolean => {
    //     const nuevosErrores: ErrorForm = {};
    //     let valido = true;

    //     reglasValidacion.forEach(regla => {
    //         const valorCampo = formData[regla.campo as keyof FormData];

    //         // Validación personalizada si existe
    //         if (regla.validacion) {
    //             if (!regla.validacion(valorCampo as never)) {
    //                 nuevosErrores[regla.campo] = regla.mensaje;
    //                 valido = false;
    //             }
    //         }
    //         // Validación para campos obligatorios
    //         else if (!valorCampo && valorCampo !== 0 && valorCampo !== 'SinSeleccionar' ) {
    //             nuevosErrores[regla.campo] = regla.mensaje;
    //             valido = false;
    //         }
    //     });

    //     setErrores(nuevosErrores);
    //     return valido;
    // }, [formData]);
    // Validación del formulario

    const validarFormulario = useCallback((): boolean => {
        const nuevosErrores: ErrorForm = {};
        let valido = true;

        reglasValidacion.forEach(regla => {
            const valorCampo = formData[regla.campo as keyof FormData];

            // Validación personalizada si existe
            if (regla.validacion) {
                if (!regla.validacion(valorCampo as never)) {
                    nuevosErrores[regla.campo] = regla.mensaje;
                    valido = false;
                }
            }
            // Validación para campos obligatorios
            else {
                const esValorInvalido =
                    valorCampo === '' ||
                    valorCampo === null ||
                    valorCampo === undefined ||
                    valorCampo === 'SinSeleccionar' ||
                    valorCampo === '0' || // Para OpcionPorDefecto.value (string)
                    valorCampo === 0;     // Para OpcionPorDefectoNumber.value (number)

                if (esValorInvalido) {
                    nuevosErrores[regla.campo] = regla.mensaje;
                    valido = false;
                }
            }
        });

        setErrores(nuevosErrores);
        return valido;
    }, [formData]);

    // Creación del repuesto
    const handleCrearRepuesto = useCallback(async () => {
        if (!validarFormulario()) {
            mostrarMensaje('Por favor complete todos los campos requeridos correctamente', 'error');
            return;
        }

        try {
            setCargando(true);
            await CrearRepuesto(formData);
            sendMessage('repuesto-creado', {});
            mostrarMensaje('Repuesto creado exitosamente', 'success');

            // Resetear formulario
            setFormData({
                NombreRepuesto: '',
                Cantidad: null,
                UsuarioCreacion: documentoUsuarioActivo,
                Estado: OpcionPorDefecto.value,
                Bodega: OpcionPorDefectoNumber.value
            });
        } catch (error) {
            mostrarMensaje(`Error al crear repuesto: ${error instanceof Error ? error.message : String(error)}`, 'error');
        } finally {
            setCargando(false);
        }
    }, [formData, validarFormulario, sendMessage, documentoUsuarioActivo, mostrarMensaje]);

    const manejarValidacionExitosa = useCallback(() => {
        console.log("Datos válidos:", formData);
    }, [formData]);

    return (
        <Card>
            <Typography variant="subtitle1" sx={{
                color: 'text.primary',
                padding: '5px',
                fontWeight: 'normal'
            }}>
                Creación de repuesto
            </Typography>

            <Divider />

            <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            label="Bodega*"
                            value={formData.Bodega}
                            options={bodegasRepuestos}
                            size="small"
                            onChange={handleChange}
                            valorname="Bodega"
                            error={!!errores.Bodega}
                            helperText={errores.Bodega}
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Nombre*"
                            value={formData.NombreRepuesto}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="NombreRepuesto"
                            error={!!errores.NombreRepuesto}
                            helperText={errores.NombreRepuesto}
                        />
                    </Grid>

                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Cantidad*"
                            // value={Number(formData.Cantidad)}
                            value={formData.Cantidad === null ? '' : formData.Cantidad}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="Cantidad"
                            //   inputProps={{ min: 1 }}
                            minimalongitud={1}
                            error={!!errores.Cantidad}
                            helperText={errores.Cantidad}
                        />
                    </Grid>

                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            label="Estado*"
                            value={formData.Estado}
                            options={ESTADOS_REPUESTO}
                            size="small"
                            onChange={handleChange}
                            valorname="Estado"
                            error={!!errores.Estado}
                            helperText={errores.Estado}
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleCrearRepuesto}
                    disabled={cargando}
                >
                    {cargando ? 'Creando...' : 'Crear repuesto'}
                </Button>

                {/* <FormularioValidator
                    ref={formularioRef}
                    datos={formData}
                    reglasValidacion={reglasValidacion}
                    onValid={manejarValidacionExitosa}
                /> */}
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