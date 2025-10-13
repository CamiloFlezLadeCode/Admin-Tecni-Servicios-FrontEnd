// 'use client';
// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { UserContext } from '@/contexts/user-context';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { OpcionPorDefecto, OpcionPorDefectoNumber, ParametroBuscarBodegasReparacion, ParametroBuscarBodegasRepuestos } from '@/lib/constants/option-default';
// import { ConsultarSiguienteNoOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioService';
// import { CrearOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/CrearOrdenDeServicioService';
// import { VerEquiposDelCliente } from '@/services/comercial/ordenes_de_servicio/VerEquiposDelClienteService';
// import { VerRepuestosDisponibles } from '@/services/comercial/ordenes_de_servicio/VerRepuestosDisponiblesService';
// import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
// import { ListarClientes } from '@/services/generales/ListarClientesService';
// import { listarmecanicos } from '@/services/generales/ListarMecanicosService';
// import { ListarProyectos } from '@/services/generales/ListarProyectos';
// import {
//     Box,
//     Button,
//     Card,
//     CardActions,
//     CardContent,
//     Checkbox,
//     Divider,
//     SelectChangeEvent,
//     Typography,
//     useTheme
// } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// import dayjs, { Dayjs } from 'dayjs';
// import * as React from 'react';
// import InputSelect from '../../../componentes_generales/formulario/Select';
// import { VerDisponibilidadDeRepuesto } from '@/services/comercial/ordenes_de_servicio/VerDisponibilidadDeRepuestoService';


// // 1. Interfaces ó Types
// interface DatosOrdenDeServicio {
//     NoOrdenDeServicio: string;
//     DocumentoCliente: string;
//     IdProyecto: number | null;
//     Garantia: number | null;
//     Descripcion: string;
//     Observaciones: string;
//     DocumentoMecanico: string;
//     PersonaQueEntrega: string;
//     PersonaQueRecibe: string;
//     UsuarioCreacion: string | null;
//     IdEstado: number | null;
//     FechaOrdenDeServicio: Dayjs;
//     IdEquipoCliente: number;
// }

// type GarantiaValue = 0 | 1 | null;

// interface Equipo {
//     cantidad: string;
//     descripcion: string;
//     IdRepuesto: number;
// }

// interface PropsHandleChange {
//     index: number;
//     field: keyof Equipo;
//     // value: string | number;
//     value: Equipo[keyof Equipo]
// }

// // 2. Compornente principal
// export function FormularioCrearOrdenDeServicio(): React.JSX.Element {
//     // 3. Hooks de React y otros hooks de librerías
//     const theme = useTheme();
//     const { user } = React.useContext(UserContext) || { user: null };
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;
//     const { sendMessage, messages } = useSocketIO();
//     // 4. Estados
//     const [datos, setDatos] = React.useState<DatosOrdenDeServicio>({
//         NoOrdenDeServicio: '',
//         DocumentoCliente: OpcionPorDefecto.value,
//         IdProyecto: OpcionPorDefectoNumber.value,
//         Garantia: null as GarantiaValue,
//         Descripcion: '',
//         Observaciones: '',
//         DocumentoMecanico: OpcionPorDefecto.value,
//         PersonaQueEntrega: OpcionPorDefecto.value,
//         PersonaQueRecibe: '',
//         UsuarioCreacion: documentoUsuarioActivo,
//         IdEstado: 8,
//         FechaOrdenDeServicio: dayjs(),
//         IdEquipoCliente: OpcionPorDefectoNumber.value
//     });
//     const [siguienteNoOrdenDeServicio, setSiguienteNoOrdenDeServicio] = React.useState('');
//     const [clientes, setClientes] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [proyectos, setProyectos] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [profesionalesPertenecientes, setProfesionalesPertenecientes] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [mecanicos, setMecanicos] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [opcionGarantia, setOpcionGarantia] = React.useState<GarantiaValue>(null);
//     const [equipos, setEquipos] = React.useState<Equipo[]>([{ cantidad: '', descripcion: '', IdRepuesto: OpcionPorDefectoNumber.value }]);
//     const [equiposDelCliente, setEquiposDelCliente] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [repuestosDisponibles, setRepuestosDisponibles] = React.useState<[]>([]);
//     //Estados para el manejo de las notificaciones/alertas
//     const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
//     const [mensajeAlerta, setMensajeAlerta] = React.useState('');
//     const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
//     //...

//     // 5. useEffect para carga inicial y sockets
//     React.useEffect(() => {
//         const CargarDatosIniciales = async () => {
//             try {
//                 // Llamadas y almacenados 
//                 const [
//                     SiguienteNoOrdenDeServicio,
//                     Clientes,
//                     ProfesionalesPertenecientes,
//                     Mecanicos,
//                     Repuestos
//                 ] = await Promise.all([
//                     ConsultarSiguienteNoOrdenDeServicio(),
//                     ListarClientes(),
//                     ListarProfesionalesPertenecientes(),
//                     listarmecanicos(),
//                     VerRepuestosDisponibles({ IdTipoBodega: ParametroBuscarBodegasRepuestos.value })
//                 ]);

//                 // Se asignan los datos que vienen de la bd
//                 const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
//                 setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
//                 setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
//                 // Clientes
//                 Clientes.unshift(OpcionPorDefecto)
//                 setClientes(Clientes);
//                 //  Profesionales de entrega
//                 ProfesionalesPertenecientes.unshift(OpcionPorDefecto);
//                 setProfesionalesPertenecientes(ProfesionalesPertenecientes);
//                 // Mecanicos
//                 Mecanicos.unshift(OpcionPorDefecto)
//                 setMecanicos(Mecanicos);
//                 // Repuestos
//                 Repuestos.unshift(OpcionPorDefectoNumber);
//                 setRepuestosDisponibles(Repuestos);
//             } catch (error) {
//                 console.error(`Error al cargar datos: ${error}`);
//             }
//         };
//         CargarDatosIniciales();
//     }, []);

//     React.useEffect(() => {
//         if (datos.NoOrdenDeServicio === '') {
//             setDatos(prev => ({ ...prev, NoOrdenDeServicio: siguienteNoOrdenDeServicio }));
//         }
//     }, [datos.NoOrdenDeServicio]);

//     React.useEffect(() => {
//         CargarProyectosDelCliente();
//         CargarEquiposDelCliente();
//     }, [datos.DocumentoCliente]);

//     React.useEffect(() => {
//         if (messages.length > 0) {
//             const UltimoMensaje = messages[messages.length - 1];
//             if (UltimoMensaje.tipo === 'orden-de-servicio-creada') {
//                 CargarSiguienteNoOrdenDeServicio();
//             }
//         }
//     }, [messages]);
//     // 6. Funciones del componente
//     const CargarSiguienteNoOrdenDeServicio = async () => {
//         try {
//             const SiguienteNoOrdenDeServicio = await ConsultarSiguienteNoOrdenDeServicio();
//             // Se asignan los datos que vienen de la bd
//             const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
//             setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
//             setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
//         } catch (error) {
//             console.error(`Error al describir la acción: ${error}`);
//         }
//     }
//     const CargarProyectosDelCliente = async () => {
//         try {
//             let DocumentoCliente = {
//                 Cliente: datos.DocumentoCliente
//             };
//             const Proyectos = await ListarProyectos(DocumentoCliente);
//             Proyectos.unshift(OpcionPorDefectoNumber)
//             setProyectos(Proyectos);
//         } catch (error) {
//             console.error(`Error al listar los proyectos: ${error}`);
//         }
//     };
//     const CargarEquiposDelCliente = async () => {
//         try {
//             const EquiposDelCliente = await VerEquiposDelCliente({ IdTipoBodega: ParametroBuscarBodegasReparacion.value, DocumentoPropietario: datos.DocumentoCliente });
//             EquiposDelCliente.unshift(OpcionPorDefectoNumber);
//             setEquiposDelCliente(EquiposDelCliente);
//         } catch (error) {
//             console.error(`Error al describir la acción: ${error}`);
//         }
//     }

//     const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
//         // const { name, value } = e.target;
//         // setDatos(prev => ({
//         //     ...prev,
//         //     [name ?? '']: value,
//         // }));

//         // if (name === 'DocumentoCliente') {
//         //     setDatos(prev => ({
//         //         ...prev,
//         //         IdEquipoCliente: OpcionPorDefectoNumber.value,
//         //         IdProyecto: OpcionPorDefectoNumber.value
//         //     }));
//         // }
//         const { name, value } = e.target;

