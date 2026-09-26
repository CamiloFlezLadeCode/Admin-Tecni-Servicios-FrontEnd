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
 *
 * El endpoint exige token JWT y un `<img src>` no puede enviar el header
 * `Authorization`, así que la imagen se descarga con axios (que sí lo envía) y
 * se devuelve como URL local `blob:`. Quien la use debe liberarla con
 * `URL.revokeObjectURL` cuando la reemplace o se desmonte.
 */
export const MostrarAvatar = async (DocumentoUsuarioActivo: string): Promise<string | null> => {
  const url = apiRoutes.gestionycontrol.cuenta.mostrar_avatar_usuario_activo(DocumentoUsuarioActivo);

  try {
    // Sin parámetro anti-caché: el backend sirve el archivo con `max-age=0` + ETag, así
    // que el navegador siempre revalida y recibe el avatar nuevo tras subirlo. Una URL
    // distinta en cada carga obligaba además a un preflight CORS nuevo cada vez.
    const { data } = await axiosInstance.get<Blob>(url, { responseType: 'blob' });
    return URL.createObjectURL(data);
  } catch (error: any) {
    // Sin avatar propio: el componente decidirá qué imagen de reserva usar.
    console.warn("No se encontró el avatar, se usará la imagen por defecto.");
    return null;
  }
};
