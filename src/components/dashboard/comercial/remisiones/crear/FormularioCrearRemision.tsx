'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelectConEstado from '@/components/dashboard/componentes_generales/formulario/SelectConEstado';
import { UserContext } from '@/contexts/user-context';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import ListarEquipos from '@/services/generales/ListarEquiposService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import InputSelect from '../../../componentes_generales/formulario/Select';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { Typography } from '@mui/material';

const Empresas = [
    { value: '1', label: 'Empresa/Cliente #1' },
    { value: '2', label: 'Empresa/Cliente #2' },
    { value: '3', label: 'Cinnamom Overdressed Ceere Software SAS' },
]

//Interface para equipo
interface Equipo {
    value: string | number,
    label: string,
    estado: 'Reparación' | 'Disponible' | 'No disponible',
}
interface Option {
    value: string
    label: React.ReactNode
}

//Se mapean los colores para los estados
const estadoColor: Record<Equipo['estado'], string> = {
    Disponible: '#4caf50',    // verde
    "No disponible": '#f44336', // rojo
    Reparación: '#ff9800',    // amarillo
}

interface EquipoEstadoOption {
    value: string | number;
    label: string;
    estado: 'Disponible' | 'No disponible' | 'Reparación';
}

export function FormularioCrearRemision(): React.JSX.Element {
    //Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;


    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

    //Llenado para el select de clientes
    const [clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([]);

    const CargarClientes = async () => {
        try {
            const Clientes = await ListarClientes();
            setClientes(Clientes);
        } catch (error) {
            console.error('Error al listar los clientes: ', error);
        }
    };

    const [categorias, setCategoria] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarCategorias = async () => {
        try {
            const Refe = await ListarCategorias();
            setCategoria(Refe);
        } catch (error) {
            console.error('Error al listar las categorias: ', error);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            CargarClientes();
            CargarCategorias();
        };
        fetchData();
    }, []);





    //Se maneja el estado para todos los campos del formulario
    const [datos, setDatos] = React.useState({
        Cliente: '',
        Proyecto: '',
        Categoria: '',
        Equipo: '',
        Subarrendatario: '',
        Bodega: '',
        EquipoDisponible: '',
        Bodeguero: '',
        Despachador: '',
        Transportador: '',
        Vehiculo: '',
        Placa: '',
        Recibe: '',
        ObservacionesEmpresa: '',
        ObservacionesCliente: ''
    });


    //Llenado del select de proyectos
    const [proyectos, setProyectos] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.Cliente
            };
            const ProyectosDelCliente = await ListarProyectos(DocumentoCliente);
            setProyectos(ProyectosDelCliente);
        } catch (error) {
            console.error('Error al listar los proyectos del cliente: ', error);
        }
    };

    React.useEffect(() => {
        const FetchDataCargarProyectosDelCliente = async () => {
            CargarProyectosDelCliente();
        };
        FetchDataCargarProyectosDelCliente();
    }, [datos.Cliente])

    //Llenado para el select de los equipos
    const [equipos, setEquipos] = React.useState<Equipo[]>([])
    const CargarEquiposPorCategoria = async () => {
        try {
            const ValorCategoria = { IdCategoria: datos.Categoria };
            const EquiposPorCategoria: Equipo[] = await ListarEquipos(ValorCategoria);

            // Mapear directamente sin JSX
            const opciones: EquipoEstadoOption[] = EquiposPorCategoria.map(equipo => ({
                value: equipo.value,
                label: equipo.label,  // solo string
                estado: equipo.estado,
            }));

            setEquipos(opciones);
        } catch (error) {
            console.error('Error al listar los equipos: ', error);
        }
    };
    React.useEffect(() => {
        const FetchDataCargarEquiposPorCategoria = async () => {
            CargarEquiposPorCategoria();
        };
        FetchDataCargarEquiposPorCategoria();
    }, [datos.Categoria]);

    //Función para manejar el cambio en todos los campos del formulario
    const handleChange = async (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name ?? '']: value,
            // Si cambia Cliente limpiar proyecto seleccionado
            ...(name === 'Cliente' ? { Proyecto: '' } : {}),
            ...(name === 'Categoria' ? { Equipo: '' } : {}),
        }));
    };


    //Prueba
    const [nombre, setNombre] = React.useState('');
    const CambiarValorAnombre = () => {

        let Valores = ['1', '2', '3', '4', '5', '6', '7', '7'];
        const indiceAleatorio = Math.floor(Math.random() * Valores.length);
        console.log(indiceAleatorio);
        // let ValorAleatorio = Math.floor(Math.random() * 10) + 1;
        // console.error(ValorAleatorio);
        setNombre(Valores[indiceAleatorio]);

        console.log('Valor cliente: ', datos.Cliente);
        console.log('Valor categoria: ', datos.Categoria);
        console.log('Valor proyecto: ', datos.Proyecto);
        console.log('Valor equipo: ', datos.Equipo);
    }
    React.useEffect(() => {
        console.log('Montado o cambió "nombre"');

        return () => {
            console.log('Cleanup por cambio de "nombre" o desmontaje');
        };
    }, [nombre]);

    //Empresa
    const [Empresa, setEmpresa] = React.useState<string>('');
    //Empresa
    const handleChangeEmpresa = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setEmpresa(newValue);
    };

    // const handleCrearCliente = () => {
    //     setMostrarAlerta(true);
    // };

    const handleCrearCliente = () => {
        setMostrarAlerta(true);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
    };
    return (
        <Card>
            {/* <CardHeader
                title="Creación de remisión" size="small"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            /> */}
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de remisión</Typography>

            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa/Cliente'
                            value={datos.Cliente}
                            options={clientes}
                            size='small'
                            onChange={handleChange}
                            valorname='Cliente'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Proyecto'
                            value={datos.Proyecto}
                            options={proyectos}
                            size='small'
                            onChange={handleChange}
                            valorname='Proyecto'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Categoría'
                            value={datos.Categoria}
                            options={categorias}
                            size='small'
                            onChange={handleChange}
                            valorname='Categoria'
                        />
                    </Grid>
                    {/* <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Equipo'
                            value={datos.Equipo}
                            options={equipos}
                            size='small'
                            onChange={handleChange}
                            valorname='Equipo'
                        />
                    </Grid> */}
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelectConEstado
                            label="Equipo"
                            value={datos.Equipo}
                            options={equipos} // array de tipo EquipoEstadoOption[]
                            size="small"
                            onChange={handleChange}
                            valorname="Equipo"
                        // required
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Subarrandatario'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Bodega'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Equipo disponible'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />

            <CardContent>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Bodeguero'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Despachador'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Transportador'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Vehículo'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Placa'
                            value={Empresa}
                            // onChange={}
                            // required
                            tamano='small'
                            tipo_input='text'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Recibe'
                            value={Empresa}
                            // onChange={}
                            // required
                            tamano='small'
                            tipo_input='text'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent style={{ paddingTop: '0px' }}>
                <Grid container spacing={1}>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Observaciones Empresa'
                            value={datos.ObservacionesEmpresa}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='textarea'
                            valorname='ObservacionesEmpresa'
                        />
                    </Grid>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Observaciones Cliente'
                            value={datos.ObservacionesCliente}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='textarea'
                            valorname='ObservacionesCliente'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearCliente}>
                    Crear remisión
                </Button>
                <Button onClick={CambiarValorAnombre}>
                    Cambiar Valor
                </Button>
            </CardActions>

            {/* Snackbar con alerta */}
            <Snackbar
                open={mostrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                onClose={() => setMostrarAlerta(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }} onClose={() => setMostrarAlerta(false)}>
                    Remisión creada exitosamente
                </Alert>
            </Snackbar>
        </Card>
    );
}