//         setDatos((prev) => {
//             let updated = { ...prev, [name ?? '']: value };

//             if (name === 'DocumentoCliente') {
//                 updated = {
//                     ...updated,
//                     IdEquipoCliente: OpcionPorDefectoNumber.value,
//                     IdProyecto: OpcionPorDefectoNumber.value,
//                 };
//             }

//             return updated;
//         });
//     };

//     const handleGarantiaChange = (value: GarantiaValue) => {
//         setOpcionGarantia(value);
//         setDatos(prev => ({
//             ...prev,
//             Garantia: value === null ? 0 : value
//         }));
//     };

//     //
//     const handleAddEquipo = () => {
//         // Verifica si el último equipo está vacío antes de agregar uno nuevo
//         if (equipos.length === 0 || equipos[equipos.length - 1].cantidad !== '' || equipos[equipos.length - 1].descripcion !== '') {
//             setEquipos([...equipos, { cantidad: '', descripcion: '', IdRepuesto: OpcionPorDefectoNumber.value }]);
//         }
//     };

//     const handleRemoveEquipo = (index: number) => {
//         if (equipos.length === 1) {
//             // Si es el último equipo, solo limpiamos
//             setEquipos([{ cantidad: '', descripcion: '', IdRepuesto: OpcionPorDefectoNumber.value }]);
//         } else {
//             // Eliminamos el equipo
//             setEquipos(equipos.filter((_, i) => i !== index));
//         }
//     };

//     const handleChangee = ({ index, value, field }: PropsHandleChange) => {
//         const newEquipos = [...equipos];
//         // newEquipos[index][field] = value;
//         (newEquipos[index] as any)[field] = value;
//         setEquipos(newEquipos);
//     };

//     //Función para abrir la alerta
//     const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
//         setMensajeAlerta(mensaje);
//         setTipoAlerta(tipo);
//         setMostrarAlertas(true);
//     };
//     //....

//     // Función para ver la disponiblidad del repuesto
//     const ConsultarDisponibilidadDeRepuesto = async () => {
//         try {
//             const Disponibilidad = await VerDisponibilidadDeRepuesto({ IdTipoBodega: ParametroBuscarBodegasRepuestos.value, IdRepuesto:  equipos.IdRepuesto});
//         } catch (error) {
//             console.error(`Error al ver la disponibilidad del repuesto: ${error}`);
//         }
//     }
//     // ...

//     //Se crea referencia para el formulario validador
//     const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
//     const reglasValidacion = [
//         { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
//         { campo: 'IdProyecto', mensaje: 'La obra es obligatoria.' },
//         { campo: 'Garantia', mensaje: 'La garantía es obligatoria.' },
//         { campo: 'DocumentoMecanico', mensaje: 'El mecánico es obligatorio.' },
//         { campo: 'PersonaQueEntrega', mensaje: 'La persona que entrega es obligatoria.' },
//         { campo: 'PersonaQueRecibe', mensaje: 'La persona que recibe es obligatoria.' },
//         { campo: 'IdEquipoCliente', mensaje: 'El equipo es obligatorio' }
//     ];
//     //Se define lógica para la validación exitosa
//     const manejarValidacionExitosa = () => { };
//     //...

//     // Función para realizar la creación de orden de servicio
//     const HandleCrearOrdenDeSerivio = async () => {
//         console.log(datos.Garantia);
//         const esValido = await formularioRef.current?.manejarValidacion();
//         if (esValido) {
//             try {
//                 // 1. Filtrar equipos válidos (con cantidad y descripción)
//                 const detallesValidos = equipos.filter(
//                     equipo => equipo.cantidad.trim() !== '' && equipo.descripcion.trim() !== ''
//                 );

//                 // 2. Validar que haya al menos un equipo
//                 // if (detallesValidos.length === 0) {
//                 //     mostrarMensaje('Debe agregar al menos un equipo válido', 'error');
//                 //     return;
//                 // }

//                 // 3. Crear objeto con datos principales y detalles
//                 const ordenCompleta = {
//                     ...datos,
//                     Detalles: detallesValidos.map(equipo => ({
//                         Cantidad: Number(equipo.cantidad),
//                         DescripcionEquipo: equipo.descripcion
//                     })),
//                     FechaOrdenDeServicio: datos.FechaOrdenDeServicio.format('YYYY-MM-DD HH:mm:ss')
//                 };

//                 // 4. Enviar a la API
//                 await CrearOrdenDeServicio(ordenCompleta);

//                 mostrarMensaje('Orden de servicio creada correctamente.', 'success');
//                 sendMessage('orden-de-servicio-creada', {});

//                 // 5. Resetear formulario
//                 setEquipos([{ cantidad: '', descripcion: '', IdRepuesto: OpcionPorDefectoNumber.value }]);
//                 setDatos({
//                     NoOrdenDeServicio: '',
//                     DocumentoCliente: OpcionPorDefecto.value,
//                     IdProyecto: OpcionPorDefectoNumber.value,
//                     Garantia: null as GarantiaValue,
//                     Descripcion: '',
//                     Observaciones: '',
//                     DocumentoMecanico: OpcionPorDefecto.value,
//                     PersonaQueEntrega: OpcionPorDefecto.value,
//                     PersonaQueRecibe: '',
//                     UsuarioCreacion: documentoUsuarioActivo,
//                     IdEstado: 8,
//                     FechaOrdenDeServicio: dayjs(),
//                     IdEquipoCliente: OpcionPorDefectoNumber.value
//                 });

//             } catch (error) {
//                 console.error(`Error al crear la orden: ${error}`);
//                 mostrarMensaje(`Hubo un error al crear la orden de servicio: ${error}`, 'error');
//             }
//         }
//     }
//     // ...

//     // ✅ Manejador específico para el DateTimePicker
//     const handleFechaChange = (fecha: Dayjs | null) => {
//         setDatos(prev => ({ ...prev, FechaOrdenDeServicio: fecha || dayjs() }));
//     };
//     // ...

//     // 7. Renderizado JSX
//     return (
//         <Card>
//             <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
//                 <Typography variant="subtitle1" color="text.primary">
//                     Creación de órden de servicio
//                 </Typography>
//                 <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
//                     <Input
//                         label='Orden No:'
//                         value={datos.NoOrdenDeServicio}
//                         onChange={handleChange}
//                         // required
//                         tamano='small'
//                         tipo_input='text'
//                         valorname='NoOrdenDeServicio'
//                     />
//                 </Typography>
//             </Box>
//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <FechayHora
//                             label="Fecha y hora"
//                             value={datos.FechaOrdenDeServicio}
//                             onChange={handleFechaChange}
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Empresa/Cliente'
//                             value={datos.DocumentoCliente}
//                             options={clientes}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='DocumentoCliente'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Obra/Proyecto'
//                             value={Number(datos.IdProyecto)}
//                             options={proyectos}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='IdProyecto'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Mecánico'
//                             value={datos.DocumentoMecanico}
//                             options={mecanicos}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='DocumentoMecanico'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Equipo'
//                             value={datos.IdEquipoCliente}
//                             options={equiposDelCliente}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='IdEquipoCliente'
//                         />
//                     </Grid>
//                 </Grid>
//                 {equipos.map((equipo, index) => (
//                     <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
//                         <Grid md={1} xs={12} mt={0.5}>
//                             {index === 0 ? (
//                                 <>
//                                     <Button
//                                         variant="contained"
//                                         onClick={handleAddEquipo}
//                                         sx={{ mr: 1, width: { xs: '10%', md: '10%' } }}
//                                     >
//                                         +
//                                     </Button>
//                                     {/* <Button
//                                         variant="contained"
//                                         onClick={() => handleRemoveEquipo(index)}
//                                         disabled={equipos.length === 1 && equipos[0].cantidad === '' && equipos[0].descripcion === ''}
//                                     >
//                                         -
//                                     </Button> */}
//                                 </>
//                             ) : (
//                                 <Button
//                                     variant="contained"
//                                     color="error"
//                                     onClick={() => handleRemoveEquipo(index)}
//                                     sx={{ width: { xs: '10%', md: '10%' } }}
//                                 >
//                                     Quitar
//                                 </Button>
//                             )}
//                         </Grid>

