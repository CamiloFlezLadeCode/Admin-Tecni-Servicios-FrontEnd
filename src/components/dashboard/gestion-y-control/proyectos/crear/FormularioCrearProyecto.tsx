// 'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { UserContext } from '@/contexts/user-context';
// import { ListarClientes } from '@/services/generales/ListarClientesService';
// import { CrearProyecto } from '@/services/gestionycontrol/proyectos/CrearProyectoService';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
// import Divider from '@mui/material/Divider';
// import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
// import Grid from '@mui/material/Unstable_Grid2';
// import * as React from 'react';
// import { Typography } from '@mui/material';



// const EstadoProyecto = [
//     { value: '1', label: 'Activo' },
//     { value: '2', label: 'Inactivo' },
// ]

// const Clientess = [
//     { id: '100', value: '1', label: 'Emrpesa1' },
//     { id: '101', value: '2', label: 'Empresa2' },
// ]

// interface Client {
//     IdCliente: number;
//     DocumentoCliente: string;
//     NombreCliente: string;
// };

// export function FormularioCrearProyecto(): React.JSX.Element {
//     // Consumir el contexto del usuario
//     const { user } = React.useContext(UserContext) || { user: null };
//     // Obtener el nombre del usuario, si existe
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;
//     const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

//     //Implementación de WebSocket
//     const { sendMessage, messages } = useSocketIO();

//     //Se maneja el estado de todos los campos del formulario
//     const [datos, setDatos] = React.useState({
//         NombreProyecto: '',
//         DocumentoCliente: '333',
//         DireccionProyecto: '',
//         UsuarioCreacion: documentoUsuarioActivo,
//         EstadoProyecto: '1'
//     });

//     //Función para manejar el cambio en los inputs
//     const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setDatos((prevDatos) => ({
//             ...prevDatos,
//             [name]: value,
//         }));
//     };

//     // Crear una referencia para el FormularioValidator
//     const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);
//     const handleCrearProyecto = async () => {
//         //Se valida el formulario
//         const esValido = await formularioRef.current?.manejarValidacion();
//         if (esValido) {
//             let progressInterval: NodeJS.Timeout | null = null;
//             try {
//                 await CrearProyecto(datos);
//                 sendMessage('proyecto-creado', {});
//                 mostrarMensaje('Proyecto creado exitosamente', 'success');
//                 setDatos({
//                     NombreProyecto: '',
//                     DocumentoCliente: '333',
//                     DireccionProyecto: '',
//                     UsuarioCreacion: documentoUsuarioActivo,
//                     EstadoProyecto: '1'
//                 });
//             } catch (error) {
//                 mostrarMensaje(`Error al crear el proyecto: ${error}`, 'error');
//             }
//         }
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

//     const [Clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([{ value: '333', label: '' }]);
//     // const [Clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([{ value: 'ClienteX', label: 'ClienteX' }]);


//     //Se definen las reglas con su respectivo mensaje de alerta
//     const reglasValidacion = [
//         { campo: 'NombreProyecto', mensaje: 'El nombre del proyecto es obligatorio.' },
//         { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
//         { campo: 'DireccionProyecto', mensaje: 'La dirección es obligatoria.' },
//         { campo: 'EstadoProyecto', mensaje: 'El estado es obligatorio' },
//     ];
//     const manejarValidacionExitosa = () => {
//         // Lógica para manejar la validación exitosa
//         console.log("Validación exitosa. Procesar datos...", datos);
//     };


//     const Listar = async () => {
//         try {
//             const data = await ListarClientes();
//             // console.log(data);

//             // Verifica si los datos ya están en el formato correcto
//             setClientes(data); // Establece los datos directamente

//             // // Establece un valor por defecto basado en los datos de la base de datos
//             // if (data.length > 0) {
//             //     setValorSeleccionado(data[0].value); // Marca el primer cliente como seleccionado por defecto
//             // }
//         } catch (error) {
//             console.error('Error al listar clientes:', error);
//         }
//     };

//     // Llama a la función Listar cuando sea necesario, por ejemplo, en un useEffect
//     React.useEffect(() => {
//         Listar();
//     }, []);

//     return (
//         <Card>
//             {/* <CardHeader
//                 title="Creación de proyecto" size="small"
//                 sx={{
//                     fontSize: '0.875rem', // Tamaño de fuente más pequeño
//                     padding: '8px', // Espaciado interno más pequeño
//                 }}
//             /> */}
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de proyecto</Typography>

//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <Input
//                             label='Nombre'
//                             value={datos.NombreProyecto}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='NombreProyecto'
//                         />
//                     </Grid>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Empresa/Cliente'
//                             // value={String(valorSeleccionado)}
//                             value={datos.DocumentoCliente}
//                             options={Clientes}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='DocumentoCliente'
//                         />
//                     </Grid>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <Input
//                             label='Dirección'
//                             value={datos.DireccionProyecto}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='DireccionProyecto'
//                         />
//                     </Grid>
//                     <Grid md={2} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Estado'
//                             value={datos.EstadoProyecto}
//                             options={EstadoProyecto}
//                             size='small'
//                             valorname='EstadoProyecto'
//                             // onChange={handleChangeEstado}
//                             onChange={handleChange}
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <Divider />
//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button variant="contained" onClick={handleCrearProyecto}>
//                     Crear proyecto
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

