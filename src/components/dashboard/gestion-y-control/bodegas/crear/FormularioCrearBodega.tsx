'use client';
import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Divider,
    Button,
    Box,
    FormControl,
    FormHelperText
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { UserContext } from '@/contexts/user-context';
// Para validar formulario
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
// Para cargar datos iniciales
import { ListarTiposDeBodegas } from '@/services/generales/ListarTipoDeBodegas';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
// Uso API para crear la bodega
import { CrearBodega } from '@/services/gestionycontrol/bodegas/CrearBodegaService';

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

const FormularioCrearBodega = () => {
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const { sendMessage, messages } = useSocketIO();
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error' | 'warning'>('success');

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
            TipoDeBodega: 1,
            DocumentoSubarrendatario: '0',
            NombreDeBodega: '',
            Descripcion: '',
            Estado: 1
        },
        resolver: zodResolver(schema)
    });
    const tipoBodegaSeleccionado = watch("TipoDeBodega");

    const [tiposDeBodegas, setTiposDeBodegas] = React.useState([]);
    const [subarrendatarios, setSubarrendatarios] = React.useState([{ value: '', label: 'Sin seleccionar' },]);
    const [estados, setEstados] = React.useState([]);

    // 5. USEEFFECT PARA LA CARGA INICIAL Y SOCKETS
    React.useEffect(() => {
        const CargarDatosIniciales = async () => {
            try {
                const [
                    TiposDeBodegas,
                    Estados
                ] = await Promise.all([
                    ListarTiposDeBodegas(),
                    ListarEstados()
                ]);
                TiposDeBodegas.unshift(
                    { value: 0, label: 'Sin seleccionar' }
                );
                setTiposDeBodegas(TiposDeBodegas);
                // const ValorInicial = [{ value: '', label: 'Sin seleccionar' }];
                // setSubarrendatarios(ValorInicial);
                const EstadosPermitidos = new Set(['activo', 'inactivo']);
                const EstadosFiltrados = Estados.filter((item: any) =>
                    EstadosPermitidos.has(item.label.toLowerCase().trim())
                );
                EstadosFiltrados.unshift(
                    { value: 0, label: 'Sin seleccionar' }
                );
                setEstados(EstadosFiltrados);
            } catch (error) {
                console.error(`Error al cargar los datos: ${error}`);
            }
        };
        CargarDatosIniciales();
    }, []);
    // Limpiamos errores cuando cambia el tipo de bodega
    React.useEffect(() => {
        const CargarSubarrendatarios = async () => {
            try {
                const [Subarrendatarios] = await Promise.all([ListarSubarrendatarios()]);
                Subarrendatarios.unshift({ value: '0', label: 'Sin seleccionar' });
                setSubarrendatarios(Subarrendatarios);

                // Reseteamos el campo para que se seleccione correctamente la opción vacía
                resetField("DocumentoSubarrendatario", { defaultValue: '' });
            } catch (error) {
                console.error(`Error al cargar los datos: ${error}`);
            }
        };

        if (tipoBodegaSeleccionado === 2) {
            CargarSubarrendatarios();
            resetField("DocumentoSubarrendatario", { defaultValue: '0' });
        } else {
            // Limpiamos errores y valor del campo cuando no se necesita
            clearErrors("DocumentoSubarrendatario");
            resetField("DocumentoSubarrendatario", { defaultValue: '0' });
        }
    }, [tipoBodegaSeleccionado, clearErrors, resetField]);

    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error' | 'warning') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    const HandleCrearBodega = async (data: FormValues) => {
        // await new Promise((resolve) => setTimeout(resolve, 4000));
        try {
            const DatosDeEnvio = {
                ...data,
                UsuarioCreacion: documentoUsuarioActivo
            };
            await CrearBodega(DatosDeEnvio);
            mostrarMensaje(`Bodega creada correctamente`, 'success');
            sendMessage('bodega-creada', {});
            reset();
        } catch (error) {
            mostrarMensaje(`Hubo un error al crear la bodega: ${error}`, 'error');
        }
    };

    // RENDERIZADO DEL COMPONENTE PRINCIPAL
    return (
        <form onSubmit={handleSubmit(HandleCrearBodega)}>
            <Card>
                <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>
                    Creación de bodega
                </Typography>
                <Divider />
                <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Grid container spacing={1}>
                        <Grid md={3} xs={12} mt={0.5} display='none'>
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
                                                // Limpiar el valor de subarrendatario cuando no es necesario
                                                if (Number(e.target.value) !== 2) {
                                                    control._formValues.DocumentoSubarrendatario = '0';
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
                                                value={field.value ?? '0'}
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
                                            onChange={(e) => field.onChange(e.target.value)}
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
                    <Button variant="contained" type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Creando...' : 'Crear bodega'}
                    </Button>
                </CardActions>

                <MensajeAlerta
                    open={mostrarAlertas}
                    tipo={tipoAlerta}
                    mensaje={mensajeAlerta}
                    onClose={() => setMostrarAlertas(false)}
                />
            </Card>
        </form>
    );
};

export default FormularioCrearBodega;