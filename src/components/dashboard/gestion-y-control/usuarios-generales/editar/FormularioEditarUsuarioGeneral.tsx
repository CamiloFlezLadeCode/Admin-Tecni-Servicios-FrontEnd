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
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Modal,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple, X } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

const EstadoUsuarioGeneral = [
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
]

interface Datos {
    Nombres: string;
    Apellidos: string;
    TipoDocumento: string;
    Documento: string;
    Direccion: string;
    Celular1: string;
    Celular2: string;
    Correo: string;
    UsuarioCreacion: any;
    Estado: string;
    Roles: any[];
    Nivel: string;
    Contacto: string;
}

interface Props {
    readonly onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly DatosUsuarioAActualizar: string;
    readonly sendMessage: (event: string, payload: any) => void;
}

export function FormularioEditarUsuarioGeneral({ onMostrarMensaje, DatosUsuarioAActualizar, sendMessage }: Props): React.JSX.Element {
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const EditarUsuarioGeneral = async () => {
        try {
            setModalAbierto(true);
            CargarDatosIniciales();
            await ConsultarUsuarioGeneral(DatosUsuarioAActualizar);
        } catch (error) {
            mostrarMensaje(`Error al cargar los datos del usuario general. Error: ${error}`, 'error');
        }
    };
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
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

    const CargarDatosIniciales = async () => {
        try {
            const [
                TipoDocumentos,
                Roles,
                Niveles
            ] = await Promise.all([
                ListarTiposDeDocumentos(),
                ListarRoles(),
                ListarNiveles()
            ]);
            setTiposDeDocumentos(TipoDocumentos);
            setRoles(Roles);
            setNiveles(Niveles)
        } catch (error) {
            console.error(`Error al cargar los datos: ${error}`);
        }
    }
    // React.useEffect(() => {
    //     CargarTiposDeDocumentos();
    //     CargarRoles();
    //     CargarNiveles();
    // }, []);
    //Se maneja el estado para todos los campos
    // const [datos, setDatos] = React.useState({
    //     Nombres: '',
    //     Apellidos: '',
    //     TipoDocumento: '',
    //     Documento: '',
    //     Direccion: '',
    //     Celular: '',
    //     Correo: '@gmail.com',
    //     UsuarioCreacion: documentoUsuarioActivo,
    //     Estado: '1',
    //     Roles: [],
    //     Nivel: ''
    // });
    const [datos, setDatos] = React.useState<Datos>({
        Nombres: '',
        Apellidos: '',
        TipoDocumento: '',
        Documento: '',
        Direccion: '',
        Celular1: '',
        Celular2: '',
        Correo: '@gmail.com',
        UsuarioCreacion: documentoUsuarioActivo,
        Estado: '1',
        Roles: [],
        Nivel: '',
        Contacto: ''
    })
    //Se consulta usuario general a editar
    const ConsultarUsuarioGeneral = async (DocumentoUsuarioGeneral: string) => {
        try {
            const DatosUsuarioGeneral = await ConsultarUsuarioGeneralPorDocumento(DocumentoUsuarioGeneral);
            // Transformar los roles de IDs a nombres
            // const rolesArray = (DatosUsuarioGeneral[0].Roles ?? '')
            //     .split(',')
            //     .map((roleId: any) => {
            //         const trimmedId = Number(roleId.trim());
            //         return trimmedId; // Devuelve el nombre o el ID si no se encuentra
            // });
            const rolesArray = (DatosUsuarioGeneral[0].Roles ?? '')
                .split(',')
                .map((roleId: any) => {
                    const trimmedId = roleId.trim();
                    return trimmedId ? Number(trimmedId) : null; // Devuelve null si el ID está vacío
                })
                .filter((roleId: any) => roleId !== null); // Filtra los valores nulos

            setDatos({
                Nombres: DatosUsuarioGeneral[0].Nombres,
                Apellidos: DatosUsuarioGeneral[0].Apellidos,
                TipoDocumento: DatosUsuarioGeneral[0].TipoDocumento,
                Documento: DatosUsuarioGeneral[0].Documento,
                Direccion: DatosUsuarioGeneral[0].Direccion,
                Celular1: DatosUsuarioGeneral[0].Celular1,
                Celular2: DatosUsuarioGeneral[0].Celular2,
                Correo: DatosUsuarioGeneral[0].Correo,
                UsuarioCreacion: DatosUsuarioGeneral[0].UsuarioCreacion,
                Estado: DatosUsuarioGeneral[0].Estado,
                Roles: rolesArray,
                Nivel: DatosUsuarioGeneral[0].Nivel,
                Contacto: DatosUsuarioGeneral[0].Contacto,
            })
            return DatosUsuarioGeneral;
        } catch (error) {
            console.error('Error...', error);
        }
    }
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
        try {
            await ActualizarUsuarioGeneral(datos);
            sendMessage('usuario-actualizado', {});
            // mostrarMensaje('Usuario general actualizado exitosamente', 'success');
            onMostrarMensaje('Usuario general actualizado exitosamente', 'success');
        } catch (error) {
            // mostrarMensaje(`Error al actualizar el usuario general: ${error}`, 'error');
            onMostrarMensaje(`Error al actualizar el usuario general: ${error}`, 'error');
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

    //Se maneja estado para mostrar y ocultar campo de contacto, cuando se realiza el registro de un usuario con el rol de cliente
    const [mostrarCampoContacto, setMostrarCampoContacto] = React.useState<'none' | 'block'>('none');
    //Mostrar y ocultar campo contacto
    React.useEffect(() => {
        if (datos.Roles.includes(4)) {
            setMostrarCampoContacto('block');
        } else {
            setMostrarCampoContacto('none');
            setDatos((prev) => ({
                ...prev,
                Contacto: ''
            }));
        }
    }, [datos.Roles])
    return (
        <>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
            <IconButton
                size="small"
                color="primary"
                onClick={EditarUsuarioGeneral}
                title='Editar'
            >
                <PencilSimple size={20} weight="bold" />
            </IconButton>
            <Modal
                open={modalAbierto}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setModalAbierto(false);
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // width: '90%',
                        // maxWidth: 1000,
                        // width: '80%',
                        width: {
                            xs: '95%',
                            sm: '90%',
                            md: '80%',
                            lg: '70%',
                        },
                        [theme.breakpoints.down('xl')]: {
                            // width: 700,
                        },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <IconButton
                        onClick={() => setModalAbierto(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <X />
                    </IconButton>
                    <Typography variant="subtitle1" mb={1}>
                        Actualizar Usuario
                    </Typography>
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
                                        bloqueado={true}
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
                                        label='Celular 1'
                                        value={datos.Celular1}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='Celular1'
                                        maximalongitud={10}
                                    />
                                </Grid>
                                <Grid md={2} xs={12} mt={0.5}>
                                    <Input
                                        label='Celular 2'
                                        value={datos.Celular2}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='Celular2'
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
                                <Grid
                                    sx={{
                                        display: mostrarCampoContacto
                                    }}
                                    md={4} xs={12} mt={0.5}>
                                    <Input
                                        label='Contacto'
                                        value={datos.Contacto}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='Contacto'
                                        mostrar={mostrarCampoContacto}
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
                    </Card>
                </Box>
            </Modal>
        </>
    );
};