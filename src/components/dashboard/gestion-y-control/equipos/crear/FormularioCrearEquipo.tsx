// 'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { UserContext } from '@/contexts/user-context';
// import { CrearEquipo } from '@/services/gestionycontrol/equipos/CrearEquipoService';
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
// import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
// import { ListarEstados } from '@/services/generales/ListarEstadosService';

// const Caracteristica = [
//     { value: '1', label: 'Alquiler' },
//     { value: '2', label: 'Venta' },
//     { value: '3', label: 'Reparación' },
// ]


// export function FormularioCrearEquipo(): React.JSX.Element {
//     // Consumir el contexto del usuario
//     const { user } = React.useContext(UserContext) || { user: null };
//     // Obtener el nombre del usuario, si existe
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;

//     //Arreglo para manejar el estado de todos los campos
//     const [datos, setDatos] = React.useState({
//         NombreEquipo: '',
//         CategoriaEquipo: '1',
//         PrecioVenta: '',
//         PrecioAlquiler: '',
//         PrecioReparacion: '',
//         UsuarioCreacion: documentoUsuarioActivo,
//         EstadoEquipo: '3',
//         Cantidad: 1,
//         DocumentoSubarrendatario: ''
//     });

//     //Se definen las reglas con su respectivo mensaje de alerta
//     const reglasValidacion = [
//         { campo: 'NombreEquipo', mensaje: 'El nombre es obligatorio.' },
//         { campo: 'CategoriaEquipo', mensaje: 'La categoria es obligatoria.' },
//         { campo: 'PrecioAlquiler', mensaje: 'El precio de alquiler es obligatorio.' },
//         // { campo: 'PrecioReparacion', mensaje: 'El precio de reparación es obligatorio.' },
//         { campo: 'EstadoEquipo', mensaje: 'El estado es obligatorio.' },
//     ];

//     const manejarValidacionExitosa = () => {
//         // Lógica para manejar la validación exitosa
//         console.log("Validación exitosa. Procesar datos...", datos);
//     };

//     // Crear una referencia para el FormularioValidator
//     const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);

//     const [progress, setProgress] = React.useState(0);
//     const [cargando, setCargando] = React.useState<boolean>(false);
//     //Se implementa el uso del websocket
//     const { sendMessage, messages } = useSocketIO();
//     // ...
//     const handleCrearEquipo = async () => {
//         // Validar formulario
//         const esValido = await formularioRef.current?.manejarValidacion();

//         if (esValido) {
//             let progressInterval: NodeJS.Timeout | null = null;
//             try {
//                 setCargando(true);
//                 // Lógica del progreso
//                 let progreso = 0;
//                 progressInterval = setInterval(() => {
//                     if (progreso < 80) {
//                         progreso += 10;
//                         setProgress(progreso);
//                     }
//                 }, 20000);

//                 // Hacer la petición de crear cliente
//                 // const data = await crearCliente(datos);
//                 const data = await CrearEquipo(datos);
//                 clearInterval(progressInterval); // Limpiar intervalo
//                 setProgress(100);
//                 sendMessage('equipo-creado', {});
//                 mostrarMensaje('Equipo creado exitosamente', 'success');

//                 // Limpiar formulario
//                 setDatos({
//                     NombreEquipo: '',
//                     CategoriaEquipo: '1',
//                     PrecioVenta: '',
//                     PrecioAlquiler: '',
//                     PrecioReparacion: '',
//                     UsuarioCreacion: documentoUsuarioActivo,
//                     EstadoEquipo: '3',
//                     Cantidad: 1,
//                     DocumentoSubarrendatario: ''
//                 });
//             } catch (error) {
//                 if (progressInterval) clearInterval(progressInterval); // Limpiar
//                 setProgress(0); // Resetear el progreso
//                 mostrarMensaje(`Error al crear el cliente: ${error}`, 'error');
//             } finally {
//                 setCargando(false);
//             }
//         }
//     };

//     // Función para verificar si el cliente ya existe
//     // const verificarClienteExistente = async (identificacion: string) => {
//     //     if (!identificacion) return; // Si no hay identificación, no consultar

