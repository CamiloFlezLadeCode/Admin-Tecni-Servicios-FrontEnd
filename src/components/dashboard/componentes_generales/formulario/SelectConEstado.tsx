'use client';
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

// Tokens semánticos: el punto de estado conserva su código de color y se
// reajusta solo al alternar entre modo claro y oscuro.
const estadoColor: Record<EquipoEstadoOption['estado'], string> = {
    Disponible: 'var(--mui-palette-success-main)',      // verde
    'No disponible': 'var(--mui-palette-error-main)',   // rojo
    Reparación: 'var(--mui-palette-warning-main)',      // ámbar
    Activo: 'var(--mui-palette-info-main)',
    Inactivo: 'var(--mui-palette-text-disabled)'
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
    const labelId = `${valorname ?? label}-label`;

    return (
        <Grid item md={3} xs={12}>
            <FormControl fullWidth required={required} variant="outlined" size={size} disabled={bloqueado}>
                <InputLabel
                    id={labelId}
                    shrink
                    // El color del label (normal, foco, deshabilitado) lo resuelve el tema.
                    style={{
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
                                {/* El token va en el contenedor y el icono lo hereda: un
                                    `var()` suelto en la prop `color` del icono no siempre resuelve. */}
                                <Box component="span" sx={{ display: 'flex', color: estadoColor[estado] }}>
                                    <Circle size={14} weight="fill" color="currentColor" />
                                </Box>
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