//                         <Grid md={2} xs={12} mt={0.5}>
//                             <Input
//                                 label='Cantidad'
//                                 value={equipo.cantidad}
//                                 onChange={(e) => handleChangee({ index: index, field: 'cantidad', value: e.target.value })}
//                                 tamano='small'
//                                 tipo_input='number'
//                             />
//                         </Grid>

//                         <Grid md={6} xs={12} mt={0.5} display='none'>
//                             <Input
//                                 label='Descripción Equipo'
//                                 value={equipo.descripcion}
//                                 // onChange={(e) => handleChangee(index, 'descripcion', e.target.value)}
//                                 onChange={(e) => handleChangee({ index: index, field: 'descripcion', value: e.target.value })}
//                                 tamano='small'
//                                 tipo_input='text'
//                             />
//                         </Grid>
//                         <Grid md={3} xs={12} mt={0.5}>
//                             <SelectConBuscador
//                                 label='Repuesto'
//                                 value={equipo.IdRepuesto}
//                                 onChange={(e) => handleChangee({ index: index, field: 'IdRepuesto', value: e.target.value })}
//                                 options={repuestosDisponibles}
//                                 size='small'
//                                 valorname='IdRepuesto'
//                             />
//                         </Grid>

//                         <Grid md={2} xs={12} mt={0.5}>
//                             <Input
//                                 label='Cantidad disponible'
//                                 value={equipo.descripcion}
//                                 onChange={(e) => handleChangee({ index: index, field: 'descripcion', value: e.target.value })}
//                                 tamano='small'
//                                 tipo_input='text'
//                                 bloqueado
//                             />
//                         </Grid>
//                     </Grid>
//                 ))}
//                 <Grid container spacing={1}>
//                     <Grid md={6} xs={12} mt={0.5}>
//                         <strong>¿Aplica garantía? *</strong>
//                         <div>
//                             <label style={{ marginRight: 16 }}>
//                                 <Checkbox
//                                     checked={opcionGarantia === 1}
//                                     onChange={() => handleGarantiaChange(1)}
//                                 />
//                                 <span>Sí</span>
//                             </label>

//                             <label>
//                                 <Checkbox
//                                     checked={opcionGarantia === 0}
//                                     onChange={() => handleGarantiaChange(0)}
//                                 />
//                                 <span>No</span>
//                             </label>
//                         </div>
//                     </Grid>
//                 </Grid>
//                 <Grid container spacing={1} mt={1}>
//                     <Grid md={6} xs={12} mt={0.5} >
//                         <Input
//                             label='Descripcion'
//                             value={datos.Descripcion}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='textarea'
//                             valorname='Descripcion'
//                         />
//                     </Grid>
//                     <Grid md={6} xs={12} mt={0.5} >
//                         <Input
//                             label='Observaciones'
//                             value={datos.Observaciones}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='textarea'
//                             valorname='Observaciones'
//                         />
//                     </Grid>
//                 </Grid>
//                 <Grid container spacing={1} mt={1}>
//                     <Grid md={3} xs={12} mt={0.5} >
//                         <InputSelect
//                             label='Entrega'
//                             value={datos.PersonaQueEntrega}
//                             options={profesionalesPertenecientes}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='PersonaQueEntrega'
//                             required
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5} >
//                         <Input
//                             label='Recibe'
//                             value={datos.PersonaQueRecibe}
//                             onChange={handleChange}
//                             // required
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='PersonaQueRecibe'
//                             required
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <Divider />
//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button variant="contained" onClick={HandleCrearOrdenDeSerivio}>
//                     Crear orden
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
//     )
// };



// // // CASIIIIIIII COMPLETOOOOO CON TODOOO FUNCIONANDOOOOO
// 'use client';
// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
// import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
// import { UserContext } from '@/contexts/user-context';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { OpcionPorDefecto, OpcionPorDefectoNumber, ParametroBuscarBodegasReparacion, ParametroBuscarBodegasRepuestos } from '@/lib/constants/option-default';
// import { ConsultarSiguienteNoOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioService';
// import { CrearOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/CrearOrdenDeServicioService';
// import { VerEquiposDelCliente } from '@/services/comercial/ordenes_de_servicio/VerEquiposDelClienteService';
// import { VerRepuestosDisponibles } from '@/services/comercial/ordenes_de_servicio/VerRepuestosDisponiblesService';
// import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
// import { ListarClientes } from '@/services/generales/ListarClientesService';
// import { listarmecanicos } from '@/services/generales/ListarMecanicosService';
// import { ListarProyectos } from '@/services/generales/ListarProyectos';
// import {
//     Box,
//     Button,
//     Card,
//     CardActions,
//     CardContent,
//     Checkbox,
//     Divider,
//     SelectChangeEvent,
//     Typography,
//     useTheme
// } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// import dayjs, { Dayjs } from 'dayjs';
// import * as React from 'react';
// import InputSelect from '../../../componentes_generales/formulario/Select';
// import { VerDisponibilidadDeRepuesto } from '@/services/comercial/ordenes_de_servicio/VerDisponibilidadDeRepuestoService';

// // 1. Interfaces ó Types
// interface DatosOrdenDeServicio {
//     NoOrdenDeServicio: string;
//     DocumentoCliente: string;
//     IdProyecto: number | null;
//     Garantia: number | null;
//     Descripcion: string;
//     Observaciones: string;
//     DocumentoMecanico: string;
//     PersonaQueEntrega: string;
//     PersonaQueRecibe: string;
//     UsuarioCreacion: string | null;
//     IdEstado: number | null;
//     FechaOrdenDeServicio: Dayjs;
//     IdEquipoCliente: number;
// }

// type GarantiaValue = 0 | 1 | null;

// interface Equipo {
//     cantidad: string;
//     descripcion: string;
//     IdRepuesto: number;
//     cantidadDisponible: number;
//     errorCantidad: boolean;
// }

// interface PropsHandleChange {
//     index: number;
//     field: keyof Equipo;
//     value: Equipo[keyof Equipo];
// }

// // 2. Compornente principal
// export function FormularioCrearOrdenDeServicio(): React.JSX.Element {
//     // 3. Hooks de React y otros hooks de librerías
//     const theme = useTheme();
//     const { user } = React.useContext(UserContext) || { user: null };
//     const documentoUsuarioActivo = user ? `${user.documento}` : null;
//     const { sendMessage, messages } = useSocketIO();

//     // 4. Estados
//     const [datos, setDatos] = React.useState<DatosOrdenDeServicio>({
//         NoOrdenDeServicio: '',
//         DocumentoCliente: OpcionPorDefecto.value,
//         IdProyecto: OpcionPorDefectoNumber.value,
//         Garantia: null as GarantiaValue,
//         Descripcion: '',
//         Observaciones: '',
//         DocumentoMecanico: OpcionPorDefecto.value,
//         PersonaQueEntrega: OpcionPorDefecto.value,
//         PersonaQueRecibe: '',
//         UsuarioCreacion: documentoUsuarioActivo,
//         IdEstado: 8,
//         FechaOrdenDeServicio: dayjs(),
//         IdEquipoCliente: OpcionPorDefectoNumber.value
//     });
//     const [siguienteNoOrdenDeServicio, setSiguienteNoOrdenDeServicio] = React.useState('');
//     const [clientes, setClientes] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [proyectos, setProyectos] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [profesionalesPertenecientes, setProfesionalesPertenecientes] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [mecanicos, setMecanicos] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [opcionGarantia, setOpcionGarantia] = React.useState<GarantiaValue>(null);
//     const [equipos, setEquipos] = React.useState<Equipo[]>([{
//         cantidad: '',
//         descripcion: '',
//         IdRepuesto: OpcionPorDefectoNumber.value,
//         cantidadDisponible: 0,
//         errorCantidad: false
//     }]);
//     const [equiposDelCliente, setEquiposDelCliente] = React.useState<{ value: number | string; label: string }[]>([]);
//     const [repuestosDisponibles, setRepuestosDisponibles] = React.useState<[]>([]);

//     //Estados para el manejo de las notificaciones/alertas
//     const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
//     const [mensajeAlerta, setMensajeAlerta] = React.useState('');
//     const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

//     // 5. useEffect para carga inicial y sockets
//     React.useEffect(() => {
//         const CargarDatosIniciales = async () => {
//             try {
//                 // Llamadas y almacenados 
//                 const [
//                     SiguienteNoOrdenDeServicio,
//                     Clientes,
//                     ProfesionalesPertenecientes,
//                     Mecanicos,
//                     Repuestos
//                 ] = await Promise.all([
//                     ConsultarSiguienteNoOrdenDeServicio(),
//                     ListarClientes(),
//                     ListarProfesionalesPertenecientes(),
//                     listarmecanicos(),
//                     VerRepuestosDisponibles({ IdTipoBodega: ParametroBuscarBodegasRepuestos.value })
//                 ]);

