'use client';

import * as React from 'react';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Modal,
    SelectChangeEvent,
    Typography,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple, X } from '@phosphor-icons/react/dist/ssr';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ConsultarProyectoPorId } from '@/services/gestionycontrol/proyectos/ConsultarProyectoPorIdService';
import { ActualizarProyecto } from '@/services/gestionycontrol/proyectos/ActualizarProyectoService';

// 1. Interfaces
interface ProyectoAEditar {
    IdProyecto: number;
}

interface ModalFormularioEditarProyectoProps {
    ProyectoAEditar: ProyectoAEditar;
    sendMessage: (event: string, payload: any) => void;
}

interface FormData {
    IdProyecto: number;
    NuevoNombreProyecto: string;
    NuevoClienteProyecto: string;
    NuevaDireccionProyecto: string;
    NuevoEstadoProyecto?: number;
}

// 2. Componente principal
export function ModalFormularioEditarProyecto({ ProyectoAEditar, sendMessage }: ModalFormularioEditarProyectoProps): React.JSX.Element {
    // 3. Hooks de React y otros hooks de librerías
    //Para el tema del modal
    const theme = useTheme();
    //...

    // 4. Estados
    //Para el manejo de las notificiones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    //...
    // Para abrir y cerrar el modal
    const [modalAbierto, setModalAbierto] = React.useState(false);
    // ...
    // Estado para todos los campos del formulario editar proyecto
    // const [datos, setDatos] = React.useState({
    //     DocumentoCliente: '',
    //     DireccionProyecto: '',
    //     EstadoProyecto: ''
    // })
    const [datos, setDatos] = React.useState<FormData>({
        IdProyecto: ProyectoAEditar.IdProyecto,
        NuevoNombreProyecto: '',
        NuevoClienteProyecto: '',
        NuevaDireccionProyecto: '',
        NuevoEstadoProyecto: undefined,
    });
    // ...

    const [clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([]);
    const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);
    // 5. useEffect para la carga inicial y sockets
    // React.useEffect(() => {
    //     ListarInfo();
    // }, []);
    // 6. Funciones del componente
    const MostrarMensajeAlerta = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    const AbrirModal = async () => {
        setModalAbierto(true);
        await ListarInfo();
    };
    const ListarInfo = async () => {
        try {
            const [
                Clientes,
                Estados,
                InformacionProyecto
            ] = await Promise.all([
                ListarClientes(),
                ListarEstados(),
                ConsultarProyectoPorId(ProyectoAEditar.IdProyecto)
            ]);

            setClientes(Clientes);
            // let NuevosEstados = [];
            // for (const element of Estados) {
            //     if (element.label.includes('Activo') || element.label.includes('Inactivo')) {
            //         console.log("ESTE FUEEE");
            //         NuevosEstados.push(element);
            //     }            
            // }
            // console.log(NuevosEstados);
            // const NuevosEstados = Estados.filter((element: any) =>
            //     ['Activo', 'Inactivo'].some(estado => element.label.includes(estado))
            // )
            const estadosPermitidos = new Set(['activo', 'inactivo']);
            const NuevosEstados = Estados.filter((element: any) =>
                estadosPermitidos.has(element.label.toLowerCase().trim())
            );
            // console.log(NuevosEstados)
            setEstados(NuevosEstados);
            setDatos({
                IdProyecto: ProyectoAEditar.IdProyecto,
                NuevoNombreProyecto: InformacionProyecto[0].NombreProyecto,
                NuevoClienteProyecto: InformacionProyecto[0].DocumentoCliente,
                NuevaDireccionProyecto: InformacionProyecto[0].DireccionProyecto,
                NuevoEstadoProyecto: InformacionProyecto[0].IdEstadoProyecto,
            })
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };
    const HandleActualizarProyecto = async () => {
        try {
            await ActualizarProyecto(datos);
            sendMessage('proyecto-actualizado', {});
            MostrarMensajeAlerta('Proyecto actualizado correctamente.', 'success');
        } catch (error) {
            MostrarMensajeAlerta(`Error al actualizar el proyecto: ${error}`, 'error');
        }
    };
    // 7. Renderizado JSX del componente
    return <>
        <IconButton
            size="small"
            color="primary"
            onClick={AbrirModal}
            title='Editar'
        >
            <PencilSimple size={20} weight="bold" />
        </IconButton>

        <MensajeAlerta
            open={mostrarAlertas}
            tipo={tipoAlerta}
            mensaje={mensajeAlerta}
            onClose={() => setMostrarAlertas(false)}
        />

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
                    Actualizar proyecto
                </Typography>
                <Card>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid md={4} xs={12} mt={0.5}>
                                <Input
                                    label='Nombre'
                                    value={datos.NuevoNombreProyecto}
                                    onChange={handleChange}
                                    // required
                                    tamano='small'
                                    tipo_input='text'
                                    valorname='NuevoNombreProyecto'
                                />
                            </Grid>
                            <Grid md={4} xs={12} mt={0.5}>
                                <InputSelect
                                    label='Empresa/Cliente'
                                    value={datos.NuevoClienteProyecto}
                                    options={clientes}
                                    size='small'
                                    onChange={handleChange}
                                    valorname='NuevoClienteProyecto'
                                />
                            </Grid>
                            <Grid md={4} xs={12} mt={0.5}>
                                <Input
                                    label='Dirección'
                                    value={datos.NuevaDireccionProyecto}
                                    onChange={handleChange}
                                    // required
                                    tamano='small'
                                    tipo_input='text'
                                    valorname='NuevaDireccionProyecto'
                                />
                            </Grid>
                            <Grid md={2} xs={12} mt={0.5}>
                                <InputSelect
                                    label='Estado'
                                    value={Number(datos.NuevoEstadoProyecto)}
                                    options={estados}
                                    size='small'
                                    valorname='NuevoEstadoProyecto'
                                    // onChange={handleChangeEstado}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={HandleActualizarProyecto}>Guardar cambios</Button>
                    </CardActions>
                </Card>
            </Box>
        </Modal>
    </>;
};