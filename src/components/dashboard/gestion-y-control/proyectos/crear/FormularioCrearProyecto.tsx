'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
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
import { ListarClientes } from '@/services/generales/ListarClientesService';



const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const Clientess = [
    { id: '100', value: '1', label: 'Emrpesa1' },
    { id: '101', value: '2', label: 'Empresa2' },
]

interface Client {
    IdCliente: number;
    DocumentoCliente: string;
    NombreCliente: string;
};

export function FormularioCrearProyecto(): React.JSX.Element {
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

    //Se maneja el estado de todos los campos del formulario
    const [datos, setDatos] = React.useState({
        Nombres: '',
        Empresa: '',
        Direccion: ''
    });

    //Función para manejar el cambio en los inputs
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));

        if (name === 'DocumentoUsuario') {
            if (value.trim() !== '') {
                console.log(value);
                // await funcionaparaverificarclienteexiste(value);
            }
        }
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

    const MostrarInfo = () => {
        console.log(datos);
    };

    // const [Clientes, setClientes] = React.useState<Client[]>([]);
    const [Clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([{value: 'ClienteX', label: 'ClienteX'}]);


    const [valorSeleccionado, setValorSeleccionado] = React.useState<string | number>(''); // 
    // Estado para el valor seleccionado
    // const Listar = async () => {
    //     const Valores = ListarClientes();
    //     console.log(Valores);
    //     try {
    //         const data = await ListarClientes();
    //         setClientes(data);
    //         console.log(data);
    //     } catch (error) {

    //     }

    // }

    const Listar = async () => {
        try {
            const data = await ListarClientes();
            console.log(data);
    
            // Verifica si los datos ya están en el formato correcto
            setClientes(data); // Establece los datos directamente

                        // Establece un valor por defecto basado en los datos de la base de datos
                        if (data.length > 0) {
                            setValorSeleccionado(data[0].value); // Marca el primer cliente como seleccionado por defecto
                        }
        } catch (error) {
            console.error('Error al listar clientes:', error);
        }
    };
    
    // Llama a la función Listar cuando sea necesario, por ejemplo, en un useEffect
    React.useEffect(() => {
        Listar();
    }, []);


    const handleChangee = (event: SelectChangeEvent<string | number>) => {
        setValorSeleccionado(event.target.value as string | number); // Actualiza el valor seleccionado
    };

    return (
        <Card>
            <CardHeader
                title="Creación de proyecto" size="small"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Nombre'
                            value={datos.Nombres}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Nombres'
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa'
                            value={String(valorSeleccionado)}
                            options={Clientes}
                            size='small'
                            onChange={handleChangee}
                            valorname='Empresa'
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
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={Listar}>
                    Crear proyecto
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
                    Cliente creado exitosamente
                </Alert>
            </Snackbar>
        </Card>
    );
}