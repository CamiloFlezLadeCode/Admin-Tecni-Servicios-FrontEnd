import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const TraerEquipos = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/ver-equipos`);
        return data;
    } catch (error) {
        console.log("Error al consultar los equipos");
        throw error;
    }
};