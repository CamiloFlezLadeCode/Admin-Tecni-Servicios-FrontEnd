import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ListarRoles = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-roles`);
        return data;
    } catch (error) {
        console.log("Error al listar los roles");
        throw error;
    }
};