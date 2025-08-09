'use client';
import * as React from 'react';
import { PencilSimple, X } from '@phosphor-icons/react/dist/ssr';
import { useSocketIO } from '@/hooks/use-WebSocket';
import {
    IconButton,
    Modal,
    Box,
    useTheme,
    Typography,
    CardContent,
    Card,
    Divider,
    CardActions,
    Button,
    FormControl,
    FormHelperText
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// Para cargar datos iniciales
import { ListarTiposDeBodegas } from '@/services/generales/ListarTipoDeBodegas';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ConsultarInfoBodega } from '@/services/gestionycontrol/bodegas/ConsultarInfoBodegaService';
// Para validar formulario
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
// Para actualizar la bodega
import { ActualizarBodega } from '@/services/gestionycontrol/bodegas/ActualizarBodegaService';


// Esquema de validación corregido
const schema = zod.object({
    TipoDeBodega: zod.number().min(1, { message: 'El tipo de bodega es obligatorio' }),
    DocumentoSubarrendatario: zod.string().optional(),
    NombreDeBodega: zod.string().min(1, { message: 'El nombre de la bodega es obligatorio' }),
    Descripcion: zod.string().optional(),
    Estado: zod.number().min(1, { message: 'El estado de la bodega es obligatorio' })
}).superRefine((data, ctx) => {
    if (data.TipoDeBodega === 2 && !data.DocumentoSubarrendatario) {
        ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: "El subarrendatario es obligatorio",
            path: ["DocumentoSubarrendatario"]
        });
    }
});

type FormValues = zod.infer<typeof schema>;

// 1. INTERFACES Ó TYPES
interface PropsFormulario {
    IdBodega: number;
}


