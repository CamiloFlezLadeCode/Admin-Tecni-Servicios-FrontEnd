import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ListarEquipos = async (datos: any) => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-equipos`, {
            params: datos
        });
        return data;
    } catch (error) {
        console.log("Error al listar los equipos");
        throw error;
    }
};
export default ListarEquipos;