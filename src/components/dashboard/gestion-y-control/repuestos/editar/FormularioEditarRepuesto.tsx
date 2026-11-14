'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ActualizarRepuesto } from '@/services/gestionycontrol/repuestos/ActualizarRepuestoService';
import { ConsultarRepuestoPorId } from '@/services/gestionycontrol/repuestos/ConsultarRepuestoPorIdService';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    SelectChangeEvent
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { BotonEditar, ModalFormulario } from '@/components/dashboard/componentes_generales/modal/ModalFormulario';

interface Props {
    readonly IdRepuesto: number;
    readonly sendMessage: (event: string, payload: any) => void;
    readonly onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
}
export function FormularioEditarRepuesto({ IdRepuesto, sendMessage, onMostrarMensaje }: Props): React.JSX.Element {
    // Se implementa estado para todos los campos del formulario
    const [datos, setDatos] = React.useState({
        NuevoNombreRepuesto: '',
        NuevoEstadoRepuesto: '',
        IdRepuesto: IdRepuesto
    })
    // ...

    // Se traen todos los estados de la bd y se seleccionan
    const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);

    const CargarDatosIniciales = async () => {
        try {
            const [
                Estados,
                InfoRepuesto
            ] = await Promise.all([
                ListarEstados(),
                ConsultarRepuestoPorId(IdRepuesto)
            ]);
            const EstadosSeleccionados = [];
            for (const element of Estados) {
                if (element.label.includes('Disponible') || element.label.includes('No disponible')) {
                    EstadosSeleccionados.push(element);
                }
            }
            setEstados(EstadosSeleccionados);
            setDatos({
                NuevoNombreRepuesto: InfoRepuesto[0].Nombre,
                NuevoEstadoRepuesto: InfoRepuesto[0].Estado,
                IdRepuesto: IdRepuesto
            });
        } catch (error) {
            console.error(`Error al cargar los estados: ${error}`);
        }
    };
    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [
    //                 Estados,
    //                 InfoRepuesto
    //             ] = await Promise.all([
    //                 ListarEstados(),
    //                 ConsultarRepuestoPorId(IdRepuesto)
    //             ]);
    //             const EstadosSeleccionados = [];
    //             for (const element of Estados) {
    //                 if (element.label.includes('Disponible') || element.label.includes('No disponible')) {
    //                     EstadosSeleccionados.push(element);
    //                 }
    //             }
    //             setEstados(EstadosSeleccionados);
    //             setDatos({
    //                 NuevoNombreRepuesto: InfoRepuesto[0].Nombre,
    //                 NuevaCantidadRepuesto: InfoRepuesto[0].Cantidad,
    //                 NuevoEstadoRepuesto: InfoRepuesto[0].Estado,
    //                 IdRepuesto: IdRepuesto
    //             });
    //         } catch (error) {
    //             console.error(`Error al cargar los estados: ${error}`);
    //         }
    //         console.log("HOLISSS");
    //     };
    //     fetchData();
    // }, []);
    // ...

    // Se implementa el estado para el modal
    const [modalAbierto, setModalAbierto] = React.useState(false);
    // ...

    //Para el tema del modal
    //...

    //Se maneja el cambio para todos los campos
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };
    //...

    //Para el manejo de las notificiones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //...

    // Se implementa la actualización del repuesto
    const HandleActualizarRepuesto = async () => {
        try {
            await ActualizarRepuesto(datos);
            sendMessage('repuesto-actualizado', {});
            onMostrarMensaje('Repuesto actualizado correctamente.', 'success');
        } catch (error) {
            onMostrarMensaje(`Error al actualizar el repuesto: ${error}`, 'error');
        }
    };
    // ...

    //Para abrir el modal para actualizar el equipo
    const EditarRepuesto = async () => {
        try {
            setModalAbierto(true);
            void CargarDatosIniciales();
        } catch (error) {
            mostrarMensaje(`Error al cargar los datos del equipo: ${error}`, 'error');
        }
    };
    //...
    return (
        <>
            <BotonEditar onClick={EditarRepuesto} />
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
            <ModalFormulario
                abierto={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo={'Actualizar repuesto'}
            >
                    <Card>
                        <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                            <Grid container spacing={1}>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <Input
                                        label='Nombre'
                                        value={datos.NuevoNombreRepuesto}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='NuevoNombreRepuesto'
                                    />
                                </Grid>
                                <Grid md={4} xs={12} mt={0.5}>
                                    <InputSelect
                                        label='Estado'
                                        value={datos.NuevoEstadoRepuesto}
                                        options={estados}
                                        size='small'
                                        onChange={handleChange}
                                        valorname='NuevoEstadoRepuesto'
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={HandleActualizarRepuesto}>Guardar cambios</Button>
                        </CardActions>
                    </Card>
            </ModalFormulario>
        </>
    )
};