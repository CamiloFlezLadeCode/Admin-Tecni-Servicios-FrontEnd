// import axiosInstance from "@/config/axiosConfig";
// import { apiRoutes } from "@/config/apiRoutes";

// export const MostrarAvatar = async (DocumentoUsuarioActivo: string) => {
//     try {
//         const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.cuenta.mostrar_avatar_usuario_activo(DocumentoUsuarioActivo));
//         return data;
//     } catch (error: any) {
//         console.error("Error al mostrar el avatar:", error.response?.data || error.message);
//         throw error;
//     }
// };


import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

/**
 * Devuelve la URL del avatar del usuario, o `null` si no tiene ninguno.
 *
 * Antes esto devolvía directamente la ruta del avatar por defecto, pero esa
 * imagen depende del modo de color (hay una variante clara y otra oscura) y un
 * servicio no puede conocer el tema. Devolviendo `null` la decisión queda en el
 * componente, que sí puede usar `useAvatarPorDefecto()`.
 */
export const MostrarAvatar = async (DocumentoUsuarioActivo: string): Promise<string | null> => {
  const url = apiRoutes.gestionycontrol.cuenta.mostrar_avatar_usuario_activo(DocumentoUsuarioActivo);

  try {
    // HEAD pide solo headers, no descarga la imagen
    await axiosInstance.head(url);
    return url; // La imagen existe
  } catch (error: any) {
    // Sin avatar propio: el componente decidirá qué imagen de reserva usar.
    console.warn("No se encontró el avatar, se usará la imagen por defecto.");
    return null;
  }
};
