'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes
// import InputText from './InputText'; //Así se importa un componente cuando se exporta con => export default InputText;
import { InputText } from './InputText'; //Así se import un componente cuando se exporta con => export const InputText
// import InputSelect from './InputSelect';
import Input from '../../componentes_generales/formulario/Input';
import InputSelect from '../../componentes_generales/formulario/Select';

import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import { Info } from '@phosphor-icons/react/dist/ssr';
import Typography from '@mui/material/Typography';


const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const Empresa = [
    { value: '1', label: 'Empresa/Cliente #1' },
    { value: '2', label: 'Empresa/Cliente #2' },
    { value: '3', label: 'Cinnamom Overdressed' },
]

export function FormularioCrearHojaDeVidaEquipo(): React.JSX.Element {
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

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

    const [nombre, setNombre] = React.useState('');
    const [email, setEmail] = React.useState('');
    const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(event.target.value);
    };

    let Consecutivo = 1;

    const [selectedValue, setSelectedValue] = React.useState<string>('');

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        // Obtener el nuevo valor seleccionado
        const newValue = event.target.value;

        // Actualizar el estado con el nuevo valor
        setSelectedValue(newValue);

        // Puedes realizar otras acciones aquí
        console.log('Valor seleccionado:', newValue);
    };

    return (
        <div>
            <Card>
                <CardHeader
                    title="Creación de hoja de vida de equipo" size="small"
                    sx={{
                        fontSize: '0.875rem', // Tamaño de fuente más pequeño
                        padding: '8px', // Espaciado interno más pequeño
                    }}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid md={10} xs={12}>
                            <span>MANTENIMIENTO PREVENTIVO</span>
                        </Grid>

                        {/* <Grid md={2} xs={12}>
                            <span>Consecutivo: [{Consecutivo}] </span>
                        </Grid> */}
                        <Grid md={2} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <Info style={{ marginRight: '8px', color: '#1976d2', width: '26px', height: '26px' }} />
                            <Typography variant="body1" style={{ fontWeight: 'normal' }}>
                                Consecutivo: {Consecutivo}
                            </Typography>
                        </Grid>


                        <Grid md={2} xs={12}>
                            <Input
                                label="Fecha"
                                value={nombre}
                                onChange={handleChangeNombre}
                                // required
                                tamano="small"
                                tipo_input="date"
                            />
                        </Grid>

                        <Grid md={12} xs={12}>
                            <Input
                                label="Prueba"
                                value="hola"
                                // onChange={ }
                                // required
                                tamano='small'
                                tipo_input='input'
                            />
                        </Grid>

                        {/* <Grid md={} xs={12}>
                          <Input
                            label=""
                            value={}
                            onChange={}
                            // required
                            tamano=""
                            tipo_input=""
                          />
                        </Grid> */}

                        <Grid md={4} xs={12}>
                            <InputSelect
                                label='Empresa'
                                value={selectedValue}
                                options={Empresa}
                                size='small'
                                onChange={handleSelectChange}
                            />
                        </Grid>

                        <Grid md={3} xs={12}>
                            <InputText
                                label="Nombre"
                                value={nombre}
                                onChange={handleChangeNombre}
                                required
                                tamano="small"
                                tipo_input="input"
                            />
                        </Grid>


                        <Grid md={6} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Nombre</InputLabel>
                                <OutlinedInput defaultValue="Constructions" label="Nombre" name="Nombre" size="small" />
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Documento</InputLabel>
                                <OutlinedInput defaultValue="Rivers" label="Documento" name="lastName" size="small" />
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Dirección</InputLabel>
                                <OutlinedInput defaultValue="Rivers" label="Dirección" name="lastName" size="small" />
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12} mt={1}>
                            <FormControl fullWidth required>
                                <InputLabel>Teléfono</InputLabel>
                                <OutlinedInput defaultValue="Rivers" label="Teléfono" name="lastName" size="small" />
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12} mt={1}>
                            <FormControl fullWidth required>
                                <InputLabel>Celular</InputLabel>
                                <OutlinedInput defaultValue="Rivers" label="Celular" name="lastName" size="small" />
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12} mt={1}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select defaultValue="Activo" label="Estado" name="state" variant="outlined" size="small">
                                    {EstadoCliente.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12} mt={1}>
                            <FormControl fullWidth required>
                                <InputLabel>Correo</InputLabel>
                                <OutlinedInput defaultValue="Rivers" label="Correo" name="lastName" size="small" />
                            </FormControl>
                        </Grid>
                        <Grid md={3} xs={12} mt={1}>
                            <FormControl fullWidth required>
                                <InputLabel shrink htmlFor="fecha">
                                    Fecha
                                </InputLabel>
                                <OutlinedInput
                                    id="fecha"
                                    type="date"
                                    name="fecha"
                                    notched
                                    label="Fecha"
                                    size="small"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/* {mostrarAlerta && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Este es un mensaje de error!
                    </Alert>
                )} */}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleCrearCliente}>
                        Crear hoja de vida
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
                        Hoja de vida creada exitosamente
                    </Alert>
                </Snackbar>
            </Card>
        </div>
    );
}