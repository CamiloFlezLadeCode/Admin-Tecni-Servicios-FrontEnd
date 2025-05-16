import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// export const ListarProyectos = async (datos: any) => {
//     try {
//         const { data } = await axios.get(`${apiUrl}/listar-proyectos`, datos);
//         return data;
//     } catch (error) {
//         console.log("Error al listar los proyectos");
//         throw error; // Lanza el error para manejarlo en el controlador
//     }
// };


export const ListarProyectos = async (datos: any) => {
    try {
        const { data } = await axios.get(`${apiUrl}/listar-proyectos`, {
            params: datos, // 👈 esto es clave
        });
        return data;
    } catch (error) {
        console.log("Error al listar los proyectos");
        throw error;
    }
};