import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { CrearProyecto } from '@/services/gestionycontrol/proyectos/CrearProyectoService';
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

interface Cliente {
    value: string | number;
    label: string;
}

interface EstadoProyecto {
    value: string;
    label: string;
}

interface FormData {
    NombreProyecto: string;
    DocumentoCliente: string;
    DireccionProyecto: string;
    UsuarioCreacion: string | null;
    EstadoProyecto: string;
}

const ESTADOS_PROYECTO: EstadoProyecto[] = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
];

const REGLAS_VALIDACION = [
    { campo: 'NombreProyecto', mensaje: 'El nombre del proyecto es obligatorio.' },
    { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
    { campo: 'DireccionProyecto', mensaje: 'La dirección es obligatoria.' },
    { campo: 'EstadoProyecto', mensaje: 'El estado es obligatorio' },
];

export function FormularioCrearProyecto(): React.JSX.Element {
    const { user } = useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user?.documento ?? null;
    const { sendMessage } = useSocketIO();

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [formData, setFormData] = useState<FormData>({
        NombreProyecto: '',
        DocumentoCliente: '',
        DireccionProyecto: '',
        UsuarioCreacion: documentoUsuarioActivo,
        EstadoProyecto: '1'
    });

    const [alerta, setAlerta] = useState({
        mostrar: false,
        mensaje: '',
        tipo: 'success' as 'success' | 'error'
    });

    const [errores, setErrores] = useState<Record<string, string>>({});
    const formularioRef = useRef<{ manejarValidacion: () => boolean }>(null);

    const handleChange = useCallback((e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error cuando el usuario escribe
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    }, [errores]);

    const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
    }, []);

    const validarFormulario = useCallback((): boolean => {
        const nuevosErrores: Record<string, string> = {};
        let valido = true;

        REGLAS_VALIDACION.forEach(regla => {
            if (!formData[regla.campo as keyof FormData]) {
                nuevosErrores[regla.campo] = regla.mensaje;
                valido = false;
            }
        });

        setErrores(nuevosErrores);
        return valido;
    }, [formData]);

    const listarClientes = useCallback(async () => {
        try {
            const data = await ListarClientes();
            setClientes(data);
        } catch (error) {
            console.error('Error al listar clientes:', error);
            mostrarMensaje('Error al cargar clientes', 'error');
        }
    }, [mostrarMensaje]);

    const handleCrearProyecto = useCallback(async () => {
        // Validación manual antes de proceder
        if (!validarFormulario()) {
            mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        try {
            await CrearProyecto(formData);
            sendMessage('proyecto-creado', {});

            mostrarMensaje('Proyecto creado exitosamente', 'success');

            setFormData({
                NombreProyecto: '',
                DocumentoCliente: '',
                DireccionProyecto: '',
                UsuarioCreacion: documentoUsuarioActivo,
                EstadoProyecto: '1'
            });
        } catch (error) {
            mostrarMensaje(`Error al crear el proyecto: ${error instanceof Error ? error.message : String(error)}`, 'error');
        }
    }, [formData, validarFormulario, sendMessage, documentoUsuarioActivo, mostrarMensaje]);

    useEffect(() => {
        listarClientes();
    }, [listarClientes]);

    return (
        <Card>
            <Typography variant='subtitle1' sx={{ color: 'text.primary', padding: '5px', fontWeight: 'normal' }}>
                Creación de proyecto
            </Typography>

            <Divider />

            <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Nombre"
                            value={formData.NombreProyecto}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="NombreProyecto"
                            error={!!errores.NombreProyecto}
                            helperText={errores.NombreProyecto}
                            required
                        />
                    </Grid>

                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            label="Empresa/Cliente"
                            value={formData.DocumentoCliente}
                            options={clientes}
                            size="small"
                            onChange={handleChange}
                            valorname="DocumentoCliente"
                            error={!!errores.DocumentoCliente}
                            helperText={errores.DocumentoCliente}
                            required
                        />
                    </Grid>

                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Dirección"
                            value={formData.DireccionProyecto}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="DireccionProyecto"
                            error={!!errores.DireccionProyecto}
                            helperText={errores.DireccionProyecto}
                            required
                        />
                    </Grid>

                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label="Estado"
                            value={formData.EstadoProyecto}
                            options={ESTADOS_PROYECTO}
                            size="small"
                            valorname="EstadoProyecto"
                            onChange={handleChange}
                            error={!!errores.EstadoProyecto}
                            helperText={errores.EstadoProyecto}
                            required
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearProyecto}>
                    Crear proyecto
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