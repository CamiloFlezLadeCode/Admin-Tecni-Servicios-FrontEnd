import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ListarNiveles = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-niveles`);
        return data;
    } catch (error) {
        console.log("Error al listar los niveles");
        throw error;
    }
};