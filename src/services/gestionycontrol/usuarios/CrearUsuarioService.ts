import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const CrearUsuario = async (datos: any) => {
    try {
        const { data } = await axios.post(`${apiUrl}/crear-usuario`, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el usuario");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};