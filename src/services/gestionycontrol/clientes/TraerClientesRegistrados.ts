import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const TraerClientes = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/verclientes`);
        return data;
    } catch (error) {
        console.log("Error al consultar los clientes");
        throw error;
    }
};