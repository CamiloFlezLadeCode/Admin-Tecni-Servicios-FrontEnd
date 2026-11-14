'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { CamposFormulario, type DefinicionCampo } from '@/components/dashboard/componentes_generales/formulario/CamposFormulario';
import { TarjetaFormulario } from '@/components/dashboard/componentes_generales/formulario/TarjetaFormulario';
import { useProgresoSimulado } from '@/components/dashboard/componentes_generales/formulario/use-progreso-simulado';
import CircularProgressWithLabel from '@/components/dashboard/componentes_generales/mensajedecarga/CircularProgressWithLabel';
import { verificarClienteExistenteService } from '@/services/gestionycontrol/clientes/CrearClienteService';
import TipoDocumentos from '@/services/TipoDocumentos';
import { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { UserContext } from '@/contexts/user-context';
import { CrearUsuario } from '@/services/gestionycontrol/usuarios/CrearUsuarioService';

const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const RolesDisponibles = [
    { value: '1', label: 'Administrador' },
    { value: '2', label: 'Mecánico' },
    { value: '3', label: 'Conductor' },
    { value: '4', label: 'Cliente' },
]

const campos: DefinicionCampo[] = [
    { nombre: 'Nombres', etiqueta: 'Nombre', md: 4 },
    { nombre: 'TipoDocumento', etiqueta: 'Tipo de identificación', md: 2, tipo: 'select', opciones: TipoDocumentos },
    { nombre: 'DocumentoUsuario', etiqueta: 'Identificación', md: 2 },
    { nombre: 'Direccion', etiqueta: 'Dirección', md: 4 },
    { nombre: 'Telefono', etiqueta: 'Teléfono', md: 2 },
    { nombre: 'Celular', etiqueta: 'Celular', md: 2, maximalongitud: 10 },
    { nombre: 'Correo', etiqueta: 'Correo', md: 4 },
    { nombre: 'Estado', etiqueta: 'Estado', md: 2, tipo: 'select', opciones: EstadoCliente },
    { nombre: 'Roles', etiqueta: 'Rol', md: 2, tipo: 'select', opciones: RolesDisponibles, bloqueado: true },
];

//Se definen las reglas con su respectivo mensaje de alerta
const reglasValidacion = [
    { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
    { campo: 'DocumentoUsuario', mensaje: 'La identificación es obligatoria.' },
    { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
    { campo: 'Telefono', mensaje: 'El teléfono es obligatorio.' },
    { campo: 'Celular', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
    { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
    { campo: 'Estado', mensaje: 'El estado es obligatorio' }
];

function datosVacios(usuarioCreacion: string | null) {
    return {
        Nombres: '',
        TipoDocumento: '4',
        DocumentoUsuario: '',
        Direccion: '',
        Telefono: '',
        Celular: '',
        Correo: '@gmail.com',
        Estado: '1',
        UsuarioCreacion: usuarioCreacion,
        Roles: '4'
    };
}

export function FormularioCrearCliente(): React.JSX.Element {
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const [datos, setDatos] = React.useState(() => datosVacios(documentoUsuarioActivo));
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();
    const { progreso, cargando, ejecutar } = useProgresoSimulado();

    const manejarValidacionExitosa = () => {
        console.log("Validación exitosa. Procesar datos...", datos);
    };

    const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);

    const handleCrearCliente = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                await ejecutar(() => CrearUsuario(datos));
                mostrarMensaje('Cliente creado exitosamente', 'success');
                setDatos(datosVacios(documentoUsuarioActivo));
            } catch (error) {
                mostrarMensaje(`Error al crear el cliente: ${error}`, 'error');
            }
        }
    };

    // Función para verificar si el cliente ya existe
    const verificarClienteExistente = async (identificacion: string) => {
        if (!identificacion) return; // Si no hay identificación, no consultar

        console.log('Verificando cliente con identificacion:', identificacion);

        const result = await verificarClienteExistenteService(identificacion);

        if (result) {
            mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
            console.log('Cliente encontrado:', result);
        } else {
            console.log('Cliente no encontrado');
        }
    };

    //Función para manejar el cambio en los inputs
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));

        if (name === 'DocumentoUsuario' && value.trim() !== '') {
            console.log(value);
            await verificarClienteExistente(value);
        }

        if (name === 'Estado') {
            console.log(value);
        }
    };

    return (
        <TarjetaFormulario
            titulo='Creación de cliente'
            textoBoton='Crear cliente'
            onGuardar={handleCrearCliente}
            validacion={{ ref: formularioRef, datos, reglas: reglasValidacion, onValid: manejarValidacionExitosa }}
            alerta={propsAlerta}
            pie={cargando && <CircularProgressWithLabel value={progreso} />}
        >
            <CamposFormulario campos={campos} datos={datos} onChange={handleChange} />
        </TarjetaFormulario>
    );
}
