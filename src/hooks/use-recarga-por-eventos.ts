import * as React from 'react';

/**
 * Recarga una tabla (conservando página y búsqueda) cuando el último evento
 * recibido por socket es uno de `eventos`.
 */
export function useRecargaPorEventos(
    messages: ReadonlyArray<{ tipo: string }>,
    eventos: readonly string[],
    recargar: () => void
): void {
    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];
            if (eventos.includes(ultimoMensaje.tipo)) {
                recargar();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- solo reacciona a mensajes nuevos
    }, [messages]);
}
