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

const ParametroBuscarBodegasReparacion: SelectOptionNumber = {
    value: 1, label: 'Bodegas de reparación'
}

const ParametroBuscarBodegasRepuestos: SelectOptionNumber = {
    value: 2, label: 'Bodegas de repuestos'
}

const ParametroBuscarBodegasAlquiler: SelectOptionNumber = {
    value: 3, label: 'Bodegas de alquiler'
}
export {
    EmpresaAnfitriona,
    OpcionPorDefecto,
    OpcionPorDefectoNumber,
    ParametroBuscarBodegasReparacion,
    ParametroBuscarBodegasRepuestos,
    ParametroBuscarBodegasAlquiler
};