//                 // Se asignan los datos que vienen de la bd
//                 const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
//                 setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
//                 setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
//                 // Clientes
//                 Clientes.unshift(OpcionPorDefecto)
//                 setClientes(Clientes);
//                 //  Profesionales de entrega
//                 ProfesionalesPertenecientes.unshift(OpcionPorDefecto);
//                 setProfesionalesPertenecientes(ProfesionalesPertenecientes);
//                 // Mecanicos
//                 Mecanicos.unshift(OpcionPorDefecto)
//                 setMecanicos(Mecanicos);
//                 // Repuestos
//                 Repuestos.unshift(OpcionPorDefectoNumber);
//                 setRepuestosDisponibles(Repuestos);
//             } catch (error) {
//                 console.error(`Error al cargar datos: ${error}`);
//             }
//         };
//         CargarDatosIniciales();
//     }, []);

//     React.useEffect(() => {
//         if (datos.NoOrdenDeServicio === '') {
//             setDatos(prev => ({ ...prev, NoOrdenDeServicio: siguienteNoOrdenDeServicio }));
//         }
//     }, [datos.NoOrdenDeServicio]);

//     React.useEffect(() => {
//         CargarProyectosDelCliente();
//         CargarEquiposDelCliente();
//     }, [datos.DocumentoCliente]);

//     React.useEffect(() => {
//         if (messages.length > 0) {
//             const UltimoMensaje = messages[messages.length - 1];
//             if (UltimoMensaje.tipo === 'orden-de-servicio-creada') {
//                 CargarSiguienteNoOrdenDeServicio();
//             }
//         }
//     }, [messages]);

//     // 6. Funciones del componente
//     const CargarSiguienteNoOrdenDeServicio = async () => {
//         try {
//             const SiguienteNoOrdenDeServicio = await ConsultarSiguienteNoOrdenDeServicio();
//             const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
//             setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
//             setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
//         } catch (error) {
//             console.error(`Error al describir la acción: ${error}`);
//         }
//     }

//     const CargarProyectosDelCliente = async () => {
//         try {
//             let DocumentoCliente = {
//                 Cliente: datos.DocumentoCliente
//             };
//             const Proyectos = await ListarProyectos(DocumentoCliente);
//             Proyectos.unshift(OpcionPorDefectoNumber)
//             setProyectos(Proyectos);
//         } catch (error) {
//             console.error(`Error al listar los proyectos: ${error}`);
//         }
//     };

//     const CargarEquiposDelCliente = async () => {
//         try {
//             const EquiposDelCliente = await VerEquiposDelCliente({ IdTipoBodega: ParametroBuscarBodegasReparacion.value, DocumentoPropietario: datos.DocumentoCliente });
//             EquiposDelCliente.unshift(OpcionPorDefectoNumber);
//             setEquiposDelCliente(EquiposDelCliente);
//         } catch (error) {
//             console.error(`Error al describir la acción: ${error}`);
//         }
//     }

//     const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
//         const { name, value } = e.target;

//         setDatos((prev) => {
//             let updated = { ...prev, [name ?? '']: value };

//             if (name === 'DocumentoCliente') {
//                 updated = {
//                     ...updated,
//                     IdEquipoCliente: OpcionPorDefectoNumber.value,
//                     IdProyecto: OpcionPorDefectoNumber.value,
//                 };
//             }

//             return updated;
//         });
//     };

//     const handleGarantiaChange = (value: GarantiaValue) => {
//         setOpcionGarantia(value);
//         setDatos(prev => ({
//             ...prev,
//             Garantia: value === null ? 0 : value
//         }));
//     };

//     const handleAddEquipo = () => {
//         if (equipos.length === 0 || equipos[equipos.length - 1].cantidad !== '' || equipos[equipos.length - 1].descripcion !== '') {
//             setEquipos([...equipos, {
//                 cantidad: '',
//                 descripcion: '',
//                 IdRepuesto: OpcionPorDefectoNumber.value,
//                 cantidadDisponible: 0,
//                 errorCantidad: false
//             }]);
//         }
//     };

//     const handleRemoveEquipo = (index: number) => {
//         if (equipos.length === 1) {
//             setEquipos([{
//                 cantidad: '',
//                 descripcion: '',
//                 IdRepuesto: OpcionPorDefectoNumber.value,
//                 cantidadDisponible: 0,
//                 errorCantidad: false
//             }]);
//         } else {
//             setEquipos(equipos.filter((_, i) => i !== index));
//         }
//     };

//     const handleChangee = ({ index, value, field }: PropsHandleChange) => {
//         const newEquipos = [...equipos];
//         (newEquipos[index] as any)[field] = value;
//         setEquipos(newEquipos);
//     };

//     // Función para consultar la disponibilidad del repuesto
//     const ConsultarDisponibilidadDeRepuesto = async (IdRepuesto: number, index: number) => {
//         try {
//             if (IdRepuesto === OpcionPorDefectoNumber.value) {
//                 // Si es la opción por defecto, resetear la cantidad disponible
//                 const newEquipos = [...equipos];
//                 newEquipos[index].cantidadDisponible = 0;
//                 newEquipos[index].errorCantidad = false;
//                 setEquipos(newEquipos);
//                 return;
//             }

//             const Disponibilidad = await VerDisponibilidadDeRepuesto({
//                 IdTipoBodega: ParametroBuscarBodegasRepuestos.value,
//                 IdRepuesto: IdRepuesto
//             });

//             // Asumimos que la API retorna un array y tomamos el primer elemento
//             const cantidadDisponible = Disponibilidad[0]?.CantidadDisponibleRepuesto || 0;

//             const newEquipos = [...equipos];
//             newEquipos[index].cantidadDisponible = cantidadDisponible;

//             // Validar si la cantidad actual excede la disponible
//             if (newEquipos[index].cantidad && parseInt(newEquipos[index].cantidad) > cantidadDisponible) {
//                 newEquipos[index].errorCantidad = true;
//             } else {
//                 newEquipos[index].errorCantidad = false;
//             }

//             setEquipos(newEquipos);
//         } catch (error) {
//             console.error(`Error al ver la disponibilidad del repuesto: ${error}`);
//             const newEquipos = [...equipos];
//             newEquipos[index].cantidadDisponible = 0;
//             newEquipos[index].errorCantidad = false;
//             setEquipos(newEquipos);
//         }
//     }

//     // Manejador específico para cambios en el repuesto
//     const handleRepuestoChange = (index: number, IdRepuesto: number) => {
//         handleChangee({ index, field: 'IdRepuesto', value: IdRepuesto });
//         ConsultarDisponibilidadDeRepuesto(IdRepuesto, index);
//     };

//     // Manejador específico para cambios en la cantidad con validación
//     const handleCantidadChange = (index: number, value: string) => {
//         const cantidad = parseInt(value) || 0;
//         const disponible = equipos[index].cantidadDisponible;

//         handleChangee({ index, field: 'cantidad', value });

//         // Validar si la cantidad excede lo disponible
//         const newEquipos = [...equipos];
//         newEquipos[index].errorCantidad = cantidad > disponible;
//         setEquipos(newEquipos);
//     };

//     //Función para abrir la alerta
//     const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
//         setMensajeAlerta(mensaje);
//         setTipoAlerta(tipo);
//         setMostrarAlertas(true);
//     };

//     //Se crea referencia para el formulario validador
//     const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
//     const reglasValidacion = [
//         { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
//         { campo: 'IdProyecto', mensaje: 'La obra es obligatoria.' },
//         { campo: 'Garantia', mensaje: 'La garantía es obligatoria.' },
//         { campo: 'DocumentoMecanico', mensaje: 'El mecánico es obligatorio.' },
//         { campo: 'PersonaQueEntrega', mensaje: 'La persona que entrega es obligatoria.' },
//         { campo: 'PersonaQueRecibe', mensaje: 'La persona que recibe es obligatoria.' },
//         { campo: 'IdEquipoCliente', mensaje: 'El equipo es obligatorio' }
//     ];

//     const manejarValidacionExitosa = () => { };

