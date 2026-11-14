import * as React from 'react';

/**
 * Progreso aproximado mientras se guarda: sube 10 puntos cada 20 s hasta 80,
 * llega a 100 al terminar y vuelve a 0 si falla.
 */
export function useProgresoSimulado() {
    const [progreso, setProgreso] = React.useState(0);
    const [cargando, setCargando] = React.useState(false);

    async function ejecutar<T>(tarea: () => Promise<T>): Promise<T> {
        let intervalo: ReturnType<typeof setInterval> | null = null;
        try {
            setCargando(true);
            let actual = 0;
            intervalo = setInterval(() => {
                if (actual < 80) {
                    actual += 10;
                    setProgreso(actual);
                }
            }, 20000);
            const resultado = await tarea();
            clearInterval(intervalo);
            setProgreso(100);
            return resultado;
        } catch (error) {
            if (intervalo) clearInterval(intervalo);
            setProgreso(0);
            throw error;
        } finally {
            setCargando(false);
        }
    }

    return { progreso, cargando, ejecutar };
}
