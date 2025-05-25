'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import SelectMultiple from '@/components/dashboard/componentes_generales/formulario/SelectMultiple';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { UserContext } from '@/contexts/user-context';
import { ListarNiveles } from '@/services/generales/ListarNivelesService';
import { ListarRoles } from '@/services/generales/ListarRolesService';
import { ListarTiposDeDocumentos } from '@/services/generales/ListarTipoDeDocumentosService';
import { ActualizarUsuarioGeneral } from '@/services/gestionycontrol/usuariosgenerales/ActualizarUsuarioGeneralService';
import { ConsultarUsuarioGeneralPorDocumento } from '@/services/gestionycontrol/usuariosgenerales/ConsultarUsuarioGeneralPorDocumentoService';
import { VerificarExistenciaUsuario } from '@/services/gestionycontrol/usuariosgenerales/VerificarExistenciaUsuarioGeneralService';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
// import { useWebSocket } from '@/hooks/use-WebSocket'; //Se llama la configuración del WebSocket
import { useSocketIO } from '@/hooks/use-WebSocket';

const EstadoUsuarioGeneral = [
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
]

export function FormularioEditarUsuarioGeneral({ DatosUsuarioAActualizar }: any): React.JSX.Element {
    const [input, setInput] = React.useState('');
    const { sendMessage, messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);
    const handleSend = () => {
        if (input.trim()) {
            // sendMessage(input);
            sendMessage('usuario-actualizado', {});
            setInput('');
        }
    };
    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    //Listar tipos de documentos
    const [tipodedocumentos, setTiposDeDocumentos] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarTiposDeDocumentos = async () => {
        try {
            const TiposDeDocumentos = await ListarTiposDeDocumentos();
            setTiposDeDocumentos(TiposDeDocumentos);
        } catch (error) {
            console.log('Error al listar los tipos de documentos: ', error);
        }
    }
    //Listar roles
    const [roles, setRoles] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarRoles = async () => {
        try {
            const Roles = await ListarRoles();
            setRoles(Roles);
        } catch (error) {
            console.error('Error al listar los roles: ', error);
        }
    };
    //Listar niveles
    const [niveles, setNiveles] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarNiveles = async () => {
        try {
            const Niveles = await ListarNiveles();
            setNiveles(Niveles);
        } catch (error) {
            console.error('Error al listar los niveles: ', error);
        }
    };
    React.useEffect(() => {
        CargarTiposDeDocumentos();
        CargarRoles();
        CargarNiveles();
    }, []);
    //Se maneja el estado para todos los campos
    const [datos, setDatos] = React.useState({
        Nombres: '',
        Apellidos: '',
        TipoDocumento: '',
        Documento: '',
        Direccion: '',
        Celular: '',
        Correo: '@gmail.com',
        UsuarioCreacion: documentoUsuarioActivo,
        Estado: '1',
        Roles: [],
        Nivel: ''
    });
    //Se consulta usuario general a editar
    const ConsultarUsuarioGeneral = async (DocumentoUsuarioGeneral: string) => {
        try {
            const DatosUsuarioGeneral = await ConsultarUsuarioGeneralPorDocumento(DocumentoUsuarioGeneral);
            return DatosUsuarioGeneral;
        } catch (error) {
            console.error('Error...', error);
        }
    }
    // React.useEffect(() => {
    //     const fetchUsuarioGeneral = async () => {
    //         const documento = DatosUsuarioAActualizar.Documento;
    //         if (documento && documento.length > 0) {
    //             console.log('Documento a consultar:', documento);
    //             try {
    //                 const usuarioGeneralData = await ConsultarUsuarioGeneral(documento);
    //                 console.log('Datos del usuario general:', usuarioGeneralData);
    //                 if (usuarioGeneralData && usuarioGeneralData.length > 0) {
    //                     const userData = usuarioGeneralData[0]; // Accede al primer elemento del arreglo
    //                     // Crear un mapa de roles para facilitar la transformación
    //                     const rolesMap = new Map(roles.map(role => [role.value, role.label]));
    //                     setDatos({
    //                         Nombres: userData.Nombres ?? '',
    //                         Apellidos: userData.Apellidos ?? '',
    //                         TipoDocumento: userData.TipoDocumento ?? '',
    //                         Documento: userData.Documento ?? '',
    //                         Direccion: userData.Direccion ?? '',
    //                         Celular: userData.Celular ?? '',
    //                         Correo: userData.Correo ?? '@gmail.com',
    //                         UsuarioCreacion: documentoUsuarioActivo,
    //                         Estado: userData.Estado ?? '1',
    //                         // Roles: (userData.Roles ?? '').split(',').map((role: string) => role.trim()),
    //                         Roles: (userData.Roles ?? '').split(',').map((roleId: string) => rolesMap.get(Number(roleId.trim())) ?? roleId), // Aquí transformas los IDs a nombres
    //                         Nivel: userData.Nivel ?? ''
    //                     });
    //                 } else {
    //                     console.error('No se encontraron datos del usuario.');
    //                 }
    //             } catch (error) {
    //                 console.error("Error al consultar el usuario general:", error);
    //             }
    //         } else {
    //             console.error("Documento inválido");
    //         }
    //     };

    //     fetchUsuarioGeneral();
    // }, [DatosUsuarioAActualizar.Documento]);

    //Se definen las reglas con su respectivo mensaje de alerta
    React.useEffect(() => {
        const fetchUsuarioGeneral = async () => {
            const documento = DatosUsuarioAActualizar.Documento;
            if (documento && documento.length > 0) {
                // console.log('Documento a consultar:', documento);
                try {
                    const usuarioGeneralData = await ConsultarUsuarioGeneral(documento);
                    // console.log('Datos del usuario general:', usuarioGeneralData);
                    if (usuarioGeneralData && usuarioGeneralData.length > 0) {
                        const userData = usuarioGeneralData[0]; // Accede al primer elemento del arreglo

                        // Crear un mapa de roles para facilitar la transformación
                        const rolesMap = new Map(roles.map(role => [role.value, role.label]));

                        // Transformar los roles de IDs a nombres
                        const rolesArray = (userData.Roles ?? '')
                            .split(',')
                            .map((roleId: any) => {
                                const trimmedId = Number(roleId.trim());
                                return rolesMap.get(trimmedId) || trimmedId; // Devuelve el nombre o el ID si no se encuentra
                            });

                        setDatos({
                            Nombres: userData.Nombres ?? '',
                            Apellidos: userData.Apellidos ?? '',
                            TipoDocumento: userData.TipoDocumento ?? '',
                            Documento: userData.Documento ?? '',
                            Direccion: userData.Direccion ?? '',
                            Celular: userData.Celular ?? '',
                            Correo: userData.Correo ?? '@gmail.com',
                            UsuarioCreacion: documentoUsuarioActivo,
                            Estado: userData.Estado ?? '1',
                            Roles: rolesArray, // Asigna el array transformado
                            Nivel: userData.Nivel ?? ''
                        });
                    } else {
                        console.error('No se encontraron datos del usuario.');
                    }
                } catch (error) {
                    console.error("Error al consultar el usuario general:", error);
                }
            } else {
                console.error("Documento inválido");
            }
        };

        fetchUsuarioGeneral();
    }, [DatosUsuarioAActualizar.Documento]);

    const reglasValidacion = [
        { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
        { campo: 'Apellidos', mensaje: 'El apellido es obligatorio.' },
        { campo: 'Documento', mensaje: 'El documento es obligatorio.' },
        { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
        { campo: 'Celular', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
        { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
        { campo: 'Estado', mensaje: 'El estado es obligatorio' },
        { campo: 'Roles', mensaje: 'El rol es obligatorio' },
        // { campo: 'Nivel', mensaje: 'El nivel es obligatorio' }
    ];
    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);

    };
    // Crear una referencia para el FormularioValidator
    // const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
    const handleActualizarUsuarioGeneral = async () => {
        // // Validar formulario
        // const esValido = await formularioRef.current?.manejarValidacion();
        // if (esValido) {
        //     try {
        //         await CrearUsuarioGeneral(datos);
        //         mostrarMensaje('Usuario general creado exitosamente', 'success');
        //         // Limpiar formulario
        //         setDatos({
        //             Nombres: '',
        //             Apellidos: '',
        //             TipoDocumento: '1',
        //             Documento: '',
        //             Direccion: '',
        //             Celular: '',
        //             Correo: '@gmail.com',
        //             UsuarioCreacion: documentoUsuarioActivo,
        //             Estado: '1',
        //             Roles: [],
        //             Nivel: ''
        //         });
        //     } catch (error) {
        //         mostrarMensaje(`Error al crear el usuario general: ${error}`, 'error');
        //     }
        // }
        try {
            await ActualizarUsuarioGeneral(datos);
            mostrarMensaje('Usuario general actualizado exitosamente', 'success');
            // // Limpiar formulario
            // setDatos({
            //     Nombres: '',
            //     Apellidos: '',
            //     TipoDocumento: '1',
            //     Documento: '',
            //     Direccion: '',
            //     Celular: '',
            //     Correo: '@gmail.com',
            //     UsuarioCreacion: documentoUsuarioActivo,
            //     Estado: '1',
            //     Roles: [],
            //     Nivel: ''
            // });
        } catch (error) {
            mostrarMensaje(`Error al crear el usuario general: ${error}`, 'error');
        }
    }
    // Dentro del estado:
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // Función para abrir alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    // Función para verificar si el cliente ya existe
    const VerificarExistencia = async (documento: string) => {
        if (!documento) return; // Si no hay documento, no consultar
        const result = await VerificarExistenciaUsuario(documento);
        // Verificamos el resultado
        if (result) {
            mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
        }
    };
    //Función para manejar el cambio en todos los campos
    const handleChange = async (e: SelectChangeEvent<string | string[]> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            // [name]: value
            [name ?? '']: value,
        }));

        if (name === 'Documento') {
            if (typeof value === 'string' && value.trim() !== '') {
                await VerificarExistencia(value);
            }
        }
    };
    return (
        <Card>
            {/* <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de usuario general</Typography>
            <Divider /> */}
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Nombres'
                            value={datos.Nombres}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Nombres'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Apellidos'
                            value={datos.Apellidos}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Apellidos'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Tipo de documento'
                            value={datos.TipoDocumento}
                            options={tipodedocumentos}
                            size='small'
                            onChange={handleChange}
                            valorname='TipoDocumento'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Documento'
                            value={datos.Documento}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Documento'
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Dirección'
                            value={datos.Direccion}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Direccion'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Celular'
                            value={datos.Celular}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Celular'
                            maximalongitud={10}
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Correo'
                            value={datos.Correo}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Correo'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Estado'
                            value={datos.Estado}
                            options={EstadoUsuarioGeneral}
                            size='small'
                            valorname='Estado'
                            // onChange={handleChangeEstado}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid md={10} xs={12} mt={0.5}>
                        <SelectMultiple
                            label='Rol/es'
                            options={roles}
                            value={datos.Roles}
                            onChange={handleChange}
                            valorname='Roles'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Nivel'
                            value={datos.Nivel}
                            options={niveles}
                            size='small'
                            onChange={handleChange}
                            valorname='Nivel'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleActualizarUsuarioGeneral}>
                    Guardar cambios
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
    );
};