//     // Validación adicional antes de crear la orden
//     const validarEquipos = (): boolean => {
//         for (let i = 0; i < equipos.length; i++) {
//             const equipo = equipos[i];

//             // Validar que tenga repuesto seleccionado
//             if (equipo.IdRepuesto === OpcionPorDefectoNumber.value) {
//                 mostrarMensaje(`El equipo ${i + 1} debe tener un repuesto seleccionado`, 'error');
//                 return false;
//             }

//             // Validar que tenga cantidad
//             if (!equipo.cantidad || equipo.cantidad.trim() === '') {
//                 mostrarMensaje(`El equipo ${i + 1} debe tener una cantidad`, 'error');
//                 return false;
//             }

//             // Validar que la cantidad no exceda lo disponible
//             if (equipo.errorCantidad) {
//                 mostrarMensaje(`La cantidad del equipo ${i + 1} excede la disponibilidad (${equipo.cantidadDisponible} disponibles)`, 'error');
//                 return false;
//             }

//             // Validar que la cantidad sea mayor a 0
//             if (parseInt(equipo.cantidad) <= 0) {
//                 mostrarMensaje(`La cantidad del equipo ${i + 1} debe ser mayor a 0`, 'error');
//                 return false;
//             }
//         }
//         return true;
//     };

//     // Función para realizar la creación de orden de servicio
//     const HandleCrearOrdenDeSerivio = async () => {
//         const esValido = await formularioRef.current?.manejarValidacion();
//         if (esValido) {
//             try {
//                 // Validación adicional de equipos
//                 if (!validarEquipos()) {
//                     return;
//                 }

//                 // 1. Filtrar equipos válidos (con cantidad y repuesto seleccionado)
//                 const detallesValidos = equipos.filter(
//                     equipo => equipo.cantidad.trim() !== '' && equipo.IdRepuesto !== OpcionPorDefectoNumber.value
//                 );

//                 // 2. Validar que haya al menos un equipo
//                 if (detallesValidos.length === 0) {
//                     mostrarMensaje('Debe agregar al menos un repuesto válido', 'error');
//                     return;
//                 }

//                 // 3. Crear objeto con datos principales y detalles
//                 const ordenCompleta = {
//                     ...datos,
//                     Detalles: detallesValidos.map(equipo => ({
//                         Cantidad: Number(equipo.cantidad),
//                         DescripcionEquipo: equipo.descripcion,
//                         IdRepuesto: equipo.IdRepuesto
//                     })),
//                     FechaOrdenDeServicio: datos.FechaOrdenDeServicio.format('YYYY-MM-DD HH:mm:ss')
//                 };

//                 // 4. Enviar a la API
//                 await CrearOrdenDeServicio(ordenCompleta);

//                 mostrarMensaje('Orden de servicio creada correctamente.', 'success');
//                 sendMessage('orden-de-servicio-creada', {});

//                 // 5. Resetear formulario
//                 setEquipos([{
//                     cantidad: '',
//                     descripcion: '',
//                     IdRepuesto: OpcionPorDefectoNumber.value,
//                     cantidadDisponible: 0,
//                     errorCantidad: false
//                 }]);
//                 setDatos({
//                     NoOrdenDeServicio: '',
//                     DocumentoCliente: OpcionPorDefecto.value,
//                     IdProyecto: OpcionPorDefectoNumber.value,
//                     Garantia: null as GarantiaValue,
//                     Descripcion: '',
//                     Observaciones: '',
//                     DocumentoMecanico: OpcionPorDefecto.value,
//                     PersonaQueEntrega: OpcionPorDefecto.value,
//                     PersonaQueRecibe: '',
//                     UsuarioCreacion: documentoUsuarioActivo,
//                     IdEstado: 8,
//                     FechaOrdenDeServicio: dayjs(),
//                     IdEquipoCliente: OpcionPorDefectoNumber.value
//                 });

//             } catch (error) {
//                 console.error(`Error al crear la orden: ${error}`);
//                 mostrarMensaje(`Hubo un error al crear la orden de servicio: ${error}`, 'error');
//             }
//         }
//     }

//     // ✅ Manejador específico para el DateTimePicker
//     const handleFechaChange = (fecha: Dayjs | null) => {
//         setDatos(prev => ({ ...prev, FechaOrdenDeServicio: fecha || dayjs() }));
//     };

//     // 7. Renderizado JSX
//     return (
//         <Card>
//             <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
//                 <Typography variant="subtitle1" color="text.primary">
//                     Creación de órden de servicio
//                 </Typography>
//                 <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
//                     <Input
//                         label='Orden No:'
//                         value={datos.NoOrdenDeServicio}
//                         onChange={handleChange}
//                         tamano='small'
//                         tipo_input='text'
//                         valorname='NoOrdenDeServicio'
//                     />
//                 </Typography>
//             </Box>
//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <FechayHora
//                             label="Fecha y hora"
//                             value={datos.FechaOrdenDeServicio}
//                             onChange={handleFechaChange}
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Empresa/Cliente'
//                             value={datos.DocumentoCliente}
//                             options={clientes}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='DocumentoCliente'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Obra/Proyecto'
//                             value={Number(datos.IdProyecto)}
//                             options={proyectos}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='IdProyecto'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Mecánico'
//                             value={datos.DocumentoMecanico}
//                             options={mecanicos}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='DocumentoMecanico'
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Equipo'
//                             value={datos.IdEquipoCliente}
//                             options={equiposDelCliente}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='IdEquipoCliente'
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* Sección de repuestos */}
//                 {equipos.map((equipo, index) => (
//                     <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
//                         <Grid md={1} xs={12} mt={0.5}>
//                             {index === 0 ? (
//                                 <Button
//                                     variant="contained"
//                                     onClick={handleAddEquipo}
//                                     sx={{ mr: 1, width: { xs: '10%', md: '10%' } }}
//                                 >
//                                     +
//                                 </Button>
//                             ) : (
//                                 <Button
//                                     variant="contained"
//                                     color="error"
//                                     onClick={() => handleRemoveEquipo(index)}
//                                     sx={{ width: { xs: '10%', md: '10%' } }}
//                                 >
//                                     Quitar
//                                 </Button>
//                             )}
//                         </Grid>

//                         <Grid md={2} xs={12} mt={0.5}>
//                             <Input
//                                 label='Cantidad'
//                                 value={equipo.cantidad}
//                                 onChange={(e) => handleCantidadChange(index, e.target.value)}
//                                 tamano='small'
//                                 tipo_input='number'
//                                 error={equipo.errorCantidad}
//                                 helperText={equipo.errorCantidad ? `Máximo: ${equipo.cantidadDisponible}` : ''}
//                             />
//                         </Grid>

//                         <Grid md={3} xs={12} mt={0.5}>
//                             <SelectConBuscador
//                                 label='Repuesto'
//                                 value={equipo.IdRepuesto}
//                                 onChange={(e) => handleRepuestoChange(index, Number(e.target.value))}
//                                 options={repuestosDisponibles}
//                                 size='small'
//                                 valorname='IdRepuesto'
//                             />
//                         </Grid>

//                         <Grid md={2} xs={12} mt={0.5}>
//                             <Input
//                                 label='Cantidad disponible'
//                                 value={equipo.cantidadDisponible.toString()}
//                                 tamano='small'
//                                 tipo_input='text'
//                                 bloqueado
//                             // sx={{
//                             //     backgroundColor: equipo.cantidadDisponible === 0 ? '#ffebee' : '#e8f5e8',
//                             //     '& .MuiInputBase-input': {
//                             //         color: equipo.cantidadDisponible === 0 ? '#d32f2f' : '#2e7d32',
//                             //         fontWeight: 'bold'
//                             //     }
//                             // }}
//                             />
//                         </Grid>

//                         <Grid md={4} xs={12} mt={0.5} display='none'>
//                             <Input
//                                 label='Descripción Equipo'
//                                 value={equipo.descripcion}
//                                 onChange={(e) => handleChangee({ index: index, field: 'descripcion', value: e.target.value })}
//                                 tamano='small'
//                                 tipo_input='text'
//                             />
//                         </Grid>
//                     </Grid>
//                 ))}

//                 <Grid container spacing={1}>
//                     <Grid md={6} xs={12} mt={0.5}>
//                         <strong>¿Aplica garantía? *</strong>
//                         <div>
//                             <label style={{ marginRight: 16 }}>
//                                 <Checkbox
//                                     checked={opcionGarantia === 1}
//                                     onChange={() => handleGarantiaChange(1)}
//                                 />
//                                 <span>Sí</span>
//                             </label>

