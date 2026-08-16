'use client';
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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es"
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
                minDateTime={minDateTime}
                maxDateTime={maxDateTime}
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
                            // Estilos para el label en posición "notched".
                            // El fondo debe igualar la superficie del campo para tapar el borde;
                            // el color del texto lo resuelve el tema.
                            '& .MuiInputLabel-outlined': {
                                transform: 'translate(14px, -6px) scale(0.75)',
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                padding: '0 4px',
                                fontWeight: 'bold',
                                // Deshabilitado el campo cambia de superficie: el parche del label la sigue.
                                '&.Mui-disabled': {
                                    backgroundColor: 'var(--mui-palette-background-level1)',
                                },
                            },
                        }
                    },
                    // El calendario flota sobre la página: se le da el mismo tratamiento
                    // que a los menús para que no se pierda contra el fondo oscuro.
                    desktopPaper: {
                        sx: {
                            backgroundImage: 'none',
                            backgroundColor: 'var(--mui-palette-background-paper)',
                            border: '1px solid var(--mui-palette-divider)',
                            borderRadius: '12px',
                        },
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