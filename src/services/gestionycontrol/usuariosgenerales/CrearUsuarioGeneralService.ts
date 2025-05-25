import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const CrearUsuarioGeneral = async (datos: any) => {
    try {
        const { data } = await axios.post(`${apiUrl}/crear-usuario-general`, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el usuario general");
        throw error;
    }
};