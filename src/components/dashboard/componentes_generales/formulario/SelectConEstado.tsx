// components/InputSelectConEstado.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, SelectChangeEvent, Typography, Box } from '@mui/material';
import { Circle } from '@phosphor-icons/react/dist/ssr';


interface EquipoEstadoOption {
    value: string | number;
    label: string;
    estado: 'Disponible' | 'No disponible' | 'Reparación' | 'Activo' | 'Inactivo';
}

interface InputSelectConEstadoProps {
    label: string;
    value: string | number;
    onChange: (event: SelectChangeEvent<string | number>) => void;
    options: EquipoEstadoOption[];
    required?: boolean;
    size?: 'small' | 'medium';
    valorname?: string;
    bloqueado?: boolean;
}

const estadoColor: Record<EquipoEstadoOption['estado'], string> = {
    Disponible: '#15b79f', //'#4caf50',    // verde
    'No disponible': '#f04438', //'#f44336', // rojo
    Reparación: '#fb9c0c', //'#ff9800',    // amarillo
    Activo: 'en propuesta', // color en propuesta/pensamiento
    Inactivo: 'en propuesta' // color en propuesta/pensamiento
};

const InputSelectConEstado: React.FC<InputSelectConEstadoProps> = ({
    label,
    value,
    onChange,
    options,
    required = false,
    size = 'small',
    valorname,
    bloqueado = false,
}) => {
    const [focused, setFocused] = React.useState(false);
    const labelId = `${valorname ?? label}-label`;

    return (
        <Grid item md={3} xs={12}>
            <FormControl fullWidth required={required} variant="outlined" size={size} disabled={bloqueado}>
                <InputLabel
                    id={labelId}
                    shrink
                    style={{
                        color: focused ? '#000000' : 'gray',
                        fontWeight: 'bolder',
                    }}
                >
                    {label}
                </InputLabel>
                <Select
                    labelId={labelId}
                    id={valorname ?? label}
                    value={value}
                    name={valorname}
                    onChange={onChange}
                    label={label}
                    variant="outlined"
                    size={size}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    notched
                >
                    {/* Con este muestra el circulo relleno justo donde termina el nombre del equipo */}
                    {/* {options.map(({ value: val, label: lbl, estado }) => (
            <MenuItem key={val} value={val}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{lbl}</Typography>
                <Circle size={14} weight="fill" color={estadoColor[estado]} />
              </Box>
            </MenuItem>
          ))} */}

                    {/* Con este muestra el circulo relleno al final, al costado derecho */}
                    {options.map(({ value: val, label: lbl, estado }) => (
                        <MenuItem key={val} value={val} disabled={estado !== 'Disponible'}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', width: '100%' }}>
                                <Typography noWrap>{lbl}</Typography>
                                <Circle size={14} weight="fill" color={estadoColor[estado]} />
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
};

export default InputSelectConEstado;



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