//     //     const result = await verificarClienteExistenteService(identificacion);

//     //     if (result) {
//     //         mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
//     //         console.log('Cliente encontrado:');
//     //     };
//     // };

//     //Función para manejar el cambio en los inputs
//     const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setDatos((prevDatos) => ({
//             ...prevDatos,
//             [name]: value,
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

//     //Llenado para el select del subarrendatario
//     const [subarrendatario, setSubarrendatario] = React.useState<{ value: string | number; label: string }[]>([]);
//     const CargarSubarrendatarios = async () => {
//         try {
//             const Subarrendatarios = await ListarSubarrendatarios();
//             setSubarrendatario(Subarrendatarios);
//         } catch (error) {
//             console.error('Error al listar los subarrendatarios: ', error);
//         }
//     };
//     //...

//     //Llenado para el select de referencia/familia del equipo
//     const [categorias, setCategorias] = React.useState<{ value: string | number; label: string }[]>([]);
//     const CargarReferencias = async () => {
//         try {
//             const Referencias_Categorias = await ListarCategorias();
//             setCategorias(Referencias_Categorias);
//         } catch (error) {
//             console.error('Error al listar las referencias: ', error);
//         }
//     };
//     // ...

//     //Llenado para el select de los estados
//     const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);
//     const CargarEstados = async () => {
//         try {
//             const Estados = await ListarEstados();
//             console.log(Estados);
//             const estadosPermitidos = new Set(['disponible', 'no disponible', 'reparación']);
//             const NuevosEstados = Estados.filter((element: any) =>
//                 estadosPermitidos.has(element.label.toLowerCase().trim())
//             );
//             setEstados(NuevosEstados);
//         } catch (error) {
//             console.error('Error al listar los estados: ', error);
//         }
//     };
//     // ...

//     React.useEffect(() => {
//         CargarSubarrendatarios();
//         CargarReferencias();
//         CargarEstados();
//     }, []);

//     return (
//         <Card>
//             {/* <CardHeader
//                 title="Creación de equipo"
//                 sx={{
//                     fontSize: '0.875rem', // Tamaño de fuente más pequeño
//                     padding: '8px', // Espaciado interno más pequeño
//                 }}
//             /> */}
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de equipo</Typography>
//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Referencia'
//                             value={datos.CategoriaEquipo}
//                             options={categorias}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='CategoriaEquipo'
//                         />
//                     </Grid>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <Input
//                             label='Nombre'
//                             value={datos.NombreEquipo}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='NombreEquipo'
//                         />
//                     </Grid>
//                     <Grid md={2} xs={12} mt={0.5}>
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
//                     <Grid md={2} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Subarrendatario'
//                             value={datos.DocumentoSubarrendatario}
//                             options={subarrendatario}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='DocumentoSubarrendatario'
//                         />
//                     </Grid>
//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label='Precio Venta'
//                             value={datos.PrecioVenta}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='number'
//                             valorname='PrecioVenta'
//                         />
//                     </Grid>
//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label='Precio Alquiler'
//                             value={datos.PrecioAlquiler}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='number'
//                             valorname='PrecioAlquiler'
//                         />
//                     </Grid>
//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label='Precio Reparación'
//                             value={datos.PrecioReparacion}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='number'
//                             valorname='PrecioReparacion'
//                         />
//                     </Grid>
//                     <Grid md={2} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Estado'
//                             value={datos.EstadoEquipo}
//                             options={estados}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='EstadoEquipo'
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <Divider />
//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button variant="contained" onClick={handleCrearEquipo}>
//                     Crear equipo
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


























// // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// 'use client';

// import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
// import { UserContext } from '@/contexts/user-context';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { CrearEquipo } from '@/services/gestionycontrol/equipos/CrearEquipoService';
// import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
// import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
// import { ListarEstados } from '@/services/generales/ListarEstadosService';
// import {
//     Button,
//     Card,
//     CardActions,
//     CardContent,
//     Divider,
//     Typography
// } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// import type { SelectChangeEvent } from '@mui/material/Select';
// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { prepareCssVars } from '@mui/system';