// 2. COMPONENTE PRINCIPAL
export function FormularioEditarBodega({ IdBodega }: PropsFormulario): React.JSX.Element {
    // 3. HOOKS DE REACT Y DE LIBRERÍAS
    const { sendMessage, messages } = useSocketIO();

    // 4. ESTADOS
    //Para el manejo de las notificiones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    // Para mostrar u ocultar el modal
    const [modalAbierto, setModalAbierto] = React.useState(false);
    //Para el tema del modal
    const theme = useTheme();
    // Para almecnar datos iniciales
    const [tiposDeBodegas, setTiposDeBodegas] = React.useState([]);
    const [subarrendatarios, setSubarrendatarios] = React.useState([{ value: '', label: 'Sin seleccionar' },]);
    const [estados, setEstados] = React.useState([]);
    // Para datos iniciales y validación
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
        resetField,
        clearErrors // Añadido para limpiar errores
    } = useForm<FormValues>({
        defaultValues: {
            TipoDeBodega: 0,
            DocumentoSubarrendatario: '',
            NombreDeBodega: '',
            Descripcion: '',
            Estado: 1,
        },
        resolver: zodResolver(schema)
    });
    const tipoBodegaSeleccionado = watch("TipoDeBodega");

    // 5. CARGA INICIAL DE DATOS
    React.useEffect(() => {

    }, []);

    // 6. FUNCIONES DEL COMPONENTE PARA SU COMPORTAMIENTO
    // Función para cargar datos iniciales
    const CargarDatosIniciales = async () => {
        try {
            const [
                TiposDeBodegas,
                Estados,
                InfoBodega,
                Subarrendatarios
            ] = await Promise.all([
                ListarTiposDeBodegas(),
                ListarEstados(),
                ConsultarInfoBodega(IdBodega),
                ListarSubarrendatarios()
            ]);
            TiposDeBodegas.unshift(
                { value: 0, label: 'Sin seleccionar' }
            );
            setTiposDeBodegas(TiposDeBodegas);
            const EstadosPermitidos = new Set(['activo', 'inactivo']);
            const EstadosFiltrados = Estados.filter((item: any) =>
                EstadosPermitidos.has(item.label.toLowerCase().trim())
            );
            EstadosFiltrados.unshift(
                { value: 0, label: 'Sin seleccionar' }
            );
            setEstados(EstadosFiltrados);
            const DatosBodega = InfoBodega[0];
            reset({
                TipoDeBodega: DatosBodega.IdTipoBodega,
                DocumentoSubarrendatario: DatosBodega.DocumentoSubarrendatario || '',
                NombreDeBodega: DatosBodega.NombreBodega,
                Descripcion: DatosBodega.Descripcion,
                Estado: DatosBodega.IdEstado || 1 // Valor por defecto si no existe
            });
            setSubarrendatarios(Subarrendatarios);
        } catch (error) {
            console.error(`Error al cargar los datos: ${error}`);
        }
    };
    // Función para mostrar las alertas
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    // ....
    // Función para editar la bodega
    const HandleEditarBodega = async (Datos?: FormValues) => {
        try {
            const NuevosDatos = {
                ...Datos,
                IdBodega
            };
            ActualizarBodega(NuevosDatos);
            mostrarMensaje('Bodega actualizada correctamente', 'success');
            sendMessage('bodega-actualizada', {});
        } catch (error) {
            console.error(`Error al actualizar la bodega: ${error}`);
            mostrarMensaje(`Hubo un error al actualizar la bodega. ${error}`, 'error');
        }
    };
    // ....

    // 7. RENDERIZADO JSX DEL COMPONENTE PRINCIPAL
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
                onClick={(e) => { CargarDatosIniciales(); setModalAbierto(true); }}
                title='Editar'
            >
                <PencilSimple size={20} weight='bold' />
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
                        Actualizar Bodega
                    </Typography>
                    <form onSubmit={handleSubmit(HandleEditarBodega)}>
                        <Card>
                            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                <Grid container spacing={1}>
                                    <Grid md={3} xs={12} mt={0.5}>
                                        <Controller
                                            name="TipoDeBodega"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth>
                                                    <InputSelect
                                                        label='Tipo de bodega'
                                                        value={field.value}
                                                        options={tiposDeBodegas}
                                                        size='small'
                                                        onChange={(e) => {
                                                            field.onChange(Number(e.target.value));
                                                            if (Number(e.target.value) !== 2) {
                                                                control._formValues.DocumentoSubarrendatario = '';
                                                            }
                                                        }}
                                                    />
                                                    {errors.TipoDeBodega && (
                                                        <FormHelperText error sx={{ width: '100%', margin: 0 }}>
                                                            {errors.TipoDeBodega.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    {tipoBodegaSeleccionado === 2 && (
                                        <Grid md={3} xs={12} mt={0.5}>
                                            <Controller
                                                name="DocumentoSubarrendatario"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth>
                                                        <InputSelect
                                                            label='Subarrendatario'
                                                            value={field.value ?? ''}
                                                            options={subarrendatarios}
                                                            size='small'
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                        />
                                                        {errors.DocumentoSubarrendatario && (
                                                            <FormHelperText error sx={{ width: '100%', margin: 0 }}>
                                                                {errors.DocumentoSubarrendatario.message}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                    )}
                                    <Grid md={3} xs={12} mt={0.5}>
                                        <Controller
                                            name="NombreDeBodega"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth>
                                                    <Input
                                                        label='Nombre de bodega'
                                                        value={field.value}
                                                        tamano='small'
                                                        tipo_input='text'
                                                        valorname='NombreDeBodega'
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value);
                                                        }}
                                                    />
                                                    {errors.NombreDeBodega && (
                                                        <FormHelperText error sx={{ width: '100%', margin: 0 }}>
                                                            {errors.NombreDeBodega.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid md={3} xs={12} mt={0.5}>
                                        <Controller
                                            name="Descripcion"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth>
                                                    <Input
                                                        label='Descripción'
                                                        value={field.value ?? ''}
                                                        tamano='small'
                                                        tipo_input='text'
                                                        valorname='Descripcion'
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>

                                    <Grid md={3} xs={12} mt={0.5}>
                                        <Controller
                                            name="Estado"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth>
                                                    <InputSelect
                                                        label='Estado'
                                                        value={field.value}
                                                        options={estados}
                                                        size='small'
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                    {errors.Estado && (
                                                        <FormHelperText error sx={{ width: '100%', margin: 0 }}>
                                                            {errors.Estado.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button variant="contained" type='submit'>
                                    Guardar cambios
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </Box>
            </Modal>
        </>
    );
};