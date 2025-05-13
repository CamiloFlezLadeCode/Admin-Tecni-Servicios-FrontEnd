import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ConsultarProyectos = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/ver-proyectos`);
        return data;
    } catch (error) {
        console.log("Error al consultar los proyectos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};