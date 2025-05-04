import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const crearCliente = async (datos: any) => {
    try {
        const { data } = await axios.post(`${apiUrl}/crearclientecompleto`, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el cliente");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};


// export const verificarClienteExistenteService = async (identificacion: string) => {
//     try {
//         const apiUrlCompleta = `${apiUrl}/buscarclientepordocumento/${identificacion}`;
//         console.log('Consultando en la URL:', apiUrlCompleta); // Log para verificar la URL completa

//         const { data } = await axios.get(apiUrlCompleta);

//         if (data.encontrado) {
//             return (true); // Devuelve los datos del cliente si es encontrado
//         } else {
//             return (false); // Si no se encuentra el cliente
//         }
//     } catch (error) {
//         console.error('❌ Error al verificar cliente:', error);
//         return { encontrado: false, cliente: null }; // En caso de error, devuelve un estado falso
//     }
// };

export const verificarClienteExistenteService = async (identificacion: string) => {
    try {
        const apiUrlCompleta = `${apiUrl}/buscarclientepordocumento/${identificacion}`;
        console.log('Consultando en la URL:', apiUrlCompleta); // Log para verificar la URL completa

        // Realizamos la consulta
        const { data } = await axios.get(apiUrlCompleta);
        
        // Depuramos el contenido de la respuesta
        console.log('Respuesta de la API:', data);

        // Verificamos si la respuesta tiene el campo 'encontrado'
        if (!('encontrado' in data)) {
            console.warn('La respuesta no tiene el campo esperado "encontrado".', data);
            return { encontrado: false, cliente: null };
        }

        // Si el campo 'encontrado' es verdadero, devolvemos true
        if (data.encontrado) {
            return true; // El cliente existe
        } else {
            return false; // El cliente no existe
        }
    } catch (error) {
        console.error('❌ Error al verificar cliente:', error);
        return { encontrado: false, cliente: null }; // En caso de error, devolvemos estado falso
    }
};