import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ListarCategorias = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-categorias`);
        return data;
    } catch (error) {
        console.log("Error al listar las categorias");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};