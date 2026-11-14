'use client';

import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { CamposFormulario } from '@/components/dashboard/componentes_generales/formulario/CamposFormulario';
import { TarjetaFormulario } from '@/components/dashboard/componentes_generales/formulario/TarjetaFormulario';
import { UserContext } from '@/contexts/user-context';
import { CrearUsuarioGeneral } from '@/services/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralService';
import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';

import {
    camposUsuarioGeneral,
    datosUsuarioGeneralVacios,
    useCatalogosUsuarioGeneral,
    useDatosUsuarioGeneral,
} from '../comun/usuario-general';

//Se definen las reglas con su respectivo mensaje de alerta
const reglasValidacion = [
    { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
    { campo: 'Documento', mensaje: 'El documento es obligatorio.' },
    { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
    { campo: 'Celular1', mensaje: 'El celular 1 es obligatorio y debe ser un número válido de 10 dígitos.' },
    { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
    { campo: 'Estado', mensaje: 'El estado es obligatorio' },
    { campo: 'Roles', mensaje: 'El rol es obligatorio' },
];

export function FormularioCrearUsuarioGeneral(): React.JSX.Element {
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();
    const { tiposDeDocumentos, roles, niveles, cargarPorSeparado } = useCatalogosUsuarioGeneral();
    const { datos, setDatos, handleChange, mostrarCampoContacto } = useDatosUsuarioGeneral(
        datosUsuarioGeneralVacios('1', documentoUsuarioActivo),
        mostrarMensaje
    );

    React.useEffect(() => {
        cargarPorSeparado();
    }, []);

    const manejarValidacionExitosa = () => {
        console.log("Validación exitosa. Procesar datos...", datos);
    };
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
    const { sendMessage } = useSocketIO();

    const handleCrearUsuarioGeneral = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                await CrearUsuarioGeneral(datos);
                sendMessage('usuario-creado', {});
                mostrarMensaje('Usuario general creado exitosamente', 'success');
                setDatos(datosUsuarioGeneralVacios('1', documentoUsuarioActivo));
            } catch (error) {
                mostrarMensaje(`Error al crear el usuario general: ${error}`, 'error');
            }
        }
    };

    return (
        <TarjetaFormulario
            titulo='Creación de usuario general'
            textoBoton='Crear usuario'
            onGuardar={handleCrearUsuarioGeneral}
            validacion={{ ref: formularioRef, datos, reglas: reglasValidacion, onValid: manejarValidacionExitosa }}
            alerta={propsAlerta}
        >
            <CamposFormulario
                campos={camposUsuarioGeneral({ tiposDeDocumentos, roles, niveles, mostrarContacto: mostrarCampoContacto })}
                datos={datos}
                onChange={handleChange}
            />
        </TarjetaFormulario>
    );
};