//                             <label>
//                                 <Checkbox
//                                     checked={opcionGarantia === 0}
//                                     onChange={() => handleGarantiaChange(0)}
//                                 />
//                                 <span>No</span>
//                             </label>
//                         </div>
//                     </Grid>
//                 </Grid>

//                 <Grid container spacing={1} mt={1}>
//                     <Grid md={6} xs={12} mt={0.5} >
//                         <Input
//                             label='Descripcion'
//                             value={datos.Descripcion}
//                             onChange={handleChange}
//                             tamano='small'
//                             tipo_input='textarea'
//                             valorname='Descripcion'
//                         />
//                     </Grid>
//                     <Grid md={6} xs={12} mt={0.5} >
//                         <Input
//                             label='Observaciones'
//                             value={datos.Observaciones}
//                             onChange={handleChange}
//                             tamano='small'
//                             tipo_input='textarea'
//                             valorname='Observaciones'
//                         />
//                     </Grid>
//                 </Grid>

//                 <Grid container spacing={1} mt={1}>
//                     <Grid md={3} xs={12} mt={0.5} >
//                         <InputSelect
//                             label='Entrega'
//                             value={datos.PersonaQueEntrega}
//                             options={profesionalesPertenecientes}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='PersonaQueEntrega'
//                             required
//                         />
//                     </Grid>
//                     <Grid md={3} xs={12} mt={0.5} >
//                         <Input
//                             label='Recibe'
//                             value={datos.PersonaQueRecibe}
//                             onChange={handleChange}
//                             tamano='small'
//                             tipo_input='text'
//                             valorname='PersonaQueRecibe'
//                             required
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <Divider />
//             <CardActions sx={{ justifyContent: 'flex-end' }}>
//                 <Button variant="contained" onClick={HandleCrearOrdenDeSerivio}>
//                     Crear orden
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
//     )
// };

























