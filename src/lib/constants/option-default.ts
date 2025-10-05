interface SelectOption {
    readonly value: string;
    readonly label: string;
}
const EmpresaAnfitriona: SelectOption = {
    value: "901893972-3", label: "TECNISERVICIOS J.F S.A.S"
} as const;

const OpcionPorDefecto: SelectOption = {
    value: 'SinSeleccionar', label: 'Sin seleccionar'
} as const;

export {
    EmpresaAnfitriona,
    OpcionPorDefecto
};