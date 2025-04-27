import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface ReglaValidacion {
    campo: string;
    mensaje: string;
}

interface FormularioValidatorProps {
    datos: Record<string, any>;
    reglasValidacion: ReglaValidacion[];
    onValid: () => void;
}

export interface FormularioValidatorRef {
    manejarValidacion: () => void;
}

const FormularioValidator = forwardRef<FormularioValidatorRef, FormularioValidatorProps>(({ datos, reglasValidacion, onValid }, ref) => {
    const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const validarCampos = () => {
        const mensajesFaltantes: string[] = [];

        // reglasValidacion.forEach(({ campo, mensaje }) => {
        //     if (!datos[campo] || (campo === 'Celular' && (isNaN(Number(datos[campo])) || Number(datos[campo]) <= 0))) {
        //         mensajesFaltantes.push(mensaje);
        //     }
        // });

        // reglasValidacion.forEach(({ campo, mensaje }) => {
        //     if (!datos[campo]) {
        //         mensajesFaltantes.push(mensaje);
        //     } else if (campo === 'Celular') {
        //         const celular = datos[campo];

        //         // Verifica que el celular solo contenga dígitos
        //         const esNumeroValido = /^\d+$/.test(celular);

        //         // Si no es un número válido o está vacío, agrega el mensaje
        //         if (!esNumeroValido || celular.length === 0) {
        //             mensajesFaltantes.push(mensaje);
        //         }
        //     }
        // });

        reglasValidacion.forEach(({ campo, mensaje }) => {
            if (!datos[campo]) {
                mensajesFaltantes.push(mensaje);
            } else if (campo === 'Celular') {
                const celular = datos[campo];

                // Verifica que el celular solo contenga dígitos y tenga exactamente 10 caracteres
                const esNumeroValido = /^\d{10}$/.test(celular);

                if (!esNumeroValido) {
                    mensajesFaltantes.push(mensaje);
                }
            } else if (campo === 'Correo') {
                const Correo = datos[campo];
                const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Correo);
                if (!esCorreoValido) {
                    mensajesFaltantes.push(mensaje);
                }
            }
        });

        if (mensajesFaltantes.length > 0) {
            setCamposFaltantes(mensajesFaltantes);
            setMostrarAlerta(true); // Mostrar alerta
            return false;
        } else {
            setCamposFaltantes([]);
            return true;
        }
    };

    // Evita que la alerta se cierre cuando se hace clic fuera de ella
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMostrarAlerta(false);
    };

    // // Exponer la función de validación
    // useImperativeHandle(ref, () => ({
    //     manejarValidacion: () => {
    //         if (validarCampos()) {
    //             onValid();
    //         }
    //     }
    // }));

    useImperativeHandle(ref, () => ({
        manejarValidacion: async () => {
            return validarCampos(); // true si todo bien, false si error
        }
    }));

    return (
        <div>
            {/* Snackbar con alerta */}
            <Snackbar
                open={mostrarAlerta && camposFaltantes.length > 0} // Solo se abre si hay campos faltantes
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={handleClose}
            >
                <Alert
                    severity="warning"
                    onClose={handleClose}
                    sx={{ width: '100%' }}
                >
                    <div>
                        <ul>
                            {camposFaltantes.map((campo, index) => (
                                <li key={index} style={{ color: '#000000' }}>{campo}</li>
                            ))}
                        </ul>
                    </div>
                </Alert>
            </Snackbar>
        </div>
    );
});

export default FormularioValidator;
