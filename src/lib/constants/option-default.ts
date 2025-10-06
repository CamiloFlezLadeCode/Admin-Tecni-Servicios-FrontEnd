interface SelectOption {
    readonly value: string;
    readonly label: string;
}
interface SelectOptionNumber {
    readonly value: number;
    readonly label: string;
}

const EmpresaAnfitriona: SelectOption = {
    value: "901893972-3", label: "TECNISERVICIOS J.F S.A.S"
} as const;

const OpcionPorDefecto: SelectOption = {
    value: 'SinSeleccionar', label: 'Sin seleccionar'
} as const;

const OpcionPorDefectoNumber: SelectOptionNumber = {
    value: 0, label: 'Sin seleccionar'
}
export {
    EmpresaAnfitriona,
    OpcionPorDefecto,
    OpcionPorDefectoNumber
};