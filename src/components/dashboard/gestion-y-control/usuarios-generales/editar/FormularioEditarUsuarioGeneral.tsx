'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { useMensajeAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import { CamposFormulario } from '@/components/dashboard/componentes_generales/formulario/CamposFormulario';
import { TarjetaFormulario } from '@/components/dashboard/componentes_generales/formulario/TarjetaFormulario';
import { BotonEditar, ModalFormulario } from '@/components/dashboard/componentes_generales/modal/ModalFormulario';
import { UserContext } from '@/contexts/user-context';
import { ActualizarUsuarioGeneral } from '@/services/gestionycontrol/usuariosgenerales/ActualizarUsuarioGeneralService';
import { ConsultarUsuarioGeneralPorDocumento } from '@/services/gestionycontrol/usuariosgenerales/ConsultarUsuarioGeneralPorDocumentoService';
import * as React from 'react';

import {
    camposUsuarioGeneral,
    datosUsuarioGeneralVacios,
    useCatalogosUsuarioGeneral,
    useDatosUsuarioGeneral,
} from '../comun/usuario-general';

interface Props {
    readonly onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly DatosUsuarioAActualizar: string;
    readonly sendMessage: (event: string, payload: any) => void;
}

const reglasValidacion = [
    { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
    { campo: 'Apellidos', mensaje: 'El apellido es obligatorio.' },
    { campo: 'Documento', mensaje: 'El documento es obligatorio.' },
    { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
    { campo: 'Celular', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
    { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
    { campo: 'Estado', mensaje: 'El estado es obligatorio' },
    { campo: 'Roles', mensaje: 'El rol es obligatorio' },
];

/** Roles guardados como "1, 4" → [1, 4] (sin vacíos). */
function rolesDesdeTexto(roles: string | null | undefined): number[] {
    return (roles ?? '')
        .split(',')
        .map((roleId: string) => {
            const trimmedId = roleId.trim();
            return trimmedId ? Number(trimmedId) : null;
        })
        .filter((roleId): roleId is number => roleId !== null);
}

export function FormularioEditarUsuarioGeneral({ onMostrarMensaje, DatosUsuarioAActualizar, sendMessage }: Props): React.JSX.Element {
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const { mostrarMensaje, propsAlerta } = useMensajeAlerta();
    const { tiposDeDocumentos, roles, niveles, cargarJuntos } = useCatalogosUsuarioGeneral();
    const { datos, setDatos, handleChange, mostrarCampoContacto } = useDatosUsuarioGeneral(
        datosUsuarioGeneralVacios('', documentoUsuarioActivo),
        mostrarMensaje
    );

    //Se consulta usuario general a editar
    const ConsultarUsuarioGeneral = async (DocumentoUsuarioGeneral: string) => {
        try {
            const [usuario] = await ConsultarUsuarioGeneralPorDocumento(DocumentoUsuarioGeneral);
            setDatos({
                Nombres: usuario.Nombres,
                Apellidos: usuario.Apellidos,
                TipoDocumento: usuario.TipoDocumento,
                Documento: usuario.Documento,
                Direccion: usuario.Direccion,
                Celular1: usuario.Celular1,
                Celular2: usuario.Celular2,
                Correo: usuario.Correo,
                UsuarioCreacion: usuario.UsuarioCreacion,
                Estado: usuario.Estado,
                Roles: rolesDesdeTexto(usuario.Roles),
                Nivel: usuario.Nivel,
                Contacto: usuario.Contacto,
            });
        } catch (error) {
            console.error('Error...', error);
        }
    };

    const EditarUsuarioGeneral = async () => {
        try {
            setModalAbierto(true);
            void cargarJuntos();
            await ConsultarUsuarioGeneral(DatosUsuarioAActualizar);
        } catch (error) {
            mostrarMensaje(`Error al cargar los datos del usuario general. Error: ${error}`, 'error');
        }
    };

    const manejarValidacionExitosa = () => {
        console.log("Validación exitosa. Procesar datos...", datos);
    };
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);

    const handleActualizarUsuarioGeneral = async () => {
        try {
            await ActualizarUsuarioGeneral(datos);
            sendMessage('usuario-actualizado', {});
            onMostrarMensaje('Usuario general actualizado exitosamente', 'success');
        } catch (error) {
            onMostrarMensaje(`Error al actualizar el usuario general: ${error}`, 'error');
        }
    };

    return (
        <>
            <MensajeAlerta {...propsAlerta} />
            <BotonEditar onClick={EditarUsuarioGeneral} />
            <ModalFormulario
                abierto={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
                titulo='Actualizar Usuario'
                // El Modal usa un Box plano, así que no hereda el estilo de MuiDialog:
                // se replica aquí (superficie + borde) para que tenga definición en oscuro.
                sx={{
                    bgcolor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)',
                    border: '1px solid var(--mui-palette-divider)',
                }}
            >
                <TarjetaFormulario
                    textoBoton='Guardar cambios'
                    onGuardar={handleActualizarUsuarioGeneral}
                    validacion={{ ref: formularioRef, datos, reglas: reglasValidacion, onValid: manejarValidacionExitosa }}
                >
                    <CamposFormulario
                        campos={camposUsuarioGeneral({ tiposDeDocumentos, roles, niveles, mostrarContacto: mostrarCampoContacto, documentoBloqueado: true })}
                        datos={datos}
                        onChange={handleChange}
                    />
                </TarjetaFormulario>
            </ModalFormulario>
        </>
    );
};
