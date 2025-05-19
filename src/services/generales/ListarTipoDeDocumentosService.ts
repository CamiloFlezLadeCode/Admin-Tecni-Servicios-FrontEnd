import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ListarTiposDeDocumentos = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-tipo-de-documentos`);
        return data;
    } catch (error) {
        console.log("Error al listar los tipos de documentos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};