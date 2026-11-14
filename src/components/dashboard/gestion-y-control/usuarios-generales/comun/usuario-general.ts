import { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

import type { DefinicionCampo } from '@/components/dashboard/componentes_generales/formulario/CamposFormulario';
import { ListarNiveles } from '@/services/generales/ListarNivelesService';
import { ListarRoles } from '@/services/generales/ListarRolesService';
import { ListarTiposDeDocumentos } from '@/services/generales/ListarTipoDeDocumentosService';
import { VerificarExistenciaUsuario } from '@/services/gestionycontrol/usuariosgenerales/VerificarExistenciaUsuarioGeneralService';

/** Lógica compartida por los formularios de crear y editar usuario general. */

export const EstadoUsuarioGeneral = [
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
];

/** Id del rol Cliente: solo a los clientes se les pide "Contacto". */
const ROL_CLIENTE = 4;

export interface DatosUsuarioGeneral {
    Nombres: string;
    Apellidos: string;
    TipoDocumento: string;
    Documento: string;
    Direccion: string;
    Celular1: string;
    Celular2: string;
    Correo: string;
    UsuarioCreacion: any;
    Estado: string;
    Roles: any[];
    Nivel: string;
    Contacto: string;
}

export function datosUsuarioGeneralVacios(tipoDocumento: string, usuarioCreacion: string | null): DatosUsuarioGeneral {
    return {
        Nombres: '',
        Apellidos: '',
        TipoDocumento: tipoDocumento,
        Documento: '',
        Direccion: '',
        Celular1: '',
        Celular2: '',
        Correo: '@gmail.com',
        UsuarioCreacion: usuarioCreacion,
        Estado: '1',
        Roles: [],
        Nivel: '',
        Contacto: ''
    };
}

type Opcion = { value: string | number; label: string };

/** Campos del formulario, en el orden y tamaño en que se muestran. */
export function camposUsuarioGeneral(opciones: {
    tiposDeDocumentos: Opcion[];
    roles: Opcion[];
    niveles: Opcion[];
    mostrarContacto: 'none' | 'block';
    documentoBloqueado?: boolean;
}): DefinicionCampo[] {
    return [
        { nombre: 'Nombres', etiqueta: 'Nombres', md: 3 },
        { nombre: 'Apellidos', etiqueta: 'Apellidos', md: 3 },
        { nombre: 'TipoDocumento', etiqueta: 'Tipo de documento', md: 3, tipo: 'select', opciones: opciones.tiposDeDocumentos },
        { nombre: 'Documento', etiqueta: 'Documento', md: 3, bloqueado: opciones.documentoBloqueado },
        { nombre: 'Direccion', etiqueta: 'Dirección', md: 4 },
        { nombre: 'Celular1', etiqueta: 'Celular 1', md: 2, maximalongitud: 10 },
        { nombre: 'Celular2', etiqueta: 'Celular 2', md: 2, maximalongitud: 10 },
        { nombre: 'Correo', etiqueta: 'Correo', md: 4 },
        { nombre: 'Estado', etiqueta: 'Estado', md: 2, tipo: 'select', opciones: EstadoUsuarioGeneral },
        { nombre: 'Roles', etiqueta: 'Rol/es', md: 10, tipo: 'multiple', opciones: opciones.roles },
        { nombre: 'Nivel', etiqueta: 'Nivel', md: 2, tipo: 'select', opciones: opciones.niveles },
        { nombre: 'Contacto', etiqueta: 'Contacto', md: 4, mostrar: opciones.mostrarContacto },
    ];
}

/** Catálogos del formulario: tipos de documento, roles y niveles. */
export function useCatalogosUsuarioGeneral() {
    const [tiposDeDocumentos, setTiposDeDocumentos] = React.useState<Opcion[]>([]);
    const [roles, setRoles] = React.useState<Opcion[]>([]);
    const [niveles, setNiveles] = React.useState<Opcion[]>([]);

    /** Cada catálogo por separado: si uno falla, los demás igual cargan. */
    const cargarPorSeparado = () => {
        ListarTiposDeDocumentos().then(setTiposDeDocumentos).catch((error) => console.log('Error al listar los tipos de documentos: ', error));
        ListarRoles().then(setRoles).catch((error) => console.error('Error al listar los roles: ', error));
        ListarNiveles().then(setNiveles).catch((error) => console.error('Error al listar los niveles: ', error));
    };

    /** Los tres a la vez: si uno falla no se asigna ninguno. */
    const cargarJuntos = async () => {
        try {
            const [TipoDocumentos, Roles, Niveles] = await Promise.all([ListarTiposDeDocumentos(), ListarRoles(), ListarNiveles()]);
            setTiposDeDocumentos(TipoDocumentos);
            setRoles(Roles);
            setNiveles(Niveles);
        } catch (error) {
            console.error(`Error al cargar los datos: ${error}`);
        }
    };

    return { tiposDeDocumentos, roles, niveles, cargarPorSeparado, cargarJuntos };
}

/**
 * Datos del formulario con su `onChange` común: al escribir el documento avisa si
 * ya existe, y el campo "Contacto" solo se muestra (y conserva) para clientes.
 */
export function useDatosUsuarioGeneral(inicial: DatosUsuarioGeneral, mostrarMensaje: (mensaje: string, tipo: 'success' | 'error') => void) {
    const [datos, setDatos] = React.useState<DatosUsuarioGeneral>(inicial);
    const [mostrarCampoContacto, setMostrarCampoContacto] = React.useState<'none' | 'block'>('none');

    const VerificarExistencia = async (documento: string) => {
        if (!documento) return; // Si no hay documento, no consultar
        const result = await VerificarExistenciaUsuario(documento);
        if (result) {
            mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
        }
    };

    const handleChange = async (e: SelectChangeEvent<string | string[]> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name ?? '']: value,
        }));

        if (name === 'Documento' && typeof value === 'string' && value.trim() !== '') {
            await VerificarExistencia(value);
        }
    };

    React.useEffect(() => {
        if (datos.Roles.includes(ROL_CLIENTE)) {
            setMostrarCampoContacto('block');
        } else {
            setMostrarCampoContacto('none');
            setDatos((prev) => ({ ...prev, Contacto: '' }));
        }
    }, [datos.Roles]);

    return { datos, setDatos, handleChange, mostrarCampoContacto };
}
