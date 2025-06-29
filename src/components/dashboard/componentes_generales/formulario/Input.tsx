// components/InputText.tsx
import React from 'react';
import { FormControl, InputLabel, TextField, Grid, OutlinedInput } from '@mui/material';
import { OutlinedInputProps } from '@mui/material';

// interface InputTextProps {
//     label: string;
//     value: string | number;
//     onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
//     required?: boolean;
//     tamano: 'small' | 'medium'; // Especifica los tamaños permitidos
//     tipo_input: 'text' | 'input' | 'date' | 'time' | 'number' | 'textarea' | 'password';
//     valorname?: string;
//     maximalongitud?: number;
//     bloqueado?: boolean;
//     LongitudMaxima?: number;
//     InputProps?: Partial<OutlinedInputProps>;
//     // InputProps?: any; // 👈 importante permitir esto
// }

// const InputText: React.FC<InputTextProps> = ({ label, value, onChange, required = false, tamano, tipo_input, valorname, maximalongitud, bloqueado, LongitudMaxima, InputProps }) => {
//     const [focused, setFocused] = React.useState(false);
//     return (
//         <FormControl fullWidth required={required} variant="outlined">
//             <InputLabel htmlFor={label} shrink
//                 // style={{color: '#000000', fontWeight: 'bolder'}}
//                 // style={{
//                 //     color: value ? '#000000' : '#B0B0B0', // Color gris si no hay valor
//                 //     fontWeight: 'bolder',
//                 // }}
//                 style={{
//                     // color: focused || value ? '#000000' : '#B0B0B0', // Color negro si está enfocado o tiene valor
//                     color: focused ? '#000000' : 'gray', // Color negro si está enfocado o tiene valor
//                     fontWeight: 'bolder',
//                 }}
//             >
//                 {label}
//             </InputLabel>
//             <OutlinedInput
//                 id={label} // Vinculación correcta
//                 // name={label}
//                 name={valorname}
//                 value={value}
//                 onChange={onChange}
//                 label={label} // Asegúrate de incluir el label aquí
//                 size={tamano}
//                 // type={tipo_input}
//                 type={tipo_input === 'textarea' ? 'text' : tipo_input} // Usar 'text' para textarea
//                 multiline={tipo_input === 'textarea'} // Habilitar multiline si es un textarea
//                 minRows={tipo_input === 'textarea' ? 3 : 1} // Mínimo de filas para textarea
//                 notched // Esta propiedad hace que la muesca sea visible siempre
//                 onFocus={() => setFocused(true)} // Cambiar estado a enfocado
//                 onBlur={() => setFocused(false)} // Cambiar estado a no enfocado
//                 inputProps={{
//                     maxLength: maximalongitud || undefined, // Establecer longitud máxima si se proporciona
//                 }}
//                 disabled={bloqueado}
//                 {...InputProps} // <-- Esto es lo nuevo
//             />
//         </FormControl>
//     );
// };

interface InputTextProps {
    label: string;
    value: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    tamano: 'small' | 'medium';
    tipo_input: 'text' | 'input' | 'date' | 'time' | 'number' | 'textarea' | 'password';
    valorname?: string;
    maximalongitud?: number;
    bloqueado?: boolean;
    LongitudMaxima?: number;
    endAdornment?: React.ReactNode; // 👈 usamos esto
    mostrar?: 'none' | 'block';
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
    const {
        label,
        value,
        onChange,
        required = false,
        tamano,
        tipo_input,
        valorname,
        maximalongitud,
        bloqueado,
        LongitudMaxima,
        endAdornment, // 👈 recogido aquí
        mostrar,
        ...rest
    } = props;

    const [focused, setFocused] = React.useState(false);

    return (
        <FormControl
            sx={{
                display: mostrar
            }}
            fullWidth required={required} variant="outlined">
            <InputLabel
                htmlFor={label}
                shrink
                style={{
                    color: focused ? '#000000' : 'gray',
                    fontWeight: 'bolder',
                    display: mostrar
                }}
            >
                {label}
            </InputLabel>
            <OutlinedInput
                id={label}
                name={valorname}
                value={value}
                onChange={onChange}
                label={label}
                size={tamano}
                type={tipo_input === 'textarea' ? 'text' : tipo_input}
                multiline={tipo_input === 'textarea'}
                minRows={tipo_input === 'textarea' ? 3 : 1}
                notched
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                inputProps={{
                    maxLength: maximalongitud || undefined,
                }}
                endAdornment={endAdornment} // 👈 ahora sí, correctamente usado
                disabled={bloqueado}
                inputRef={ref}
                {...rest}
                sx={{
                    display: mostrar
                }}
            />
        </FormControl>
    );
});


export default InputText;
