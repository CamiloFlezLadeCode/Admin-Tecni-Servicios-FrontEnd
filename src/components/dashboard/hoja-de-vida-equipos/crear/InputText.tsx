'use client';
// components/InputText.tsx
import React from 'react';
import { FormControl, InputLabel, TextField, Grid, OutlinedInput } from '@mui/material';


interface InputTextProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    tamano: 'small' | 'medium'; // Especifica los tamaños permitidos
    tipo_input: 'input' | 'date' | 'time';
}

// const InputText: React.FC<InputTextProps> = ({ label, value, onChange, required = false, tamano }) => {
//   return (
//     <Grid item xs={12}>
//       <FormControl fullWidth required={required}>
//         <InputLabel>{label}</InputLabel>
//         <TextField
//           value={value}
//           onChange={onChange}
//           label={label}
//           variant="outlined"
//           fullWidth
//           required={required}
//           size={tamano}
//         />
//       </FormControl>
//     </Grid>
//   );
// };


export const InputText: React.FC<InputTextProps> = ({ label, value, onChange, required = false, tamano, tipo_input }) => {
    const [focused, setFocused] = React.useState(false);
    return (
        // <Grid md={anchocolumnas} item xs={12}>
        //     <FormControl fullWidth required={required} variant="outlined">
        //         <InputLabel htmlFor={label}>{label}</InputLabel>
        //         <OutlinedInput
        //             id={label} // Vinculación correcta
        //             value={value}
        //             onChange={onChange}
        //             label={label} // Asegúrate de incluir el label aquí
        //             size={tamano}
        //         />
        //     </FormControl>
        // </Grid>

        // VAMOSS
        // <FormControl fullWidth required={required} variant="outlined">
        //     <InputLabel htmlFor={label}>{label}</InputLabel>
        //     <OutlinedInput
        //         id={label} // Vinculación correcta
        //         value={value}
        //         onChange={onChange}
        //         label={label} // Asegúrate de incluir el label aquí
        //         size={tamano}
        //         type={tipo_input}
        //     />
        // </FormControl>

        // VAMOSS DOSSS
        <FormControl fullWidth required={required} variant="outlined">
            <InputLabel htmlFor={label} shrink 
                // style={{color: '#000000', fontWeight: 'bolder'}}
                // style={{
                //     color: value ? '#000000' : '#B0B0B0', // Color gris si no hay valor
                //     fontWeight: 'bolder',
                // }}
                style={{
                    // color: focused || value ? '#000000' : '#B0B0B0', // Color negro si está enfocado o tiene valor
                    color: focused ? '#000000' : 'gray', // Color negro si está enfocado o tiene valor
                    fontWeight: 'bolder',
                }}
                >
                {label}
            </InputLabel>
            <OutlinedInput
                id={label} // Vinculación correcta
                value={value}
                onChange={onChange}
                label={label} // Asegúrate de incluir el label aquí
                size={tamano}
                type={tipo_input}
                notched // Esta propiedad hace que la muesca sea visible siempre
                onFocus={() => setFocused(true)} // Cambiar estado a enfocado
                onBlur={() => setFocused(false)} // Cambiar estado a no enfocado
            />
        </FormControl>
    );
};

// export default InputText;