// interface OpcionSelect {
//     value: string | number;
//     label: string;
// }

// interface FormData {
//     NombreEquipo: string;
//     CategoriaEquipo: string;
//     PrecioVenta: number;
//     PrecioAlquiler: number;
//     PrecioReparacion: number;
//     UsuarioCreacion: string | null;
//     EstadoEquipo: string;
//     Cantidad: number;
//     DocumentoSubarrendatario: string;
// }

// interface ErrorForm {
//     NombreEquipo?: string;
//     CategoriaEquipo?: string;
//     PrecioAlquiler?: string;
//     EstadoEquipo?: string;
//     [key: string]: string | undefined;
// }

// // const REGLAS_VALIDACION = [
// //     { campo: 'NombreEquipo', mensaje: 'El nombre es obligatorio.' },
// //     { campo: 'CategoriaEquipo', mensaje: 'La categoría es obligatoria.' },
// //     { campo: 'PrecioAlquiler', mensaje: 'El precio de alquiler es obligatorio.' },
// //     { campo: 'EstadoEquipo', mensaje: 'El estado es obligatorio.' },
// // ];

// const REGLAS_VALIDACION = [
//     { campo: 'NombreEquipo', mensaje: 'El nombre es obligatorio.' },
//     { campo: 'CategoriaEquipo', mensaje: 'La categoría es obligatoria.' },
//     { campo: 'PrecioAlquiler', mensaje: 'El precio de alquiler es obligatorio.' },
//     { campo: 'EstadoEquipo', mensaje: 'El estado es obligatorio.' },

//     // Agrega estas nuevas reglas para campos no obligatorios pero con validación
//     {
//         campo: 'PrecioVenta',
//         mensaje: 'Debe ser mayor o igual a 0',
//         esOpcional: true,
//         // validacion: (valor: string) => valor === '' || parseFloat(valor) >= 0
//         validacion: (valor: number) => valor >= 0
//     },
//     {
//         campo: 'PrecioReparacion',
//         mensaje: 'Debe ser mayor o igual a 0',
//         esOpcional: true,
//         // validacion: (valor: string) => valor === '' || parseFloat(valor) >= 0
//         validacion: (valor: number) => valor > 0
//     },
//     {
//         campo: 'Cantidad',
//         // mensaje: 'Debe ser mayor a 0',
//         mensaje: 'La cantidad es obligatoria y debe ser un valor mayor a 0',
//         esOpcional: false, // Este sería obligatorio pero con validación adicional
//         // validacion: (valor: number) => valor === null
//         validacion: (valor: number) => valor > 0
//     }
// ];

// export function FormularioCrearEquipo(): React.JSX.Element {
//     // Contexto y hooks
//     const { user } = useContext(UserContext) || { user: null };
//     const documentoUsuarioActivo = user?.documento ?? null;
//     const { sendMessage } = useSocketIO();

//     // Estados
//     const [formData, setFormData] = useState<FormData>({
//         NombreEquipo: '',
//         CategoriaEquipo: '',
//         PrecioVenta: Number(null),
//         PrecioAlquiler: Number(null),
//         PrecioReparacion: Number(null),
//         UsuarioCreacion: documentoUsuarioActivo,
//         EstadoEquipo: '',
//         Cantidad: Number(null),
//         DocumentoSubarrendatario: ''
//     });

//     const [errores, setErrores] = useState<ErrorForm>({});
//     const [alerta, setAlerta] = useState({
//         mostrar: false,
//         mensaje: '',
//         tipo: 'success' as 'success' | 'error'
//     });

//     const [cargando, setCargando] = useState(false);
//     const [subarrendatarios, setSubarrendatarios] = useState<OpcionSelect[]>([]);
//     const [categorias, setCategorias] = useState<OpcionSelect[]>([]);
//     const [estados, setEstados] = useState<OpcionSelect[]>([]);

//     // Handlers
//     const handleChange = useCallback((e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: name === 'Cantidad' ? Number(value) : value
//         }));

//         // Limpiar error al modificar el campo
//         if (errores[name]) {
//             setErrores(prev => ({ ...prev, [name]: '' }));
//         }
//     }, [errores]);

