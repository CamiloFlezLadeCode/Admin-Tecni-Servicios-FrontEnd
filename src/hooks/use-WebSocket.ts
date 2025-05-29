import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketIO(url: string) {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const socket = io(url, {
            transports: ['websocket'], // usa sólo websockets, opcional
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🔌 Conectado con Socket.IO, ID:', socket.id);
        });

        //Socket para usuario actulizado
        socket.on('usuario-actualizado', (data) => {
            console.log('📨 Evento usuario-actualizado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'usuario-actualizado', data }]);
        });

        //Socket para vehiculo actualizado
        socket.on('vehiculo-actualizado', (data) => {
            console.log('📨 Evento vehiculo-actualizado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'vehiculo-actualizado', data }]);
        });

        //Socket para vehiculo creado
        socket.on('vehiculo-creado', (data) => {
            console.log('📨 Evento vehiculo-creado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'vehiculo-creado', data }]);
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket desconectado:', reason);
        });

        socket.on('connect_error', (err) => {
            console.error('⚠️ Error de conexión con socket.io:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [url]);

    const sendMessage = (event: string, payload: any) => {
        if (socketRef.current) {
            socketRef.current.emit(event, payload);
        }
    };

    return { sendMessage, messages };
}