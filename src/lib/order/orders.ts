import { EmpresaAnfitriona } from "../constants/option-default";

interface Opcion {
    label: string;
    value: string;
}

interface Props {
    AllSubarrendatarios?: Opcion[]; // 👈 puede ser undefined mientras carga
}

// const OrdenarSubarrendatarios = async ({ AllSubarrendatarios }: Props): Promise<Opcion[]> => {
//     if (!AllSubarrendatarios || !Array.isArray(AllSubarrendatarios)) {
//         return [];
//     }

//     // Filtra nulos, vacíos o sin valor
//     const validas = AllSubarrendatarios.filter(
//         (opcion) => opcion?.label?.trim() && opcion?.value?.trim()
//     );

//     const existeAnfitriona = AllSubarrendatarios.some(
//         (opcion) => opcion.value === EmpresaAnfitriona.value
//     );

//     // Si existe, la movemos al inicio; si no, solo ordenamos las demás
//     const opcionesOrdenadas = existeAnfitriona
//         ? [
//             EmpresaAnfitriona,
//             ...AllSubarrendatarios.filter(
//                 (opcion) => opcion.value !== EmpresaAnfitriona.value
//             ),
//         ]
//         : AllSubarrendatarios;

//     return opcionesOrdenadas;
// };


const OrdenarSubarrendatarios = async ({ AllSubarrendatarios }: Props): Promise<Opcion[]> => {
    if (!AllSubarrendatarios || !Array.isArray(AllSubarrendatarios)) {
        return [];
    }

    const opcionesValidas = filtrarOpcionesValidas(AllSubarrendatarios);

    if (opcionesValidas.length === 0) {
        return [];
    }

    return ordenarOpcionesConAnfitriona(opcionesValidas);
};

// Funciones auxiliares para mejor legibilidad
const filtrarOpcionesValidas = (opciones: Opcion[]): Opcion[] => {
    return opciones.filter(
        (opcion) => opcion?.label?.trim() && opcion?.value?.trim()
    );
};

const ordenarOpcionesConAnfitriona = (opcionesValidas: Opcion[]): Opcion[] => {
    const existeAnfitriona = opcionesValidas.some(
        (opcion) => opcion.value === EmpresaAnfitriona.value
    );

    if (!existeAnfitriona) {
        return opcionesValidas;
    }

    return [
        EmpresaAnfitriona,
        ...opcionesValidas.filter(
            (opcion) => opcion.value !== EmpresaAnfitriona.value
        ),
    ];
};

export { OrdenarSubarrendatarios };
