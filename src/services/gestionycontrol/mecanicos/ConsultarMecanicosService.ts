import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ConsultarMecanicos = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/ver-mecanicos`);
        return data;
    } catch (error) {
        console.log("Error al consultar los mecánicos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};