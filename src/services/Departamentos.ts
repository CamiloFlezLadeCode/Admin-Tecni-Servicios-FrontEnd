const ImplementacionEnFrontEnd = `
    import Input from '@/components/dashboard/componentes_generales/formulario/Input';
    import Departamentos from '@/services/Departamentos';

    //Estado Departamento
    const [Departamento, setDepartamento] = React.useState<string>('1');
    const handleChangeDepartamento = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setDepartamento(newValue);
    };

    //Dentro del componente que retorna
    <Grid md={2} xs={12} mt={0.5}>
        <InputSelect
            label='Departamento'
            value={Departamento}
            options={Departamentos}
            size='small'
            onChange={handleChangeDepartamento}
            valorname='Departamento'
        />
    </Grid>
`;

const Departamentos = [
    {
        "value": 1,
        "label": "ANTIOQUIA"
    },
    {
        "value": 2,
        "label": "ATLÁNTICO"
    },
    {
        "value": 3,
        "label": "BOGOTÁ, D.C."
    },
    {
        "value": 4,
        "label": "BOLÍVAR"
    },
    {
        "value": 5,
        "label": "BOYACÁ"
    },
    {
        "value": 6,
        "label": "CALDAS"
    },
    {
        "value": 7,
        "label": "CAQUETÁ"
    },
    {
        "value": 8,
        "label": "CAUCA"
    },
    {
        "value": 9,
        "label": "CESAR"
    },
    {
        "value": 10,
        "label": "CÓRDOBA"
    },
    {
        "value": 11,
        "label": "CUNDINAMARCA"
    },
    {
        "value": 12,
        "label": "CHOCÓ"
    },
    {
        "value": 13,
        "label": "HUILA"
    },
    {
        "value": 14,
        "label": "LA GUAJIRA"
    },
    {
        "value": 15,
        "label": "MAGDALENA"
    },
    {
        "value": 16,
        "label": "META"
    },
    {
        "value": 17,
        "label": "NARIÑO"
    },
    {
        "value": 18,
        "label": "NORTE DE SANTANDER"
    },
    {
        "value": 19,
        "label": "QUINDIO"
    },
    {
        "value": 20,
        "label": "RISARALDA"
    },
    {
        "value": 21,
        "label": "SANTANDER"
    },
    {
        "value": 22,
        "label": "SUCRE"
    },
    {
        "value": 23,
        "label": "TOLIMA"
    },
    {
        "value": 24,
        "label": "VALLE DEL CAUCA"
    },
    {
        "value": 25,
        "label": "ARAUCA"
    },
    {
        "value": 26,
        "label": "CASANARE"
    },
    {
        "value": 27,
        "label": "PUTUMAYO"
    },
    {
        "value": 28,
        "label": "ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA"
    },
    {
        "value": 29,
        "label": "AMAZONAS"
    },
    {
        "value": 30,
        "label": "GUAINÍA"
    },
    {
        "value": 31,
        "label": "GUAVIARE"
    },
    {
        "value": 32,
        "label": "VAUPÉS"
    },
    {
        "value": 33,
        "label": "VICHADA"
    }
];

export default Departamentos;