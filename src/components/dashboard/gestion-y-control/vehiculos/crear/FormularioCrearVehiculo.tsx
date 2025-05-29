'use client';

import * as React from 'react';
import { Card, Typography, Divider, CardContent, SelectChangeEvent, CardActions, Button } from '@mui/material';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import Grid from '@mui/material/Unstable_Grid2';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { CrearVehiculo } from '@/services/gestionycontrol/vehiculos/CrearVehiculoService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';

const EstadoVehiculo = [
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' }
];

export function FormularioCrearVehiculo(): React.JSX.Element {
    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const [datos, setDatos] = React.useState({
        Placa: '',
        IdEstado: '',
        UsuarioCreacion: documentoUsuarioActivo
    });
    //Validación del formulario
    const reglasValidacion = [
        { campo: 'Placa', mensaje: 'La placa es obligatoria' },
        { campo: 'IdEstado', mensaje: 'El estado es obligatorio' }
    ];
    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);

    };
    const { sendMessage, messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
    const HandleCrearVehiculo = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                const result = await CrearVehiculo(datos);
                if (result) {
                    sendMessage('vehiculo-creado', {});
                    mostrarMensaje('Vehículo creado correctamente', 'success');
                    setDatos({
                        Placa: '',
                        IdEstado: '',
                        UsuarioCreacion: documentoUsuarioActivo
                    });
                }
            } catch (error) {
                console.error("Error al crear el vehículo: ", error);
                mostrarMensaje(`Error al crear el vehículo ${error}`, 'error')
            }
        }
    }
    const handleChange = async (e: SelectChangeEvent<string | string[]> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        let { name, value } = e.target;
        if (name === 'Placa' && typeof value === 'string') {
            value = value.toUpperCase();
        }
        setDatos((prevDatos) => ({
            ...prevDatos,
            // [name]: value
            [name ?? '']: value,
        }));
    };
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
    return (
        <Card>
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de vehículo</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Placa'
                            value={datos.Placa}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Placa'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Estado'
                            value={datos.IdEstado}
                            options={EstadoVehiculo}
                            size='small'
                            valorname='IdEstado'
                            // onChange={handleChangeEstado}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={HandleCrearVehiculo}>
                    Crear vehículo
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