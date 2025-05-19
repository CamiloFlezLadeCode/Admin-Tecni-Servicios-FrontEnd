'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import CircularProgressWithLabel from '@/components/dashboard/componentes_generales/mensajedecarga/CircularProgressWithLabel';
import { crearCliente, verificarClienteExistenteService } from '@/services/gestionycontrol/clientes/CrearClienteService';
import TipoDocumentos from '@/services/TipoDocumentos';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { UserContext } from '@/contexts/user-context';
import { CrearUsuario } from '@/services/gestionycontrol/usuarios/CrearUsuarioService';
import { Typography } from '@mui/material';
import { CrearMecanico } from '@/services/gestionycontrol/mecanicos/CrearMecanicoService';
import { ListarRoles } from '@/services/generales/ListarRolesService';
import { ListarNiveles } from '@/services/generales/ListarNivelesService';
import SelectMultiple from '@/components/dashboard/componentes_generales/formulario/SelectMultiple';
import { DATE_VALIDATION_PROP_NAMES } from '@mui/x-date-pickers/internals/utils/validation/extractValidationProps';
import { ListarTiposDeDocumentos } from '@/services/generales/ListarTipoDeDocumentosService';

const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const EstadoMecanico = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

export function FormularioCrearUsuarioGeneral(): React.JSX.Element {
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
        CargarRoles();
        CargarNiveles();
        CargarTiposDeDocumentos();
    }, []);
    //Se maneja el estado para todos los campos
    const [datos, setDatos] = React.useState({
        Nombres: '',
        Apellidos: '',
        TipoDocumento: '1',
        Documento: '',
        Direccion: '',
        Celular: '',
        Correo: '@gmail.com',
        UsuarioCreacion: documentoUsuarioActivo,
        Estado: '1',
        Roles: [],
        Nivel: ''
    });
    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
        { campo: 'Apellidos', mensaje: 'El apellido es obligatorio.' },
        { campo: 'Documento', mensaje: 'El documento es obligatorio.' },
        { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
        { campo: 'Celular', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
        { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
        { campo: 'Estado', mensaje: 'El estado es obligatorio' },
        { campo: 'Roles', mensaje: 'El rol es obligatorio' },
        { campo: 'Nivel', mensaje: 'El nivel es obligatorio' }
    ];
    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);

    };
    // Crear una referencia para el FormularioValidator
    const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);
    const handleCrearUsuarioGeneral = async () => {
        // Validar formulario
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                // const data = await CrearUsuarioGeneral(datos);
                mostrarMensaje('Usuario general creado exitosamente', 'success');
            } catch (error) {

            }
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
    //Función para manejar el cambio en todos los campos
    const handleChange = async (e: SelectChangeEvent<string | string[]> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };
    const MostrarRoles = async () => {
        mostrarMensaje(`Estos son los roles del usuario: ${datos.Roles}`, 'success')
    };
    return (
        <Card>
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de usuario general</Typography>
            <Divider />
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
                            options={EstadoMecanico}
                            size='small'
                            valorname='Estado'
                            // onChange={handleChangeEstado}
                            onChange={handleChange}
                        />
                    </Grid>
                    {/* <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Rol'
                            value={datos.Roles}
                            options={roles}
                            size='small'
                            onChange={handleChange}
                            valorname='Roles'
                            bloqueado={true}
                        />
                    </Grid> */}
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
                <Grid container spacing={1} mt={0.5}>
                    {/* <Grid md={12} xs={12} mt={0.5}>
                        <SelectMultiple
                            label='Roles'
                            options={roles}
                            value={datos.Roles}
                            onChange={handleChange}
                            valorname='Roles'
                        />
                    </Grid> */}
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearUsuarioGeneral}>
                    Crear usuario
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