'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { OpcionPorDefecto, OpcionPorDefectoNumber, ParametroBuscarBodegasReparacion, ParametroBuscarBodegasRepuestos } from '@/lib/constants/option-default';
import { ConsultarSiguienteNoOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioService';
import { CrearOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/CrearOrdenDeServicioService';
import { VerEquiposDelCliente } from '@/services/comercial/ordenes_de_servicio/VerEquiposDelClienteService';
import { VerRepuestosDisponibles } from '@/services/comercial/ordenes_de_servicio/VerRepuestosDisponiblesService';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { listarmecanicos } from '@/services/generales/ListarMecanicosService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Divider,
    SelectChangeEvent,
    Typography,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import InputSelect from '../../../componentes_generales/formulario/Select';
import { VerDisponibilidadDeRepuesto } from '@/services/comercial/ordenes_de_servicio/VerDisponibilidadDeRepuestoService';

// 1. Interfaces ó Types
interface DatosOrdenDeServicio {
    NoOrdenDeServicio: string;
    DocumentoCliente: string;
    IdProyecto: number | null;
    Garantia: number | null;
    Descripcion: string;
    Observaciones: string;
    DocumentoMecanico: string;
    PersonaQueEntrega: string;
    PersonaQueRecibe: string;
    UsuarioCreacion: string | null;
    IdEstado: number | null;
    FechaOrdenDeServicio: Dayjs;
    IdEquipoCliente: number;
}

type GarantiaValue = 0 | 1 | null;

interface Equipo {
    cantidad: string;
    descripcion: string;
    IdRepuesto: number;
    cantidadDisponible: number;
    errorCantidad: boolean;
    esRepuesto: boolean; // Nuevo campo para indicar si es un repuesto
}

interface PropsHandleChange {
    index: number;
    field: keyof Equipo;
    value: Equipo[keyof Equipo];
}

// 2. Compornente principal
export function FormularioCrearOrdenDeServicio(): React.JSX.Element {
    // 3. Hooks de React y otros hooks de librerías
    const theme = useTheme();
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const { sendMessage, messages } = useSocketIO();

    // 4. Estados
    const [datos, setDatos] = React.useState<DatosOrdenDeServicio>({
        NoOrdenDeServicio: '',
        DocumentoCliente: OpcionPorDefecto.value,
        IdProyecto: OpcionPorDefectoNumber.value,
        Garantia: null as GarantiaValue,
        Descripcion: '',
        Observaciones: '',
        DocumentoMecanico: OpcionPorDefecto.value,
        PersonaQueEntrega: OpcionPorDefecto.value,
        PersonaQueRecibe: '',
        UsuarioCreacion: documentoUsuarioActivo,
        IdEstado: 8,
        FechaOrdenDeServicio: dayjs(),
        IdEquipoCliente: OpcionPorDefectoNumber.value
    });
    const [siguienteNoOrdenDeServicio, setSiguienteNoOrdenDeServicio] = React.useState('');
    const [clientes, setClientes] = React.useState<{ value: number | string; label: string }[]>([]);
    const [proyectos, setProyectos] = React.useState<{ value: number | string; label: string }[]>([]);
    const [profesionalesPertenecientes, setProfesionalesPertenecientes] = React.useState<{ value: number | string; label: string }[]>([]);
    const [mecanicos, setMecanicos] = React.useState<{ value: number | string; label: string }[]>([]);
    const [opcionGarantia, setOpcionGarantia] = React.useState<GarantiaValue>(null);
    const [equipos, setEquipos] = React.useState<Equipo[]>([{
        cantidad: '',
        descripcion: '',
        IdRepuesto: OpcionPorDefectoNumber.value,
        cantidadDisponible: 0,
        errorCantidad: false,
        esRepuesto: false // Por defecto no es repuesto
    }]);
    const [equiposDelCliente, setEquiposDelCliente] = React.useState<{ value: number | string; label: string }[]>([]);
    const [repuestosDisponibles, setRepuestosDisponibles] = React.useState<[]>([]);

    //Estados para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // 5. useEffect para carga inicial y sockets
    React.useEffect(() => {
        const CargarDatosIniciales = async () => {
            try {
                // Llamadas y almacenados 
                const [
                    SiguienteNoOrdenDeServicio,
                    Clientes,
                    ProfesionalesPertenecientes,
                    Mecanicos,
                    Repuestos
                ] = await Promise.all([
                    ConsultarSiguienteNoOrdenDeServicio(),
                    ListarClientes(),
                    ListarProfesionalesPertenecientes(),
                    listarmecanicos(),
                    VerRepuestosDisponibles({ IdTipoBodega: ParametroBuscarBodegasRepuestos.value })
                ]);

                // Se asignan los datos que vienen de la bd
                const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
                setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
                setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
                // Clientes
                Clientes.unshift(OpcionPorDefecto)
                setClientes(Clientes);
                //  Profesionales de entrega
                ProfesionalesPertenecientes.unshift(OpcionPorDefecto);
                setProfesionalesPertenecientes(ProfesionalesPertenecientes);
                // Mecanicos
                Mecanicos.unshift(OpcionPorDefecto)
                setMecanicos(Mecanicos);
                // Repuestos
                Repuestos.unshift(OpcionPorDefectoNumber);
                setRepuestosDisponibles(Repuestos);
            } catch (error) {
                console.error(`Error al cargar datos: ${error}`);
            }
        };
        CargarDatosIniciales();
    }, []);

    React.useEffect(() => {
        if (datos.NoOrdenDeServicio === '') {
            setDatos(prev => ({ ...prev, NoOrdenDeServicio: siguienteNoOrdenDeServicio }));
        }
    }, [datos.NoOrdenDeServicio]);

    React.useEffect(() => {
        CargarProyectosDelCliente();
        CargarEquiposDelCliente();
    }, [datos.DocumentoCliente]);

    React.useEffect(() => {
        if (messages.length > 0) {
            const UltimoMensaje = messages[messages.length - 1];
            if (UltimoMensaje.tipo === 'orden-de-servicio-creada') {
                CargarSiguienteNoOrdenDeServicio();
            }
        }
    }, [messages]);

    // 6. Funciones del componente
    const CargarSiguienteNoOrdenDeServicio = async () => {
        try {
            const SiguienteNoOrdenDeServicio = await ConsultarSiguienteNoOrdenDeServicio();
            const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
            setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
            setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
        }
    }

    const CargarProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.DocumentoCliente
            };
            const Proyectos = await ListarProyectos(DocumentoCliente);
            Proyectos.unshift(OpcionPorDefectoNumber)
            setProyectos(Proyectos);
        } catch (error) {
            console.error(`Error al listar los proyectos: ${error}`);
        }
    };

    const CargarEquiposDelCliente = async () => {
        try {
            const EquiposDelCliente = await VerEquiposDelCliente({ IdTipoBodega: ParametroBuscarBodegasReparacion.value, DocumentoPropietario: datos.DocumentoCliente });
            EquiposDelCliente.unshift(OpcionPorDefectoNumber);
            setEquiposDelCliente(EquiposDelCliente);
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
        }
    }

    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        const { name, value } = e.target;

        setDatos((prev) => {
            let updated = { ...prev, [name ?? '']: value };

            if (name === 'DocumentoCliente') {
                updated = {
                    ...updated,
                    IdEquipoCliente: OpcionPorDefectoNumber.value,
                    IdProyecto: OpcionPorDefectoNumber.value,
                };
            }

            return updated;
        });
    };

    const handleGarantiaChange = (value: GarantiaValue) => {
        setOpcionGarantia(value);
        setDatos(prev => ({
            ...prev,
            Garantia: value === null ? 0 : value
        }));
    };

    const handleAddEquipo = () => {
        if (equipos.length === 0 || equipos[equipos.length - 1].cantidad !== '' || equipos[equipos.length - 1].descripcion !== '') {
            setEquipos([...equipos, {
                cantidad: '',
                descripcion: '',
                IdRepuesto: OpcionPorDefectoNumber.value,
                cantidadDisponible: 0,
                errorCantidad: false,
                esRepuesto: false
            }]);
        }
    };

    const handleRemoveEquipo = (index: number) => {
        if (equipos.length === 1) {
            setEquipos([{
                cantidad: '',
                descripcion: '',
                IdRepuesto: OpcionPorDefectoNumber.value,
                cantidadDisponible: 0,
                errorCantidad: false,
                esRepuesto: false
            }]);
        } else {
            setEquipos(equipos.filter((_, i) => i !== index));
        }
    };

    const handleChangee = ({ index, value, field }: PropsHandleChange) => {
        const newEquipos = [...equipos];
        (newEquipos[index] as any)[field] = value;
        setEquipos(newEquipos);
    };

    // Función para consultar la disponibilidad del repuesto
    const ConsultarDisponibilidadDeRepuesto = async (IdRepuesto: number, index: number) => {
        try {
            if (IdRepuesto === OpcionPorDefectoNumber.value) {
                // Si es la opción por defecto, resetear la cantidad disponible
                const newEquipos = [...equipos];
                newEquipos[index].cantidadDisponible = 0;
                newEquipos[index].errorCantidad = false;
                newEquipos[index].esRepuesto = false;
                setEquipos(newEquipos);
                return;
            }

            const Disponibilidad = await VerDisponibilidadDeRepuesto({
                IdTipoBodega: ParametroBuscarBodegasRepuestos.value,
                IdRepuesto: IdRepuesto
            });

            // Asumimos que la API retorna un array y tomamos el primer elemento
            const cantidadDisponible = Disponibilidad[0]?.CantidadDisponibleRepuesto || 0;

            const newEquipos = [...equipos];
            newEquipos[index].cantidadDisponible = cantidadDisponible;
            newEquipos[index].esRepuesto = true;

            // Validar si la cantidad actual excede la disponible
            if (newEquipos[index].cantidad && parseInt(newEquipos[index].cantidad) > cantidadDisponible) {
                newEquipos[index].errorCantidad = true;
            } else {
                newEquipos[index].errorCantidad = false;
            }

            setEquipos(newEquipos);
        } catch (error) {
            console.error(`Error al ver la disponibilidad del repuesto: ${error}`);
            const newEquipos = [...equipos];
            newEquipos[index].cantidadDisponible = 0;
            newEquipos[index].errorCantidad = false;
            newEquipos[index].esRepuesto = false;
            setEquipos(newEquipos);
        }
    }

    // Manejador específico para cambios en el repuesto
    const handleRepuestoChange = (index: number, IdRepuesto: number) => {
        handleChangee({ index, field: 'IdRepuesto', value: IdRepuesto });

        if (IdRepuesto !== OpcionPorDefectoNumber.value) {
            ConsultarDisponibilidadDeRepuesto(IdRepuesto, index);
        } else {
            // Si se selecciona la opción por defecto, no es un repuesto
            const newEquipos = [...equipos];
            newEquipos[index].esRepuesto = false;
            newEquipos[index].cantidadDisponible = 0;
            newEquipos[index].errorCantidad = false;
            setEquipos(newEquipos);
        }
    };

    // Manejador específico para cambios en la cantidad con validación (solo para repuestos)
    const handleCantidadChange = (index: number, value: string) => {
        const cantidad = parseInt(value) || 0;
        const disponible = equipos[index].cantidadDisponible;

        handleChangee({ index, field: 'cantidad', value });

        // Validar solo si es un repuesto y tiene cantidad disponible
        if (equipos[index].esRepuesto) {
            const newEquipos = [...equipos];
            newEquipos[index].errorCantidad = cantidad > disponible;
            setEquipos(newEquipos);
        }
    };

    //Función para abrir la alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    //Se crea referencia para el formulario validador
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
    const reglasValidacion = [
        { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
        { campo: 'IdProyecto', mensaje: 'La obra es obligatoria.' },
        { campo: 'Garantia', mensaje: 'La garantía es obligatoria.' },
        { campo: 'DocumentoMecanico', mensaje: 'El mecánico es obligatorio.' },
        { campo: 'PersonaQueEntrega', mensaje: 'La persona que entrega es obligatoria.' },
        { campo: 'PersonaQueRecibe', mensaje: 'La persona que recibe es obligatoria.' },
        { campo: 'IdEquipoCliente', mensaje: 'El equipo es obligatorio' }
    ];

    const manejarValidacionExitosa = () => { };

    // Validación adicional antes de crear la orden
    const validarEquipos = (): boolean => {
        for (let i = 0; i < equipos.length; i++) {
            const equipo = equipos[i];

            // ✅ NUEVA VALIDACIÓN: Si tiene cantidad pero NO tiene repuesto válido
            if ((equipo.cantidad && equipo.cantidad.trim() !== '') &&
                (equipo.IdRepuesto === OpcionPorDefectoNumber.value || !equipo.esRepuesto)) {
                mostrarMensaje(`Debes seleccionar un repuesto válido en la posición ${i + 1} cuando ingresas una cantidad`, 'error');
                return false;
            }

            // Si es un repuesto, validar que tenga todos los datos requeridos
            if (equipo.esRepuesto) {
                // Validar que tenga repuesto seleccionado
                if (equipo.IdRepuesto === OpcionPorDefectoNumber.value) {
                    mostrarMensaje(`El repuesto ${i + 1} debe tener un repuesto seleccionado`, 'error');
                    return false;
                }

                // Validar que tenga cantidad
                if (!equipo.cantidad || equipo.cantidad.trim() === '') {
                    mostrarMensaje(`El repuesto ${i + 1} debe tener una cantidad`, 'error');
                    return false;
                }

                // Validar que la cantidad no exceda lo disponible
                if (equipo.errorCantidad) {
                    mostrarMensaje(`La cantidad del repuesto ${i + 1} excede la disponibilidad (${equipo.cantidadDisponible} disponibles)`, 'error');
                    return false;
                }

                // Validar que la cantidad sea mayor a 0
                if (parseInt(equipo.cantidad) <= 0) {
                    mostrarMensaje(`La cantidad del repuesto ${i + 1} debe ser mayor a 0`, 'error');
                    return false;
                }

                // Validar que si se ingreso cantidad, el repuesto no puede quedar en SinSeleccionar
                if ((equipo.cantidad !== null && equipo.cantidad !== '') && (equipo.IdRepuesto === 0)) {
                    mostrarMensaje(`Debes seleccionar un repuesto válido en la posición ${i + 1}`, 'error');
                    return false;
                }
            }
            // Si no es repuesto, no se requieren validaciones adicionales
        }
        return true;
    };

    // Función para realizar la creación de orden de servicio
    const HandleCrearOrdenDeSerivio = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                // Validación adicional de equipos (solo para los que son repuestos)
                if (!validarEquipos()) {
                    return;
                }

                // 1. Filtrar solo los repuestos válidos (los que tienen repuesto seleccionado)
                const repuestosValidos = equipos.filter(
                    equipo => equipo.esRepuesto && equipo.cantidad.trim() !== '' && equipo.IdRepuesto !== OpcionPorDefectoNumber.value
                );

                // 2. NO es obligatorio tener repuestos - puede ser solo mantenimiento

                // 3. Crear objeto con datos principales y detalles (solo repuestos válidos)
                const ordenCompleta = {
                    ...datos,
                    Detalles: repuestosValidos.map(equipo => ({
                        Cantidad: Number(equipo.cantidad),
                        DescripcionEquipo: equipo.descripcion,
                        IdRepuesto: equipo.IdRepuesto
                    })),
                    FechaOrdenDeServicio: datos.FechaOrdenDeServicio.format('YYYY-MM-DD HH:mm:ss')
                };

                // 4. Enviar a la API
                await CrearOrdenDeServicio(ordenCompleta);

                mostrarMensaje('Orden de servicio creada correctamente.', 'success');
                sendMessage('orden-de-servicio-creada', {});

                // 5. Resetear formulario
                setEquipos([{
                    cantidad: '',
                    descripcion: '',
                    IdRepuesto: OpcionPorDefectoNumber.value,
                    cantidadDisponible: 0,
                    errorCantidad: false,
                    esRepuesto: false
                }]);
                setDatos({
                    NoOrdenDeServicio: '',
                    DocumentoCliente: OpcionPorDefecto.value,
                    IdProyecto: OpcionPorDefectoNumber.value,
                    Garantia: null as GarantiaValue,
                    Descripcion: '',
                    Observaciones: '',
                    DocumentoMecanico: OpcionPorDefecto.value,
                    PersonaQueEntrega: OpcionPorDefecto.value,
                    PersonaQueRecibe: '',
                    UsuarioCreacion: documentoUsuarioActivo,
                    IdEstado: 8,
                    FechaOrdenDeServicio: dayjs(),
                    IdEquipoCliente: OpcionPorDefectoNumber.value
                });
                setOpcionGarantia(null);

            } catch (error) {
                console.error(`Error al crear la orden: ${error}`);
                mostrarMensaje(`Hubo un error al crear la orden de servicio: ${error}`, 'error');
            }
        }
    }

    // ✅ Manejador específico para el DateTimePicker
    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaOrdenDeServicio: fecha || dayjs() }));
    };

    // 7. Renderizado JSX
    return (
        <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                <Typography variant="subtitle1" color="text.primary">
                    Creación de órden de servicio
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                    <Input
                        label='Orden No:'
                        value={datos.NoOrdenDeServicio}
                        onChange={handleChange}
                        tamano='small'
                        tipo_input='text'
                        valorname='NoOrdenDeServicio'
                        bloqueado
                    />
                </Typography>
            </Box>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <FechayHora
                            label="Fecha y hora"
                            value={datos.FechaOrdenDeServicio}
                            onChange={handleFechaChange}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa/Cliente'
                            value={datos.DocumentoCliente}
                            options={clientes}
                            size='small'
                            onChange={handleChange}
                            valorname='DocumentoCliente'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Obra/Proyecto'
                            value={Number(datos.IdProyecto)}
                            options={proyectos}
                            size='small'
                            onChange={handleChange}
                            valorname='IdProyecto'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Mecánico'
                            value={datos.DocumentoMecanico}
                            options={mecanicos}
                            size='small'
                            onChange={handleChange}
                            valorname='DocumentoMecanico'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Equipo'
                            value={datos.IdEquipoCliente}
                            options={equiposDelCliente}
                            size='small'
                            onChange={handleChange}
                            valorname='IdEquipoCliente'
                        />
                    </Grid>
                </Grid>

                {/* Sección de repuestos (OPCIONAL) */}
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Repuestos utilizados (Opcional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Solo complete esta sección si se utilizaron repuestos en la reparación
                    </Typography>

                    {equipos.map((equipo, index) => (
                        <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                            <Grid md={1} xs={12} mt={0.5}>
                                {index === 0 ? (
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddEquipo}
                                        sx={{ mr: 1, width: { xs: '10%', md: '10%' } }}
                                    >
                                        +
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveEquipo(index)}
                                        sx={{ width: { xs: '10%', md: '10%' } }}
                                    >
                                        Quitar
                                    </Button>
                                )}
                            </Grid>

                            <Grid md={2} xs={12} mt={0.5}>
                                <Input
                                    label='Cantidad'
                                    value={equipo.cantidad}
                                    onChange={(e) => handleCantidadChange(index, e.target.value)}
                                    tamano='small'
                                    tipo_input='number'
                                    error={equipo.errorCantidad}
                                    helperText={equipo.errorCantidad ? `Máximo: ${equipo.cantidadDisponible}` : ''}
                                    bloqueado={!equipo.esRepuesto}
                                />
                            </Grid>

                            <Grid md={3} xs={12} mt={0.5}>
                                <SelectConBuscador
                                    label='Repuesto'
                                    value={equipo.IdRepuesto}
                                    onChange={(e) => handleRepuestoChange(index, Number(e.target.value))}
                                    options={repuestosDisponibles}
                                    size='small'
                                    valorname='IdRepuesto'
                                />
                            </Grid>

                            <Grid md={2} xs={12} mt={0.5}>
                                <Input
                                    label='Cantidad disponible'
                                    value={equipo.esRepuesto ? equipo.cantidadDisponible.toString() : 'N/A'}
                                    tamano='small'
                                    tipo_input='text'
                                    bloqueado
                                // sx={{
                                //     backgroundColor: equipo.esRepuesto
                                //         ? (equipo.cantidadDisponible === 0 ? '#ffebee' : '#e8f5e8')
                                //         : '#f5f5f5',
                                //     '& .MuiInputBase-input': {
                                //         color: equipo.esRepuesto
                                //             ? (equipo.cantidadDisponible === 0 ? '#d32f2f' : '#2e7d32')
                                //             : '#666',
                                //         fontWeight: 'bold'
                                //     }
                                // }}
                                />
                            </Grid>

                            <Grid md={4} xs={12} mt={0.5}>
                                <Input
                                    label='Descripción adicional (opcional)'
                                    value={equipo.descripcion}
                                    onChange={(e) => handleChangee({ index: index, field: 'descripcion', value: e.target.value })}
                                    tamano='small'
                                    tipo_input='text'
                                // placeholder="Observaciones sobre el repuesto..."
                                />
                            </Grid>
                        </Grid>
                    ))}
                </Box>

                <Grid container spacing={1}>
                    <Grid md={6} xs={12} mt={0.5}>
                        <strong>¿Aplica garantía? *</strong>
                        <div>
                            <label style={{ marginRight: 16 }}>
                                <Checkbox
                                    checked={opcionGarantia === 1}
                                    onChange={() => handleGarantiaChange(1)}
                                />
                                <span>Sí</span>
                            </label>

                            <label>
                                <Checkbox
                                    checked={opcionGarantia === 0}
                                    onChange={() => handleGarantiaChange(0)}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={1} mt={1}>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Descripción del servicio'
                            value={datos.Descripcion}
                            onChange={handleChange}
                            tamano='small'
                            tipo_input='textarea'
                            valorname='Descripcion'
                        // placeholder="Describa el trabajo realizado..."
                        />
                    </Grid>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Observaciones generales'
                            value={datos.Observaciones}
                            onChange={handleChange}
                            tamano='small'
                            tipo_input='textarea'
                            valorname='Observaciones'
                        // placeholder="Observaciones adicionales..."
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={1} mt={1}>
                    <Grid md={3} xs={12} mt={0.5} >
                        <InputSelect
                            label='Persona que entrega'
                            value={datos.PersonaQueEntrega}
                            options={profesionalesPertenecientes}
                            size='small'
                            onChange={handleChange}
                            valorname='PersonaQueEntrega'
                            required
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5} >
                        <Input
                            label='Persona que recibe'
                            value={datos.PersonaQueRecibe}
                            onChange={handleChange}
                            tamano='small'
                            tipo_input='text'
                            valorname='PersonaQueRecibe'
                            required
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={HandleCrearOrdenDeSerivio}>
                    Crear orden
                </Button>
                <FormularioValidator
                    ref={formularioRef}
                    datos={datos}
                    reglasValidacion={reglasValidacion}
                    onValid={manejarValidacionExitosa}
                />
            </CardActions>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </Card>
    )
};