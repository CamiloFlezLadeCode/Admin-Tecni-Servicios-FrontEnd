'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { CamposFormulario, type DefinicionCampo } from '@/components/dashboard/componentes_generales/formulario/CamposFormulario';
import { TarjetaFormulario } from '@/components/dashboard/componentes_generales/formulario/TarjetaFormulario';
import { useProgresoSimulado } from '@/components/dashboard/componentes_generales/formulario/use-progreso-simulado';
import { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import TipoDocumentos from '@/services/TipoDocumentos';
import { CrearMecanico } from '@/services/gestionycontrol/mecanicos/CrearMecanicoService';
import { UserContext } from '@/contexts/user-context';
import { ListarNiveles } from '@/services/generales/ListarNivelesService';

const EstadoMecanico = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const RolesDisponibles = [
    { value: '1', label: 'Administrador' },
    { value: '2', label: 'Mecánico' },
    { value: '3', label: 'Conductor' },
    { value: '4', label: 'Cliente' },
]

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

function datosVacios(usuarioCreacion: string | null) {
    return {
        Nombres: '',
        Apellidos: '',
        TipoDocumento: '1',
        Documento: '',
        Direccion: '',
        Celular: '',
        Correo: '@gmail.com',
        UsuarioCreacion: usuarioCreacion,
        Estado: '1',
        Roles: '2',
        Nivel: ''
    };
}

export function FormularioCrearMecanico(): React.JSX.Element {
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const [datos, setDatos] = React.useState(() => datosVacios(documentoUsuarioActivo));
    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();
    const { ejecutar } = useProgresoSimulado();

    const manejarValidacionExitosa = () => {
        console.log("Validación exitosa. Procesar datos...", datos);
    };

    const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);

    const handleCrearMecanico = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                await ejecutar(() => CrearMecanico(datos));
                mostrarMensaje('Mecánico creado exitosamente', 'success');
                setDatos(datosVacios(documentoUsuarioActivo));
            } catch (error) {
                mostrarMensaje(`Error al crear el mecánico: ${error}`, 'error');
            }
        }
    };

    //Función para manejar el cambio en los inputs
    const handleChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };

    //Cargar los niveles
    const [niveles, setNiveles] = React.useState<{ value: string | number; label: string }[]>([]);
    React.useEffect(() => {
        ListarNiveles()
            .then((Niveles) => {
                console.log(Niveles);
                setNiveles(Niveles);
            })
            .catch((error) => console.error('Error al listar los niveles: ', error));
    }, []);

    const campos: DefinicionCampo[] = [
        { nombre: 'Nombres', etiqueta: 'Nombres', md: 3 },
        { nombre: 'Apellidos', etiqueta: 'Apellidos', md: 3 },
        { nombre: 'TipoDocumento', etiqueta: 'Tipo de documento', md: 3, tipo: 'select', opciones: TipoDocumentos },
        { nombre: 'Documento', etiqueta: 'Documento', md: 3 },
        { nombre: 'Direccion', etiqueta: 'Dirección', md: 4 },
        { nombre: 'Celular', etiqueta: 'Celular', md: 2, maximalongitud: 10 },
        { nombre: 'Correo', etiqueta: 'Correo', md: 4 },
        { nombre: 'Estado', etiqueta: 'Estado', md: 2, tipo: 'select', opciones: EstadoMecanico },
        { nombre: 'Roles', etiqueta: 'Rol', md: 2, tipo: 'select', opciones: RolesDisponibles, bloqueado: true },
        { nombre: 'Nivel', etiqueta: 'Nivel', md: 2, tipo: 'select', opciones: niveles },
    ];

    return (
        <TarjetaFormulario
            titulo='Creación de mecánico'
            textoBoton='Crear mecánico'
            onGuardar={handleCrearMecanico}
            validacion={{ ref: formularioRef, datos, reglas: reglasValidacion, onValid: manejarValidacionExitosa }}
            alerta={propsAlerta}
        >
            <CamposFormulario campos={campos} datos={datos} onChange={handleChange} />
        </TarjetaFormulario>
    );
};
