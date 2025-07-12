// 'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import { Typography } from '@mui/material';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Divider from '@mui/material/Divider';
// import { SelectChangeEvent } from '@mui/material/Select';
// import Grid from '@mui/material/Unstable_Grid2';
// import * as React from 'react';
// import { CrearRepuesto } from '@/services/gestionycontrol/repuestos/CrearRepuestoService';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { UserContext } from '@/contexts/user-context';
// import { useSocketIO } from '@/hooks/use-WebSocket';

// const EstadoRespuesto = [
//     { value: '3', label: 'Disponible' },
//     { value: '4', label: 'No disponible' }
// ];


// const REGLAS_VALIDACION = [
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
//     { campo: '', mensaje: '' },
// ]

// interface ErrorForm {
//     NombreEquipo?: string;
//     CategoriaEquipo?: string;
//     PrecioAlquiler?: string;
//     EstadoEquipo?: string;
//     [key: string]: string | undefined;
// }

// export function FormularioCrearRepuesto(): React.JSX.Element {
//     // Consumir el contexto del usuario y se extrae el documento del usuario activo
//     const { user } = React.useContext(UserContext) || { user: null };
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;
//     // ...

//     //Se crea es el estado para todos los campos del formulario
//     const [datos, setDatos] = React.useState({
//         NombreRepuesto: '',
//         Cantidad: 0,
//         UsuarioCreacion: documentoUsuarioActivo,
//         Estado: ''
//     });
//     // ...

//     //Se maneja el cambio de todos los campos del formulario
//     const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setDatos((prevDatos) => ({
//             ...prevDatos,
//             [name]: value,
//         }));
//     };
//     // ...

//     //Se implementan estados para mostrar alertas
//     const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
//     const [mensajeAlerta, setMensajeAlerta] = React.useState('');
//     const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
//     // ...

//     //Se crea funcionalidad para mostrar las elertas con pasado de parámetros
//     const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
//         setMensajeAlerta(mensaje);
//         setTipoAlerta(tipo);
//         setMostrarAlertas(true);
//     };
//     // ...

//     //Se implementa referencia al formulario validador
//     const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);
//     //Se definen las reglas con su respectivo mensaje de alerta
//     const reglasValidacion = [
//         { campo: 'NombreRepuesto', mensaje: 'El nombre del repuesto es obligatorio.' },
//         { campo: 'Cantidad', mensaje: 'La cantidad es obligatoria.' },
//         { campo: 'Estado', mensaje: 'El estado es obligatorio.' },
//     ];
//     const manejarValidacionExitosa = () => {
//         // Lógica para manejar la validación exitosa
//         console.log("Validación exitosa. Procesar datos...", datos);
//     };
//     // ...

//     // Función para validar formulario
//     const ValidarFormulario = React.useCallback((): boolean => {
//         const NuevosErrores: ErrorForm = {};
//         let Valido = true;

//         REGLAS_VALIDACION.forEach(regla => {
//             const ValorCampo = datos[regla.campo]
//         })
//         // Validación de campos obligatorios
//         if (!reg)
//         return Valido;
//     }, [datos])
//     // ...

//     // Implementación de WebSocket
//     const { sendMessage, messages } = useSocketIO();
//     // ...

//     //Se maneja la creación del respuesto
//     const HandleCrearRepuesto = async () => {
//         //Se valida el formulario
//         const esValido = await formularioRef.current?.manejarValidacion();
//         if (esValido) {
//             try {
//                 const Respuesta = await CrearRepuesto(datos);
//                 if (Respuesta) {
//                     mostrarMensaje('Repuesto creado correctamente.', 'success');
//                     sendMessage('repuesto-creado', {});
//                 }
//                 setDatos({
//                     NombreRepuesto: '',
//                     Cantidad: 0,
//                     UsuarioCreacion: documentoUsuarioActivo,
//                     Estado: ''
//                 })
//             } catch (error) {
//                 mostrarMensaje(`Error al crear el repuesto. Error: ${error}`, 'error');
//             }
//         }
//     };
//     // ...
//     return (
//         <Card>
//             {/* <CardHeader
//                 title="Creación de repuesto" size="small"
//                 sx={{
//                     fontSize: '0.875rem', // Tamaño de fuente más pequeño
//                     padding: '8px', // Espaciado interno más pequeño
//                 }}
//             /> */}
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de repuesto</Typography>
//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <Input
//                             label='Nombre'
//                             value={datos.NombreRepuesto}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='NombreRepuesto'
//                         />
//                     </Grid>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <Input
//                             label='Cantidad'
//                             value={datos.Cantidad}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='number'
//                             valorname='Cantidad'
//                         />
//                     </Grid>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Estado'
//                             value={datos.Estado}
//                             options={EstadoRespuesto}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='Estado'
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <Divider />
//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button variant="contained" onClick={HandleCrearRepuesto}>
//                     Crear repuesto
//                 </Button>
//                 <FormularioValidator
//                     ref={formularioRef}
//                     datos={datos}
//                     reglasValidacion={reglasValidacion}
//                     onValid={manejarValidacionExitosa}
//                 />
//             </CardActions>
//             <MensajeAlerta
//                 open={mostrarAlertas}
//                 tipo={tipoAlerta}
//                 mensaje={mensajeAlerta}
//                 onClose={() => setMostrarAlertas(false)}
//             />
//         </Card>
//     );
// }














'use client';

import React, { useState, useContext, useCallback, useRef } from 'react';
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


interface EstadoRepuesto {
    value: string;
    label: string;
}

interface FormData {
    NombreRepuesto: string;
    Cantidad: number;
    UsuarioCreacion: string | null;
    Estado: string;
}

interface ErrorForm {
    NombreRepuesto?: string;
    Cantidad?: string;
    Estado?: string;
    [key: string]: string | undefined;
}

const ESTADOS_REPUESTO: EstadoRepuesto[] = [
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
        Cantidad: 0,
        UsuarioCreacion: documentoUsuarioActivo,
        Estado: ''
    });

    const [errores, setErrores] = useState<ErrorForm>({});
    const [alerta, setAlerta] = useState({
        mostrar: false,
        mensaje: '',
        tipo: 'success' as 'success' | 'error'
    });

    const [cargando, setCargando] = useState(false);
    const formularioRef = useRef<{ manejarValidacion: () => boolean }>(null);

    // Reglas de validación
    const reglasValidacion = [
        { campo: 'NombreRepuesto', mensaje: 'El nombre del repuesto es obligatorio.' },
        {
            campo: 'Cantidad',
            mensaje: 'La cantidad debe ser mayor a 0.',
            validacion: (valor: number) => valor > 0
        },
        { campo: 'Estado', mensaje: 'El estado es obligatorio.' },
    ];

    // Handlers
    const handleChange = useCallback((e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const processedValue = name === 'Cantidad' ? Number(value) : value;

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Limpiar error al modificar el campo
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    }, [errores]);

    const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
    }, []);

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
            else if (!valorCampo && valorCampo !== 0) {
                nuevosErrores[regla.campo] = regla.mensaje;
                valido = false;
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
                Cantidad: 0,
                UsuarioCreacion: documentoUsuarioActivo,
                Estado: ''
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
                            value={formData.Cantidad}
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