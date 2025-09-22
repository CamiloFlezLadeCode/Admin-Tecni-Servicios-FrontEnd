import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface PropsDateTimePicker {
    Texto: string;
}

export default function FechayHora(): React.JSX.Element {
    return (

        <DateTimePicker
            label="Fecha y hora"
            slotProps={{
                textField: {
                    required: true,
                    variant: 'outlined',
                    InputLabelProps: {
                        shrink: true, // ← Esto fuerza el label arriba
                    },
                    sx: {
                        width: '100%',
                        '& .MuiInputBase-root': {
                            height: '40px',
                            // backgroundColor: '#f5f5f5',
                        },
                        '& .MuiInputBase-input': {
                            padding: '8px 12px',
                        },
                        // Estilos para el label en posición "notched"
                        '& .MuiInputLabel-outlined': {
                            transform: 'translate(14px, -6px) scale(0.75)',
                            backgroundColor: 'white', // Fondo blanco para el efecto notched
                            padding: '0 4px',
                            fontWeight: 'bold',
                            '&.Mui-focused': {
                                color: '#000000', // ← Negro puro cuando está enfocado
                            },
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                // borderRadius: '4px',
                            },
                        },
                    },
                },
            }}
        />
    )
}