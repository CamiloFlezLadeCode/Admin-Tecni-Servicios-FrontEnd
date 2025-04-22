// components/InputText.tsx
import React from 'react';
import { FormControl, InputLabel, TextField, Grid, OutlinedInput } from '@mui/material';


interface InputTextProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    tamano: 'small' | 'medium'; // Especifica los tamaños permitidos
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


const InputText: React.FC<InputTextProps> = ({ label, value, onChange, required = false, tamano }) => {
    return (
        <Grid item xs={12}>
            <FormControl fullWidth required={required} variant="outlined">
                <InputLabel htmlFor={label}>{label}</InputLabel>
                <OutlinedInput
                    id={label} // Vinculación correcta
                    value={value}
                    onChange={onChange}
                    label={label} // Asegúrate de incluir el label aquí
                    size={tamano}
                />
            </FormControl>
        </Grid>
    );
};

export default InputText;