//     const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
//         setAlerta({ mostrar: true, mensaje, tipo });
//     }, []);

//     // Validación del formulario
//     const validarFormulario = useCallback((): boolean => {
//         const nuevosErrores: ErrorForm = {};
//         let valido = true;

//         // REGLAS_VALIDACION.forEach(regla => {
//         //     const valorCampo = formData[regla.campo as keyof FormData];
//         //     if (!valorCampo && valorCampo !== 0) {
//         //         nuevosErrores[regla.campo] = regla.mensaje;
//         //         valido = false;
//         //     }

//         //     // Validación adicional para precios numéricos
//         //     if (regla.campo.includes('PrecioAlquiler') && valorCampo) {
//         //         const precio = parseFloat(valorCampo.toString());
//         //         if (isNaN(precio) || precio < 0) {
//         //             nuevosErrores[regla.campo] = 'Debe ser un número válido mayor o igual a 0';
//         //             valido = false;
//         //         }
//         //     }
//         // });

//         REGLAS_VALIDACION.forEach(regla => {
//             const valorCampo = formData[regla.campo as keyof FormData];

//             // Validación para campos obligatorios
//             if (!regla.esOpcional && !valorCampo && valorCampo !== 0) {
//                 nuevosErrores[regla.campo] = regla.mensaje;
//                 valido = false;
//             }

//             // Validación personalizada si existe
//             if (regla.validacion && valorCampo !== '' && valorCampo !== null && valorCampo !== undefined) {
//                 if (!regla.validacion(valorCampo as never)) {
//                     nuevosErrores[regla.campo] = regla.mensaje;
//                     valido = false;
//                 }
//             }
//         });

//         setErrores(nuevosErrores);
//         return valido;
//     }, [formData]);

//     // Carga de datos
//     const cargarSubarrendatarios = useCallback(async () => {
//         try {
//             const data = await ListarSubarrendatarios();
//             setSubarrendatarios(data);
//         } catch (error) {
//             console.error('Error al listar subarrendatarios:', error);
//             mostrarMensaje('Error al cargar subarrendatarios', 'error');
//         }
//     }, [mostrarMensaje]);

//     const cargarCategorias = useCallback(async () => {
//         try {
//             const data = await ListarCategorias();
//             setCategorias(data);
//             // Establecer primera categoría como valor por defecto si existe
//             if (data.length > 0) {
//                 setFormData(prev => ({ ...prev, CategoriaEquipo: data[0].value.toString() }));
//             }
//         } catch (error) {
//             console.error('Error al listar categorías:', error);
//             mostrarMensaje('Error al cargar categorías', 'error');
//         }
//     }, [mostrarMensaje]);

//     const cargarEstados = useCallback(async () => {
//         try {
//             const data = await ListarEstados();
//             const estadosPermitidos = new Set(['disponible', 'no disponible', 'reparación']);
//             const estadosFiltrados = data.filter((item: any) =>
//                 estadosPermitidos.has(item.label.toLowerCase().trim())
//             );
//             setEstados(estadosFiltrados);
//             // Establecer primer estado como valor por defecto si existe
//             if (estadosFiltrados.length > 0) {
//                 setFormData(prev => ({ ...prev, EstadoEquipo: estadosFiltrados[0].value.toString() }));
//             }
//         } catch (error) {
//             console.error('Error al listar estados:', error);
//             mostrarMensaje('Error al cargar estados', 'error');
//         }
//     }, [mostrarMensaje]);

//     // Actualizar datos
//     const ActualizarPrecioVenta = (NuevoPrecioVenta: number) => {
//         const cantidadFinal = Math.min(
//             Math.max(NuevoPrecioVenta, 0), // No menor a 0
//         );
//         setFormData(prev => ({
//             ...prev, PrecioVenta: cantidadFinal
//         }))
//     };
//     const actualizarCampoNumerico = (campo: keyof FormData, nuevoValor: number) => {
//         const valorFinal = Math.min(
//             // Math.max(nuevoValor, 0), // No menor a 0
//             // Puedes agregar un valor máximo si es necesario: Math.max(nuevoValor, 0), 100000)
//         );

