import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Entorno = 'Produccion' | 'Desarrollo';

const ENTORNO = (process.env.NEXT_PUBLIC_ENTORNO as Entorno) ?? 'Desarrollo';

const URLS: Record<Entorno, string | undefined> = {
    Produccion: process.env.NEXT_PUBLIC_WS_URL_PRODUCTION,
    Desarrollo: process.env.NEXT_PUBLIC_WS_URL_DEVELOPMENT,
};

const SOCKET_URL = URLS[ENTORNO] ?? 'ws://localhost:3000';

export function useSocketIO() {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'], // usa sólo websockets, opcional
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            // console.log('🔌 Conectado con Socket.IO, ID:', socket.id);
            socket.id ? sessionStorage.setItem('Conectado con Socket.IO, ID:', socket.id) : null;
        });

        //SOCKETS PARA USUARIOS
        //Socket para usuario actulizado
        socket.on('usuario-actualizado', (data) => {
            //console.log('📨 Evento usuario-actualizado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'usuario-actualizado', data }]);
        });
        //Socket para usuario creado
        socket.on('usuario-creado', (data) => {
            //console.log('📨 Evento usuario-creado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'usuario-creado', data }]);
        })
        // ...

        // SOCKETS PARA VEHÍCULOS
        //Socket para vehiculo creado
        socket.on('vehiculo-creado', (data) => {
            //console.log('📨 Evento vehiculo-creado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'vehiculo-creado', data }]);
        });

        //Socket para vehiculo actualizado
        socket.on('vehiculo-actualizado', (data) => {
            //console.log('📨 Evento vehiculo-actualizado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'vehiculo-actualizado', data }]);
        });

        // Socket para equipo eliminado
        socket.on('vehiculo-eliminado', (data) => {
            //console.log('📨 Evento vehiculo-eliminado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'vehiculo-eliminado', data }]);
        })
        // ...

        //SOCKETS PARA EQUIPOS
        //Para equipo actualizado
        socket.on('equipo-actualizado', (data) => {
            //console.log('📨 Evento equipo-actualizado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'equipo-actualizado', data }]);
        });
        //Para equipo creado
        socket.on('equipo-creado', (data) => {
            //console.log('📨 Evento equipo-creado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'equipo-creado', data }]);
        });
        //...

        // SOCKETS PARA REPUESTOS
        // Para repuesto creado
        socket.on('repuesto-creado', (data) => {
            //console.log('📨 Evento repuesto-creado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'repuesto-creado', data }]);
        });
        // Para repuesto actualizado
        socket.on('repuesto-actualizado', (data) => {
            //console.log('📨 Evento repuesto-actualizado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'repuesto-actualizado', data }]);
        });
        // ...

        // SOCKETS PARA CUENTA
        // Para avatar guardado en servidor
        socket.on('avatar-guardado', (data) => {
            //console.log('📨 Evento avatar-guardado recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'avatar-guardado', data }]);
        });
        // Para actualizar información usuario actual activo
        socket.on('informacion-usuario-activo-actualizada', (data) => {
            //console.log('📨 Evento informacion-usuario-activo-actualizada recibido:', data);
            setMessages((prev) => [...prev, { tipo: 'informacion-usuario-activo-actualizada', data }]);
        })
        // ...

        // SOCKETS PARA PROYECTOS
        // Para crear proyecto
        socket.on('proyecto-creado', (data) => {
            setMessages((prev) => [...prev, { tipo: 'proyecto-creado', data }]);
        });
        // Para actualizar proyecto
        socket.on('proyecto-actualizado', (data) => {
            setMessages((prev) => [...prev, { tipo: 'proyecto-actualizado', data }]);
        });
        // ...

        // SOCKET PARA REMISIONES
        // Para crear remisión creada
        socket.on('remision-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'remision-creada', data }]);
        });
        // Para remisión eliminada
        socket.on('remision-eliminada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'remision-eliminada', data }]);
        });
        // ...

        // SOCKET PARA ORDENES DE SERVICIO
        // Para orden de servicio creada
        socket.on('orden-de-servicio-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'orden-de-servicio-creada', data }]);
        });
        // Para orden de servicio eliminada
        socket.on('orden-de-servicio-eliminada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'orden-de-servicio-eliminada', data }]);
        });
        // ...

        // SOCKET PARA DEVOLUCIONES
        // Para devolución creada
        socket.on('devolucion-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'devolucion-creada', data }]);
        });
        // Para devolución eliminada
        socket.on('devolucion-eliminada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'devolucion-eliminada', data }]);
        });
        // ...

        // SOCKET PARA BODEGAS
        // Para bodega creada
        socket.on('bodega-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'bodega-creada', data }]);
        });
        // Para bodega actualizada
        socket.on('bodega-actualizada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'bodega-actualizada', data }]);
        });
        // ...

        // SOCKET PARA INVENTARIO DE EQUIPOS
        socket.on('entrada-equipos-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'entrada-equipos-creada', data }]);
        });
        // ...

        // SOCKET PARA INVENTARIO DE REPUESTOS
        socket.on('entrada-repuestos-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'entrada-repuestos-creada', data }]);
        });
        socket.on('salida-repuestos-creada', (data) => {
            setMessages((prev) => [...prev, { tipo: 'salida-repuestos-creada', data }]);
        });

        // SOCKET DESCONECTADO
        socket.on('disconnect', (reason) => {
            // console.log('❌ Socket desconectado:', reason);
            reason ? sessionStorage.setItem('Socket desconectado:', reason) : null;
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