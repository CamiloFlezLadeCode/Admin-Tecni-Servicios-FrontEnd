import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ListarReferencias = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-referencias`);
        return data;
    } catch (error) {
        console.log("Error al listar las referencias");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};