//         setFormData(prev => ({
//             ...prev,
//             [campo]: nuevoValor
//         }));
//     };

//     // Creación del equipo
//     const handleCrearEquipo = useCallback(async () => {
//         if (!validarFormulario()) {
//             mostrarMensaje('Por favor complete todos los campos requeridos correctamente', 'error');
//             return;
//         }

//         try {
//             setCargando(true);
//             await CrearEquipo(formData);
//             sendMessage('equipo-creado', {});
//             mostrarMensaje('Equipo creado exitosamente', 'success');

//             // Resetear formulario (manteniendo valores por defecto)
//             setFormData({
//                 NombreEquipo: '',
//                 CategoriaEquipo: categorias[0]?.value.toString() || '',
//                 PrecioVenta: Number(null),
//                 PrecioAlquiler: Number(null),
//                 PrecioReparacion: Number(null),
//                 UsuarioCreacion: documentoUsuarioActivo,
//                 EstadoEquipo: estados[0]?.value.toString() || '',
//                 Cantidad: Number(null),
//                 DocumentoSubarrendatario: ''
//             });
//         } catch (error) {
//             mostrarMensaje(`Error al crear equipo: ${error instanceof Error ? error.message : String(error)}`, 'error');
//         } finally {
//             setCargando(false);
//         }
//     }, [formData, validarFormulario, sendMessage, documentoUsuarioActivo, categorias, estados, mostrarMensaje]);

//     // Efectos
//     useEffect(() => {
//         cargarSubarrendatarios();
//         cargarCategorias();
//         cargarEstados();
//     }, [cargarSubarrendatarios, cargarCategorias, cargarEstados]);

//     return (
//         <Card>
//             <Typography variant="subtitle1" sx={{
//                 color: 'text.primary',
//                 padding: '5px',
//                 fontWeight: 'normal'
//             }}>
//                 Creación de equipo
//             </Typography>

//             <Divider />

//             <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={4} xs={12} mt={0.5}>
//                         <InputSelect
//                             label="Referencia*"
//                             value={formData.CategoriaEquipo}
//                             options={categorias}
//                             size="small"
//                             onChange={handleChange}
//                             valorname="CategoriaEquipo"
//                             error={!!errores.CategoriaEquipo}
//                             helperText={errores.CategoriaEquipo}
//                         />
//                     </Grid>

//                     <Grid md={4} xs={12} mt={0.5}>
//                         <Input
//                             label="Nombre*"
//                             value={formData.NombreEquipo}
//                             onChange={handleChange}
//                             tamano="small"
//                             tipo_input="text"
//                             valorname="NombreEquipo"
//                             error={!!errores.NombreEquipo}
//                             helperText={errores.NombreEquipo}
//                         />
//                     </Grid>

//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label="Cantidad"
//                             // value={formData.Cantidad}
//                             onChange={handleChange}
//                             // tamano="small"
//                             // tipo_input="number"
//                             // valorname="Cantidad"
//                             // error={formData.Cantidad <= 0}
//                             // helperText={formData.Cantidad < 0 ? 'La cantidad debe ser mayor a 0' : ''}
//                             value={formData.Cantidad || ''}
//                             // onChange={(e) => {
//                             //     let ValorCapturado = e.target.value;
//                             //     ValorCapturado = ValorCapturado.replace(/^0+(?=\d)/, '');
//                             //     // ValorCapturado = ValorCapturado.replace(/[^0-9.]/g, '');
//                             //     // ValorCapturado = ValorCapturado.replace(/(\..*)\./g, '$1');
//                             //     const Valor = ValorCapturado === '' ? 0 : parseInt(ValorCapturado, 10);
//                             //     actualizarCampoNumerico('Cantidad', Valor);
//                             // }}
//                             tamano="small"
//                             tipo_input="number"
//                             valorname="Cantidad"
//                             error={formData.Cantidad <= 0}
//                             helperText={formData.Cantidad <= 0 ? 'El precio de venta debe ser mayor a 0' : ''}
//                         />
//                     </Grid>

