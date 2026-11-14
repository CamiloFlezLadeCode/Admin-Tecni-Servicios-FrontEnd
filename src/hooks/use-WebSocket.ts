import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Entorno = 'Produccion' | 'Desarrollo';

const ENTORNO = (process.env.NEXT_PUBLIC_ENTORNO as Entorno) ?? 'Desarrollo';

const URLS: Record<Entorno, string | undefined> = {
    Produccion: process.env.NEXT_PUBLIC_WS_URL_PRODUCTION,
    Desarrollo: process.env.NEXT_PUBLIC_WS_URL_DEVELOPMENT,
};

const SOCKET_URL = URLS[ENTORNO] ?? 'ws://localhost:3000';

/** Eventos que el servidor emite tras cada mutación y que las vistas escuchan. */
const EVENTOS_ESCUCHADOS = [
    // Usuarios
    'usuario-actualizado',
    'usuario-creado',
    // Vehículos
    'vehiculo-creado',
    'vehiculo-actualizado',
    'vehiculo-eliminado',
    // Equipos
    'equipo-actualizado',
    'equipo-creado',
    // Repuestos
    'repuesto-creado',
    'repuesto-actualizado',
    // Cuenta
    'avatar-guardado',
    'informacion-usuario-activo-actualizada',
    // Proyectos
    'proyecto-creado',
    'proyecto-actualizado',
    // Remisiones
    'remision-creada',
    'remision-eliminada',
    // Órdenes de servicio
    'orden-de-servicio-creada',
    'orden-de-servicio-eliminada',
    // Devoluciones
    'devolucion-creada',
    'devolucion-eliminada',
    'devolucion-actualizada',
    // Bodegas
    'bodega-creada',
    'bodega-actualizada',
    // Inventario de equipos
    'entrada-equipos-creada',
    'salida-equipos-creada',
    // Inventario de repuestos
    'entrada-repuestos-creada',
    'salida-repuestos-creada',
] as const;

export function useSocketIO() {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // const socket = io(SOCKET_URL, {
        //     transports: ['websocket'], // usa sólo websockets, opcional
        // });

        /** Configuración de WebSocket para evitar desconexiones inesperadas */
        const socket = io(SOCKET_URL, {
            // 🔹 TRANSPORTES
            transports: ['websocket', 'polling'], // IMPORTANTE: no usar solo websocket

            // 🔹 RECONEXIÓN AUTOMÁTICA
            reconnection: true,
            reconnectionAttempts: Infinity,       // Intentar reconectar indefinidamente
            reconnectionDelay: 1000,              // 1 segundo entre intentos
            reconnectionDelayMax: 5000,           // Máximo 5 segundos

            // 🔹 TIMEOUTS (deben coincidir con el servidor)
            timeout: 45000,                       // Tiempo de espera para conexión
            // pingTimeout: 30000,
            // pingInterval: 15000,

            // 🔹 POLÍTICA DE RECONEXIÓN INTELIGENTE
            randomizationFactor: 0.5,             // Variación en delays de reconexión

            // 🔹 AUTO-CONEXIÓN Y ESTADO
            autoConnect: true,                    // Conectar automáticamente
            forceNew: false,                      // Reutilizar conexión si es posible

            // 🔹 CREDENCIALES Y CORS
            withCredentials: true,                // IMPORTANTE para cookies/sesiones

            // 🔹 ESTRATEGIA DE FALLO
            transportOptions: {
                polling: {
                    extraHeaders: {
                        // Headers personalizados si los necesitas
                    }
                }
            },

            // 🔹 DETECCIÓN DE DESCONEXIÓN
            closeOnBeforeunload: false,           // No cerrar al recargar página
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            // console.log('🔌 Conectado con Socket.IO, ID:', socket.id);
            if (socket.id) sessionStorage.setItem('Conectado con Socket.IO, ID:', socket.id);
        });

        // Cada evento de negocio se acumula en `messages` como { tipo, data }
        for (const evento of EVENTOS_ESCUCHADOS) {
            socket.on(evento, (data) => {
                setMessages((prev) => [...prev, { tipo: evento, data }]);
            });
        }

        // SOCKET DESCONECTADO
        socket.on('disconnect', (reason) => {
            // console.log('❌ Socket desconectado:', reason);
            if (reason) sessionStorage.setItem('Socket desconectado:', reason);
        });
        // ...

        // ERROR DE CONEXIÓN EN EL SOCKET
        socket.on('connect_error', (err) => {
            console.error('⚠️ Error de conexión con socket.io:', err);
        });
        // ...

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = (event: string, payload: any) => {
        if (socketRef.current) {
            socketRef.current.emit(event, payload);
        }
    };

    return { sendMessage, messages };
}