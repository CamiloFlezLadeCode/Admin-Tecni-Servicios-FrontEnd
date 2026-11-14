'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ActualizarVehiculo } from '@/services/gestionycontrol/vehiculos/ActualizarVehiculoService';
import { ConsultarVehiculoPorId } from '@/services/gestionycontrol/vehiculos/ConsultarVehiculoPorIdService';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    SelectChangeEvent,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { BotonEditar, ModalFormulario } from '@/components/dashboard/componentes_generales/modal/ModalFormulario';

const EstadoVehiculo = [
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
]

interface Props {
    IdVehiculo: number;
    sendMessage: (event: string, payload: any) => void;
    onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function FormularioModalEditarVehiculo({
    IdVehiculo,
    sendMessage,
    onMostrarMensaje
}: Props): React.JSX.Element {
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const EditarVehiculo = async () => {
        try {
            await Consultar(); // <-- Ahora solo consulta al abrir el modal
            setModalAbierto(true);
        } catch (error) {
            mostrarMensaje('Error al cargar datos del vehículo', 'error');
        }
    }
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    // Estado para almacenar los estados que vienen de la bd
    const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);
    // ...
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
    const Consultar = async () => {
        try {
            const [
                Vehiculo,
                Estados
            ] = await Promise.all([
                ConsultarVehiculoPorId(IdVehiculo),
                ListarEstados()
            ]);

            // const Vehiculo = await ConsultarVehiculoPorId(IdVehiculo);
            setDatos({
                IdVehiculo: IdVehiculo,
                Placa: Vehiculo[0].Placa,
                IdEstado: Vehiculo[0].IdEstado
            });

            const estadosPermitidos = new Set(['activo', 'inactivo']);
            const NuevosEstados = Estados.filter((element: any) =>
                estadosPermitidos.has(element.label.toLowerCase().trim())
            );
            setEstados(NuevosEstados);
        } catch (error) {
            console.log(`Error al consultar el vehículo: ${error}`);
        }
    };
    const [datos, setDatos] = React.useState({
        IdVehiculo: IdVehiculo,
        Placa: '',
        IdEstado: '',
    });
    // const { sendMessage, messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);
    const HandleEditarVehiculo = async () => {
        try {
            await ActualizarVehiculo(datos);
            // 🔥 Emitir evento por socket
            sendMessage('vehiculo-actualizado', {});
            onMostrarMensaje('Vehículo actualizado correctamente', 'success');
        } catch (error) {
            onMostrarMensaje(`Error al actualizar el vehículo. Error: ${error}`, 'error');
        }
    };
    return (
        <>
            <BotonEditar onClick={EditarVehiculo} />
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
            <ModalFormulario
                abierto={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo={'Actualizar Vehículo'}
                sx={{ width: { xs: '80%', md: '40%' } }}
            >
                    <Card>
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
                                        options={estados}
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
                            <Button variant="contained" onClick={HandleEditarVehiculo}>
                                Guardar cambios
                            </Button>
                        </CardActions>
                    </Card>
            </ModalFormulario>
        </>
    )
};