//                     <Grid md={2} xs={12} mt={0.5}>
//                         <InputSelect
//                             label="Subarrendatario"
//                             value={formData.DocumentoSubarrendatario}
//                             options={subarrendatarios}
//                             size="small"
//                             onChange={handleChange}
//                             valorname="DocumentoSubarrendatario"
//                         />
//                     </Grid>

//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label="Precio Venta"
//                             value={formData.PrecioVenta || ''}
//                             // onChange={handleChange}
//                             onChange={(e) => {
//                                 let ValorCapturado = e.target.value;
//                                 ValorCapturado = ValorCapturado.replace(/^0+(?=\d)/, '');
//                                 // ValorCapturado = ValorCapturado.replace(/[^0-9.]/g, '');
//                                 // ValorCapturado = ValorCapturado.replace(/(\..*)\./g, '$1');
//                                 const Valor = ValorCapturado === '' ? 0 : parseInt(ValorCapturado, 10);
//                                 actualizarCampoNumerico('PrecioVenta', Valor);

//                             }}
//                             tamano="small"
//                             tipo_input="number"
//                             valorname="PrecioVenta"
//                             //   inputProps={{ min: 0, step: '0.01' }}
//                             // error={!!errores.PrecioVenta}
//                             error={formData.PrecioVenta < 0}
//                             helperText={formData.PrecioVenta < 0 ? 'El precio de venta debe ser mayor a 0' : ''}
//                         // helperText={formData.Cantidad <= 0 ? 'La cantidad debe ser mayor a 0' : ''}

//                         />
//                     </Grid>

//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label="Precio Alquiler*"
//                             value={formData.PrecioAlquiler || ''}
//                             // onChange={handleChange}
//                             onChange={(e) => {
//                                 let ValorCapturado = e.target.value;
//                                 ValorCapturado = ValorCapturado.replace(/^0+(?=\d)/, '');
//                                 ValorCapturado = ValorCapturado.replace(/[^0-9.]/g, '');
//                                 ValorCapturado = ValorCapturado.replace(/(\..*)\./g, '$1');
//                                 const Valor = ValorCapturado === '' ? 0 : parseInt(ValorCapturado, 10);
//                                 actualizarCampoNumerico('PrecioAlquiler', Valor);

//                             }}
//                             tamano="small"
//                             tipo_input="number"
//                             valorname="PrecioAlquiler"
//                             //   inputProps={{ min: 0, step: '0.01' }}
//                             // minimalongitud={1}
//                             error={!!errores.PrecioAlquiler}
//                             helperText={errores.PrecioAlquiler}
//                         />
//                     </Grid>

//                     <Grid md={2} xs={12} mt={0.5}>
//                         <Input
//                             label="Precio Reparación"
//                             value={formData.PrecioReparacion || ''}
//                             // onChange={handleChange}
//                             onChange={(e) => {
//                                 let ValorCapturado = e.target.value;
//                                 ValorCapturado = ValorCapturado.replace(/^0+(?=\d)/, '');
//                                 ValorCapturado = ValorCapturado.replace(/[^0-9.]/g, '');
//                                 // ValorCapturado = ValorCapturado.replace(/(\..*)\./g, '$1');
//                                 const Valor = parseInt(ValorCapturado, 10);
//                                 actualizarCampoNumerico('PrecioReparacion', Valor);

//                             }}
//                             tamano="small"
//                             tipo_input="number"
//                             valorname="PrecioReparacion"
//                             //   inputProps={{ min: 0, step: '0.01' }}
//                             // minimalongitud={1}
//                             error={!!errores.PrecioReparacion}
//                             helperText={errores.PrecioReparacion}
//                         />
//                     </Grid>

//                     <Grid md={2} xs={12} mt={0.5}>
//                         <InputSelect
//                             label="Estado*"
//                             value={formData.EstadoEquipo}
//                             options={estados}
//                             size="small"
//                             onChange={handleChange}
//                             valorname="EstadoEquipo"
//                             error={!!errores.EstadoEquipo}
//                             helperText={errores.EstadoEquipo}
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>

//             <Divider />

