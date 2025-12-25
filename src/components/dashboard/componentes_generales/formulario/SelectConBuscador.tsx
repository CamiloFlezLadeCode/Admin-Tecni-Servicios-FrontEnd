// //ELEMENTO SIMILAR A SELECT CON ESTADO CON BUSCADOR EMBEBIDO...
// import React from 'react';
// import {
//     Autocomplete,
//     TextField,
//     Grid,
//     Typography,
//     Box
// } from '@mui/material';
// import { Circle } from '@phosphor-icons/react/dist/ssr';

// interface EquipoEstadoOption {
//     value: string | number;
//     label: string;
//     estado: 'Disponible' | 'No disponible' | 'Reparación' | 'Activo' | 'Inactivo';
// }

// interface InputSelectConEstadoProps {
//     label: string;
//     value: string | number;
//     onChange: (event: { target: { value: string | number; name?: string } }) => void;
//     options: EquipoEstadoOption[];
//     required?: boolean;
//     size?: 'small' | 'medium';
//     valorname?: string;
//     bloqueado?: boolean;
// }

// const estadoColor: Record<EquipoEstadoOption['estado'], string> = {
//     Disponible: '#15b79f',
//     'No disponible': '#f04438',
//     Reparación: '#fb9c0c',
//     Activo: '#0066cc',
//     Inactivo: '#999999',
// };

// const InputSelectConEstado: React.FC<InputSelectConEstadoProps> = ({
//     label,
//     value,
//     onChange,
//     options,
//     required = false,
//     size = 'small',
//     valorname,
//     bloqueado = false,
// }) => {
//     const selectedOption = options.find((option) => option.value === value) ?? null;
//     const [focused, setFocused] = React.useState(false);
//     return (
//         <Grid item md={3} xs={12}>
//             <Autocomplete
//                 fullWidth
//                 options={options}
//                 getOptionLabel={(option) => option.label}
//                 isOptionEqualToValue={(option, val) => option.value === val.value}
//                 value={selectedOption}
//                 disabled={bloqueado}
//                 onChange={(_, newValue) => {
//                     if (newValue?.estado !== 'Disponible') return; // Bloquear selección si no es disponible
//                     onChange({
//                         target: { value: newValue?.value ?? '', name: valorname }
//                     });
//                 }}
//                 renderInput={(params) => (
//                     <TextField
//                         {...params}
//                         label={label}
//                         required={required}
//                         variant="outlined"
//                         size={size}
//                         InputLabelProps={{
//                             shrink: true,
//                             style: {
//                                 fontWeight: 'bold',
//                                 color: focused ? '#000000' : 'gray',
//                             },
//                         }}
//                         onFocus={() => setFocused(true)}
//                         onBlur={() => setFocused(false)}
//                     />
//                 )}
//                 renderOption={(props, option) => {
//                     const isDisabled = option.estado !== 'Disponible';

//                     return (
//                         <Box
//                             component="li"
//                             {...props}
//                             key={option.value}
//                             aria-disabled={isDisabled}
//                             sx={{
//                                 opacity: isDisabled ? 0.5 : 1,
//                                 pointerEvents: isDisabled ? 'none' : 'auto',
//                                 userSelect: isDisabled ? 'none' : 'auto',
//                             }}
//                         >
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
//                                 <Typography noWrap>{option.label}</Typography>
//                                 <Circle size={14} weight="fill" color={estadoColor[option.estado]} />
//                             </Box>
//                         </Box>
//                     );
//                 }}
//                 filterOptions={(options, { inputValue }) =>
//                     options.filter((option) =>
//                         option.label.toLowerCase().includes(inputValue.toLowerCase())
//                     )
//                 }
//             />
//         </Grid>
//     );
// };

// export default InputSelectConEstado;

'use client';
import React from 'react';
import {
    Autocomplete,
    TextField,
    Grid
} from '@mui/material';

interface Option {
    value: string | number;
    label: string;
}

interface InputSelectProps {
    label: string;
    value: string | number;
    onChange: (event: { target: { value: string | number; name?: string } }) => void;
    options: Option[];
    required?: boolean;
    size?: 'small' | 'medium';
    valorname?: string;
    bloqueado?: boolean;
}

const SelectConBuscador: React.FC<InputSelectProps> = ({
    label,
    value,
    onChange,
    options,
    required = false,
    size = 'small',
    valorname,
    bloqueado = false,
}) => {
    const selectedOption = options.find((option) => option.value === value) ?? null;
    const [focused, setFocused] = React.useState(false);

    return (
        <Grid item md={3} xs={12}>
            <Autocomplete
                fullWidth
                options={options}
                getOptionLabel={(option) => String(option.label || option.value || '')}
                isOptionEqualToValue={(option, val) => option.value === val?.value}
                value={selectedOption}
                disabled={bloqueado}
                onChange={(_, newValue) => {
                    onChange({
                        target: { value: newValue?.value ?? '', name: valorname }
                    });
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        required={required}
                        variant="outlined"
                        size={size}
                        InputLabelProps={{
                            shrink: true,
                            style: {
                                fontWeight: 'bold',
                                color: focused ? '#000000' : 'gray',
                            },
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                )}
                filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                    )
                }
            />
        </Grid>
    );
};

export default SelectConBuscador;
