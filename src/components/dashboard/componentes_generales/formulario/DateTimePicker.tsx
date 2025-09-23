// import React from 'react';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// interface PropsDateTimePicker {
//     Label: string;
//     Value: string;
//     // onChange: (event:)
// }

// export default function FechayHora({ Label, Value }: PropsDateTimePicker): React.JSX.Element {
//     return (

//         <DateTimePicker
//             label="Fecha y hora"
//             format='dd/MM/yyyy'
//             slotProps={{
//                 textField: {
//                     required: true,
//                     variant: 'outlined',
//                     InputLabelProps: {
//                         shrink: true, // ← Esto fuerza el label arriba
//                     },
//                     sx: {
//                         width: '100%',
//                         '& .MuiInputBase-root': {
//                             height: '40px',
//                             // backgroundColor: '#f5f5f5',
//                         },
//                         '& .MuiInputBase-input': {
//                             padding: '8px 12px',
//                         },
//                         // Estilos para el label en posición "notched"
//                         '& .MuiInputLabel-outlined': {
//                             transform: 'translate(14px, -6px) scale(0.75)',
//                             backgroundColor: 'white', // Fondo blanco para el efecto notched
//                             padding: '0 4px',
//                             fontWeight: 'bold',
//                             '&.Mui-focused': {
//                                 color: '#000000', // ← Negro puro cuando está enfocado
//                             },
//                         },
//                         '& .MuiOutlinedInput-root': {
//                             '& fieldset': {
//                                 // borderRadius: '4px',
//                             },
//                         },
//                     },
//                 },
//             }}
//         />
//     )
// }





import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// Configurar dayjs
import 'dayjs/locale/es';
dayjs.locale('es');

// Type para las props
interface CustomDateTimePickerProps {
    value?: Dayjs | null;
    onChange?: (date: Dayjs | null) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    minDateTime?: Dayjs;
    maxDateTime?: Dayjs;
    className?: string;
};

const FechayHora: React.FC<CustomDateTimePickerProps> = ({
    value,
    onChange,
    label = "Fecha y hora",
    required = false,
    disabled = false,
    minDateTime,
    maxDateTime,
    className
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}
            localeText={{
                okButtonLabel: "Aceptar",   // cambia el texto del botón "accept"
                cancelButtonLabel: "Cancelar",
                clearButtonLabel: "Limpiar",
                todayButtonLabel: "Hoy"
            }}
        >
            <DateTimePicker
                label={label}
                value={value}
                onChange={onChange}
                format="DD/MM/YYYY hh:mm A"
                ampm={true}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                minDate={minDateTime}
                maxDate={maxDateTime}
                disabled={disabled}
                reduceAnimations={true} // Mejor rendimiento en Next.js
                slotProps={{
                    textField: {
                        size: 'small',
                        fullWidth: true,
                        required,
                        className,
                        sx: {
                            // '& .MuiInputBase-root': {
                            //     height: '40px',
                            //     // backgroundColor: '#f5f5f5',
                            // },
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
                        }
                    },
                    actionBar: {
                        actions: ['clear', 'accept'],
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default FechayHora;