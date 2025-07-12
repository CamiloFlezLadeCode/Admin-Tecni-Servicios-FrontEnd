// 'use client';

// import * as React from 'react';
// import { Card, Typography, Divider, CardContent, SelectChangeEvent, CardActions, Button } from '@mui/material';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import Grid from '@mui/material/Unstable_Grid2';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import { CrearVehiculo } from '@/services/gestionycontrol/vehiculos/CrearVehiculoService';
// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { UserContext } from '@/contexts/user-context';
// import { useSocketIO } from '@/hooks/use-WebSocket';

// const EstadoVehiculo = [
//     { value: 1, label: 'Activo' },
//     { value: 2, label: 'Inactivo' }
// ];

// export function FormularioCrearVehiculo(): React.JSX.Element {
//     // Consumir el contexto del usuario
//     const { user } = React.useContext(UserContext) || { user: null };
//     // Obtener el nombre del usuario, si existe
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;

//     const [datos, setDatos] = React.useState({
//         Placa: '',
//         IdEstado: '',
//         UsuarioCreacion: documentoUsuarioActivo
//     });
//     //Validación del formulario
//     const reglasValidacion = [
//         { campo: 'Placa', mensaje: 'La placa es obligatoria' },
//         { campo: 'IdEstado', mensaje: 'El estado es obligatorio' }
//     ];
//     const manejarValidacionExitosa = () => {
//         // Lógica para manejar la validación exitosa
//         console.log("Validación exitosa. Procesar datos...", datos);

//     };
//     const { sendMessage, messages } = useSocketIO();
//     const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
//     const HandleCrearVehiculo = async () => {
//         const esValido = await formularioRef.current?.manejarValidacion();
//         if (esValido) {
//             try {
//                 const result = await CrearVehiculo(datos);
//                 if (result) {
//                     sendMessage('vehiculo-creado', {});
//                     mostrarMensaje('Vehículo creado correctamente', 'success');
//                     setDatos({
//                         Placa: '',
//                         IdEstado: '',
//                         UsuarioCreacion: documentoUsuarioActivo
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error al crear el vehículo: ", error);
//                 mostrarMensaje(`Error al crear el vehículo ${error}`, 'error')
//             }
//         }
//     }
//     const handleChange = async (e: SelectChangeEvent<string | string[]> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
//         let { name, value } = e.target;
//         if (name === 'Placa' && typeof value === 'string') {
//             value = value.toUpperCase();
//         }
//         setDatos((prevDatos) => ({
//             ...prevDatos,
//             // [name]: value
//             [name ?? '']: value,
//         }));
//     };
//     // Dentro del estado:
//     const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
//     const [mensajeAlerta, setMensajeAlerta] = React.useState('');
//     const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

//     // Función para abrir alerta
//     const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
//         setMensajeAlerta(mensaje);
//         setTipoAlerta(tipo);
//         setMostrarAlertas(true);
//     };
//     return (
//         <Card>
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de vehículo</Typography>
//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <Input
//                             label='Placa'
//                             value={datos.Placa}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='Placa'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Estado'
//                             value={datos.IdEstado}
//                             options={EstadoVehiculo}
//                             size='small'
//                             valorname='IdEstado'
//                             // onChange={handleChangeEstado}
//                             onChange={handleChange}
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <Divider />
//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button variant="contained" onClick={HandleCrearVehiculo}>
//                     Crear vehículo
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
// };



'use client';

import * as React from 'react';
import { Card, Typography, Divider, CardContent, SelectChangeEvent, CardActions, Button } from '@mui/material';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import Grid from '@mui/material/Unstable_Grid2';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { CrearVehiculo } from '@/services/gestionycontrol/vehiculos/CrearVehiculoService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';

const EstadoVehiculo = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' }
];

interface FormData {
    Placa: string;
    IdEstado: string;
    UsuarioCreacion: string | null;
}

interface ErrorForm {
    Placa?: string;
    IdEstado?: string;
    [key: string]: string | undefined; // Firma de índice
}

export function FormularioCrearVehiculo(): React.JSX.Element {
    // Contexto y hooks
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const { sendMessage } = useSocketIO();

    // Estados
    const [formData, setFormData] = React.useState<FormData>({
        Placa: '',
        IdEstado: '',
        UsuarioCreacion: documentoUsuarioActivo
    });

    const [errores, setErrores] = React.useState<ErrorForm>({});
    const [alerta, setAlerta] = React.useState({
        mostrar: false,
        mensaje: '',
        tipo: 'success' as 'success' | 'error'
    });

    const [cargando, setCargando] = React.useState(false);

    // Reglas de validación
    const REGLAS_VALIDACION = [
        {
            campo: 'Placa',
            mensaje: 'La placa es obligatoria',
            esOpcional: false
        },
        {
            campo: 'IdEstado',
            mensaje: 'El estado es obligatorio',
            esOpcional: false
        }
    ];

    // Handlers
    const handleChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let valorFinal = value;

        // Convertir a mayúsculas para la placa
        if (name === 'Placa' && typeof value === 'string') {
            valorFinal = value.toUpperCase();
        }

        setFormData(prev => ({
            ...prev,
            [name]: valorFinal
        }));

        // Validación en tiempo real
        validarCampo(name, valorFinal);
    };

    const validarCampo = (campo: string, valor: any) => {
        const regla = REGLAS_VALIDACION.find(r => r.campo === campo);
        if (!regla) return;

        let error = '';

        // Validación para campos obligatorios
        if (!regla.esOpcional && (valor === '' || valor === null || valor === undefined)) {
            error = regla.mensaje;
        }

        setErrores(prev => ({ ...prev, [campo]: error }));
    };

    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
    };

    // Validación del formulario
    const validarFormulario = (): boolean => {
        const nuevosErrores: ErrorForm = {};
        let valido = true;

        REGLAS_VALIDACION.forEach(regla => {
            const valorCampo = formData[regla.campo as keyof FormData];

            // Validación para campos obligatorios
            if (!regla.esOpcional && (valorCampo === '' || valorCampo === null || valorCampo === undefined)) {
                nuevosErrores[regla.campo] = regla.mensaje;
                valido = false;
            }
        });

        setErrores(nuevosErrores);
        return valido;
    };

    // Creación del vehículo
    const handleCrearVehiculo = async () => {
        if (!validarFormulario()) {
            mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        try {
            setCargando(true);
            const result = await CrearVehiculo(formData);

            if (result) {
                sendMessage('vehiculo-creado', {});
                mostrarMensaje('Vehículo creado correctamente', 'success');

                // Resetear formulario
                setFormData({
                    Placa: '',
                    IdEstado: '',
                    UsuarioCreacion: documentoUsuarioActivo
                });
            }
        } catch (error) {
            console.error("Error al crear el vehículo: ", error);
            mostrarMensaje(`Error al crear el vehículo: ${error instanceof Error ? error.message : String(error)}`, 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <Card>
            <Typography variant="subtitle1" sx={{
                color: 'text.primary',
                padding: '5px',
                fontWeight: 'normal'
            }}>
                Creación de vehículo
            </Typography>

            <Divider />

            <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label="Placa*"
                            value={formData.Placa}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="Placa"
                            error={!!errores.Placa}
                            helperText={errores.Placa}
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Estado*"
                            value={formData.IdEstado}
                            options={EstadoVehiculo}
                            size="small"
                            onChange={handleChange}
                            valorname="IdEstado"
                            error={!!errores.IdEstado}
                            helperText={errores.IdEstado}
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleCrearVehiculo}
                    disabled={cargando}
                >
                    {cargando ? 'Creando...' : 'Crear vehículo'}
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