//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button
//                     variant="contained"
//                     onClick={handleCrearEquipo}
//                     disabled={cargando}
//                 >
//                     {cargando ? 'Creando...' : 'Crear equipo'}
//                 </Button>
//             </CardActions>

//             <MensajeAlerta
//                 open={alerta.mostrar}
//                 tipo={alerta.tipo}
//                 mensaje={alerta.mensaje}
//                 onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))}
//             />
//         </Card>
//     );
// }




'use client';

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { CrearEquipo } from '@/services/gestionycontrol/equipos/CrearEquipoService';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
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
}

interface ErrorForm {
    NombreEquipo?: string;
    CategoriaEquipo?: string;
    PrecioAlquiler?: string;
    EstadoEquipo?: string;
    Cantidad?: string;
    DocumentoSubarrendatario?: string;
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
    {
        campo: 'DocumentoSubarrendatario',
        mensaje: 'El subarrendatario es obligatorio.',
        esOpcional: false
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
        CategoriaEquipo: '',
        PrecioVenta: null,
        PrecioAlquiler: null,
        PrecioReparacion: null,
        UsuarioCreacion: documentoUsuarioActivo,
        EstadoEquipo: '',
        Cantidad: null,
        DocumentoSubarrendatario: ''
    });

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

    const validarCampo = useCallback((campo: string, valor: any) => {
        const regla = REGLAS_VALIDACION.find(r => r.campo === campo);
        if (!regla) return;

        let error = '';

        // Validación para campos obligatorios
        if (!regla.esOpcional && (valor === '' || valor === null || valor === undefined)) {
            error = regla.mensaje;
        }
        // Validación personalizada si existe
        else if (regla.validacion && !regla.validacion(valor)) {
            error = regla.mensaje;
        }

        setErrores(prev => ({ ...prev, [campo]: error }));
    }, []);

    const mostrarMensaje = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
    }, []);

    // Validación del formulario
    const validarFormulario = useCallback((): boolean => {
        const nuevosErrores: ErrorForm = {};
        let valido = true;

        REGLAS_VALIDACION.forEach(regla => {
            const valorCampo = formData[regla.campo as keyof FormData];

            // Validación para campos obligatorios
            if (!regla.esOpcional && (valorCampo === '' || valorCampo === null || valorCampo === undefined)) {
                nuevosErrores[regla.campo] = regla.mensaje;
                valido = false;
            }

            // Validación personalizada si existe
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
            setSubarrendatarios(data);
        } catch (error) {
            console.error('Error al listar subarrendatarios:', error);
            mostrarMensaje('Error al cargar subarrendatarios', 'error');
        }
    }, [mostrarMensaje]);

    const cargarCategorias = useCallback(async () => {
        try {
            const data = await ListarCategorias();
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
            setEstados(estadosFiltrados);
        } catch (error) {
            console.error('Error al listar estados:', error);
            mostrarMensaje('Error al cargar estados', 'error');
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
                CategoriaEquipo: '',
                PrecioVenta: null,
                PrecioAlquiler: null,
                PrecioReparacion: null,
                UsuarioCreacion: documentoUsuarioActivo,
                EstadoEquipo: '',
                Cantidad: null,
                DocumentoSubarrendatario: ''
            });
        } catch (error) {
            mostrarMensaje(`Error al crear equipo: ${error instanceof Error ? error.message : String(error)}`, 'error');
        } finally {
            setCargando(false);
        }
    }, [formData, validarFormulario, sendMessage, documentoUsuarioActivo, mostrarMensaje]);

    // Efectos
    useEffect(() => {
        cargarSubarrendatarios();
        cargarCategorias();
        cargarEstados();
    }, [cargarSubarrendatarios, cargarCategorias, cargarEstados]);

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
                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
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
                        <InputSelect
                            label="Subarrendatario*"
                            value={formData.DocumentoSubarrendatario}
                            options={subarrendatarios}
                            size="small"
                            onChange={handleChange}
                            valorname="DocumentoSubarrendatario"
                            error={!!errores.DocumentoSubarrendatario}
                            helperText={errores.DocumentoSubarrendatario}
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