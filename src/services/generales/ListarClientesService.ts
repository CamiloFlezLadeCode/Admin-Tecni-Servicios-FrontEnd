import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ListarClientes = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-clientes`);
        return data;
    } catch (error) {
        console.log("Error al listar los clientes");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};