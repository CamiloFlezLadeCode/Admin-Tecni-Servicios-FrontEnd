'use client';
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, SelectChangeEvent, FormHelperText } from '@mui/material';

interface InputSelectProps {
  label: string;
  value: string | number;
  onChange: (event: SelectChangeEvent<string>) => void; // Cambiado a SelectChangeEvent
  options: { value: string | number; label: string }[]; // Array de opciones
  required?: boolean;
  size?: 'small' | 'medium'; // Tamaño del select
  valorname?: string;
  bloqueado?: boolean;
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
}

const InputSelect: React.FC<InputSelectProps> = ({ label, value, onChange, options, required = false, size = 'small', valorname, bloqueado, defaultValue, error = false, helperText = '' }) => {
  // return (
  //   <Grid item md={3} xs={12}>
  //     <FormControl fullWidth required={required} variant="outlined">
  //       <InputLabel
  //         htmlFor={label} shrink // Mejor comentado para evitar el issues por mal manejo de hmlfor
  //         style={{
  //           // color: focused || value ? '#000000' : '#B0B0B0', // Color negro si está enfocado o tiene valor
  //           color: focused ? '#000000' : 'gray', // Color negro si está enfocado o tiene valor
  //           fontWeight: 'bolder',
  //         }}
  //       >{label}</InputLabel>
  //       <Select
  //         id={label}
  //         value={value}
  //         name={valorname}
  //         onChange={onChange}
  //         label={label}
  //         variant="outlined"
  //         size={size}
  //         notched // Esta propiedad hace que la muesca sea visible siempre
  //         onFocus={() => setFocused(true)}  // Maneja el enfoque
  //         onBlur={() => setFocused(false)}   // Maneja la pérdida de enfoque
  //       >
  //         {options.map((option) => (
  //           <MenuItem key={option.value} value={option.value}>
  //             {option.label}
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </FormControl>
  //   </Grid>
  // );



  const labelId = `${valorname ?? label}-label`; // generar un id único

  return (
    <Grid item md={3} xs={12}>
      <FormControl fullWidth required={required} variant="outlined">
        <InputLabel
          id={labelId} // aquí
          shrink // 👈 Este es el truco
          // El color del label (normal, foco, deshabilitado) lo resuelve el tema.
          style={{
            fontWeight: 'bolder',
          }}
        >
          {label}
        </InputLabel>
        <Select
          labelId={labelId} // aquí conectamos bien
          id={valorname ?? label}
          value={String(value)}
          name={valorname}
          onChange={onChange}
          label={label}
          variant="outlined"
          size={size}
          notched
          disabled={bloqueado}
          defaultValue={defaultValue}
          error={error}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {/* Se propaga el estado de error para que el texto de ayuda tome el color semántico */}
        {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </FormControl>
    </Grid>
  );
};

export default InputSelect;