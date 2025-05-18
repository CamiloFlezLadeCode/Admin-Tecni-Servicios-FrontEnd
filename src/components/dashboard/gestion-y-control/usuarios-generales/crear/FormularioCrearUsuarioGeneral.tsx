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


const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

export function FormularioCrearUsuarioGeneral(): React.JSX.Element {
    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

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
        Roles: '2',
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
    return (
        <label htmlFor="">Holis</label>
    );
};