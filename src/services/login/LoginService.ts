import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const Login = async (datos: { NombreUsuario: string; ClaveUsuario: string }) => {
    try {
        const response = await axios.post(`${apiUrl}/login`, datos);
        
        // Manejar la respuesta, por ejemplo, guardando los datos en el estado o en el almacenamiento local
        if (response.status === 200) {
            const { credenciales, rol, nombre, documento } = response.data;
            console.log('Credenciales obtenidas:', credenciales);
            console.log('Rol del usuario:', rol);
            console.log('Nombre del usuario:', nombre);
            console.log('Documento del usuario:', documento);
            // Aquí puedes guardar los datos en el estado o en el almacenamiento local
            return { credenciales, rol, nombre, documento };
        }
    } catch (error) {
        console.error('Error al consultar las credenciales => ', error);
        throw new Error('No se pudo iniciar sesión. Intenta nuevamente.');
    }
};